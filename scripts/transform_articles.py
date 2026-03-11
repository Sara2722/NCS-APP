"""
Transform scraped info into structured JSON for the mobile frontend.

Reads the raw Webflow HTML scrape and outputs clean, typed content blocks
that can be rendered directly as RN components

Input is a JSON Named NCSInfoHubArticles.json
"""

import json
import os
import re
from html.parser import HTMLParser

# Constants


# Known Webflow CDN image URLs
# we should either scrape the rest or not show icons
CATEGORY_IMAGES = {
    "work": "https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e08c44f677337b5cd9b7_Work(1).png",
    "health": "https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e1cfc45c4d79d1815feb_Work(2).png",
    "housing": "https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e26cf789f0bd643ad01b_Work(3).png",
    "family-and-society": "https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e26c5974d3bfb1b07f65_Work(4).png",
    "money-matters": "",
    "living-life": "",
    "criminal-justice-system": "",
    "defending-your-rights": "",
    "for-professionals": "",
}

CATEGORY_LABELS = {
    "work": "Work",
    "health": "Health",
    "housing": "Housing",
    "family-and-society": "Family & Society",
    "money-matters": "Money Matters",
    "living-life": "Living Life",
    "criminal-justice-system": "Criminal Justice System",
    "defending-your-rights": "Defending Your Rights",
    "for-professionals": "For Professionals",
}


# Utilities

def make_slug(name: str) -> str:
    # Convert name to URL-safe slug
    slug = name.lower().strip()
    # remove zero-width chars and non-breaking spaces
    slug = slug.replace("\u200d", "").replace("\u00a0", " ")
    # Remove special chars except hyphens and spaces
    slug = re.sub(r"[^\w\s-]", "", slug)
    # replace spaces/underscores with hyphens
    slug = re.sub(r"[\s_]+", "-", slug)
    # change multiple hyphens to 1
    slug = re.sub(r"-+", "-", slug)
    slug = slug.strip("-")
    return slug


def clean_text(text: str) -> str:
    # Strip zero-width joiners and clean up whitespace
    text = text.replace("\u200d", "")
    # Replace weird space with regular space
    text = text.replace("\u00a0", " ")
    # multiple spaces become 1 space, newlines stay as they are
    text = re.sub(r"[^\S\n]+", " ", text)
    return text.strip()


# HTML to Content Blocks Parser

class ContentBlockParser(HTMLParser):
    """
    Parse Webflow-generated HTML into typed content blocks for RN

    Block types:
    - {"type": "heading", "text": "...", "level": 2|3|4}
    - {"type": "paragraph", "text": "...", "bold": true|false}
    - {"type": "rich_paragraph", "segments": [{"text", "bold", "link"}, ...]}
    - {"type": "list", "items": ["..."], "ordered": true|false}
    """

    HEADING_TAGS = {"h2", "h3", "h4"}

    def __init__(self):
        super().__init__()
        self.blocks = []

        # Para state
        self.in_paragraph = False
        self.segments = []         # list of {"text", "bold", "link"}
        self.current_text = ""

        # Heading state
        self.in_heading = False
        self.heading_level = 0
        self.heading_text = ""

        # List state
        self.in_list = False
        self.list_ordered = False
        self.list_items = []
        self.in_list_item = False
        self.list_item_text = ""

        # Inline formatting
        self.bold_depth = 0
        self.link_url = None

        # Skip flags
        self.skip_depth = 0        # for skipping random webflow divs
        self.is_footer = False     # for skipping footers
        self.div_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        class_name = attrs_dict.get("class", "")

        # Track depth for skip handling
        if tag == "div":
            self.div_depth += 1
            if "w-dyn-bind-empty" in class_name:
                self.skip_depth = self.div_depth
                return
            if self.skip_depth:
                return

        if self.skip_depth:
            return

        if "footer-text" in class_name:
            self.is_footer = True
            return

        if self.is_footer:
            return

        # Headings
        if tag in self.HEADING_TAGS:
            self._flush_paragraph()
            self.in_heading = True
            self.heading_level = int(tag[1])
            self.heading_text = ""
            return

        # paras
        if tag == "p":
            if not self.in_heading and not self.in_list_item:
                self._flush_paragraph()
                self.in_paragraph = True
                self.segments = []
                self.current_text = ""
            return

        # Lists
        if tag in ("ul", "ol"):
            self._flush_paragraph()
            self.in_list = True
            self.list_ordered = tag == "ol"
            self.list_items = []
            return

        if tag == "li":
            self.in_list_item = True
            self.list_item_text = ""
            return

        # inline bold
        if tag in ("strong", "b"):
            if self.in_heading:
                return  # ignore bold in headings
            self.bold_depth += 1
            if self.in_paragraph:
                self._flush_segment()
            return

        # inline links
        if tag == "a":
            href = attrs_dict.get("href", "")
            if self.in_paragraph:
                self._flush_segment()
            self.link_url = href
            return

        # Line breaks
        if tag == "br":
            if self.in_heading:
                self.heading_text += "\n"
            elif self.in_list_item:
                self.list_item_text += "\n"
            elif self.in_paragraph:
                self.current_text += "\n"
            return

    def handle_endtag(self, tag):
        if tag == "div":
            if self.skip_depth and self.div_depth == self.skip_depth:
                self.skip_depth = 0
            self.div_depth -= 1
            if self.div_depth <= 0:
                # end of a content div — flush any remaining state
                self.is_footer = False
            return

        if self.skip_depth or self.is_footer:
            return

        # Headings
        if tag in self.HEADING_TAGS and self.in_heading:
            text = clean_text(self.heading_text)
            if text:
                self.blocks.append({
                    "type": "heading",
                    "text": text,
                    "level": self.heading_level,
                })
            self.in_heading = False
            self.heading_text = ""
            return

        # Paragraphs
        if tag == "p":
            if self.in_paragraph and not self.in_list_item:
                self._flush_segment()
                self._emit_paragraph()
                self.in_paragraph = False
            return

        # Lists
        if tag == "li":
            text = clean_text(self.list_item_text)
            if text:
                self.list_items.append(text)
            self.in_list_item = False
            self.list_item_text = ""
            return

        if tag in ("ul", "ol"):
            if self.list_items:
                self.blocks.append({
                    "type": "list",
                    "items": self.list_items,
                    "ordered": self.list_ordered,
                })
            self.in_list = False
            self.list_items = []
            return

        # Inline: bold
        if tag in ("strong", "b"):
            if self.in_heading:
                return
            if self.bold_depth > 0:
                self.bold_depth -= 1
            if self.in_paragraph:
                self._flush_segment()
            return

        # Inline: links
        if tag == "a":
            if self.in_paragraph:
                self._flush_segment()
            self.link_url = None
            return

    def handle_data(self, data):
        if self.skip_depth or self.is_footer:
            return

        if self.in_heading:
            self.heading_text += data
            return

        if self.in_list_item:
            self.list_item_text += data
            return

        if self.in_paragraph:
            self.current_text += data
            return

    def _flush_segment(self):
        # push current_text as a segment with current formatting state
        if self.current_text:
            self.segments.append({
                "text": self.current_text,
                "bold": self.bold_depth > 0,
                "link": self.link_url,
            })
            self.current_text = ""

    def _emit_paragraph(self):
        # convert collected segments into a paragraph or rich_paragraph block.
        if not self.segments:
            return

        # check if all segments are basically empty
        full_text = "".join(seg["text"] for seg in self.segments)
        cleaned = clean_text(full_text)
        if not cleaned:
            return

        # clean segment text
        cleaned_segments = []
        for seg in self.segments:
            text = seg["text"]
            # preserve leading/trailing spaces for inline flow
            text = text.replace("\u200d", "").replace("\u00a0", " ")
            if text:
                cleaned_segments.append({
                    "text": text,
                    "bold": seg["bold"],
                    "link": seg["link"],
                })

        if not cleaned_segments:
            return

        # check if this is a simple paragraph (no links, uniform bold)
        has_links = any(seg["link"] for seg in cleaned_segments)
        all_bold = all(seg["bold"] for seg in cleaned_segments)
        any_bold = any(seg["bold"] for seg in cleaned_segments)

        if not has_links and not (any_bold and not all_bold):
            # simple paragraph
            text = clean_text(full_text)
            if text:
                self.blocks.append({
                    "type": "paragraph",
                    "text": text,
                    "bold": all_bold,
                })
        else:
            # Rich paragraph with mixed formatting
            self.blocks.append({
                "type": "rich_paragraph",
                "segments": cleaned_segments,
            })

    def _flush_paragraph(self):

        if self.in_paragraph:
            self._flush_segment()
            self._emit_paragraph()
            self.in_paragraph = False
            self.segments = []
            self.current_text = ""


def parse_html_content(html_chunks: list[str]) -> list[dict]:
    # parse a list of HTML strings into content blocks, skip empty/footer divs
    all_blocks = []
    for chunk in html_chunks:
        if "w-dyn-bind-empty" in chunk:
            continue
        if "footer-text" in chunk:
            continue

        parser = ContentBlockParser()
        parser.feed(chunk)
        # flush remaining state
        parser._flush_paragraph()
        all_blocks.extend(parser.blocks)

    return all_blocks


# Signposting Parser

class SignpostingParser(HTMLParser):
    # Extract organisation data from signposting HTML

    def __init__(self):
        super().__init__()
        self.orgs = []
        self.current_org = None
        self.current_tag = None
        self.current_class = ""
        self.in_link = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        self.current_class = attrs_dict.get("class", "")

        if tag == "a" and "signpost-wrap-topic" in self.current_class:
            self.current_org = {
                "name": "",
                "description": "",
                "url": attrs_dict.get("href", ""),
                "image_url": "",
            }
            self.in_link = True
            return

        if not self.in_link or not self.current_org:
            return

        if tag == "img":
            self.current_org["image_url"] = attrs_dict.get("src", "")
            # Use alt as fallback name
            alt = attrs_dict.get("alt", "")
            if alt and not self.current_org["name"]:
                self.current_org["name"] = alt
            return

        self.current_tag = tag

    def handle_endtag(self, tag):
        if tag == "a" and self.in_link and self.current_org:
            if self.current_org["name"]:
                self.orgs.append(self.current_org)
            self.current_org = None
            self.in_link = False

        self.current_tag = None

    def handle_data(self, data):
        if not self.in_link or not self.current_org:
            return

        text = data.strip()
        if not text:
            return

        if "paragraph-10" in self.current_class:
            self.current_org["name"] = text
        elif "paragraph-3-topic" in self.current_class:
            self.current_org["description"] = text


def parse_signposting(html_string: str) -> list[dict]:
    # Extract organisations from signposting HTML
    if not html_string:
        return []
    if "w-dyn-empty" in html_string or "w-condition-invisible" in html_string:
        return []

    parser = SignpostingParser()
    parser.feed(html_string)
    return parser.orgs


# Main Transform Pipeline

def transform(source_path: str) -> dict:
    # transform the scraped JSON into structured output for frontend
    with open(source_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert data["name"] == "root", f"Expected root node, got {data['name']}"
    categories_raw = data["children"]

    output = {
        "categories": [],
        "category_articles": {},
        "articles": {},
    }

    seen_slugs = set()

    for cat_idx, category in enumerate(categories_raw, start=1):
        cat_slug = category["name"]  # already slug from the scrape
        cat_label = CATEGORY_LABELS.get(
            cat_slug, cat_slug.replace("-", " ").title()
        )
        cat_image = CATEGORY_IMAGES.get(cat_slug, "")

        # home screen category
        output["categories"].append({
            "id": cat_idx,
            "slug": cat_slug,
            "label": cat_label,
            "image_url": cat_image,
        })

        # articles in this category
        article_summaries = []

        for art_idx, article_wrapper in enumerate(category.get("children", []), start=1):
            # actual article detail is the first child
            details_list = article_wrapper.get("children", [])
            if not details_list:
                continue
            detail = details_list[0]

            article_name = detail.get("title", article_wrapper.get("name", ""))
            article_slug = make_slug(article_name)

            # ensure slug uniqueness
            original_slug = article_slug
            counter = 2
            while article_slug in seen_slugs:
                article_slug = f"{original_slug}-{counter}"
                counter += 1
            seen_slugs.add(article_slug)

            article_id = f"{cat_idx}_{art_idx}"

            # Parse content
            content_blocks = parse_html_content(
                detail.get("main_content", [])
            )

            # Parse signposting
            signposting = parse_signposting(
                detail.get("signposting", "")
            )

            # article summary for category listing
            article_summaries.append({
                "id": article_id,
                "name": article_name.strip().replace("\u00a0", " "),
                "slug": article_slug,
            })

            # full article data
            output["articles"][article_slug] = {
                "id": article_id,
                "title": article_name.strip().replace("\u00a0", " "),
                "category_slug": cat_slug,
                "category_label": cat_label,
                "last_updated": detail.get("last_updated", ""),
                "content": content_blocks,
                "signposting": signposting,
                "source_url": detail.get("article_absolute_url", ""),
            }

        output["category_articles"][cat_slug] = {
            "name": cat_label,
            "description": "",  # Not available in scrape, can be added manually
            "articles": article_summaries,
        }

    return output


# Main

def main():
    # get paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    source_path = os.path.join(project_root, "NCSInfoHubArticles.json")
    output_path = os.path.join(script_dir, "output", "articles.json")

    if not os.path.exists(source_path):
        print(f"Error: Source file not found at {source_path}")
        return

    output = transform(source_path)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # summary
    print(f"Output written to: {output_path}")
    print(f"Number of Categories: {len(output['categories'])}")
    print(f"Number of articles: {len(output['articles'])}")
    print()
    for cat_slug, cat_data in output["category_articles"].items():
        print(f"  {cat_slug}: {len(cat_data['articles'])} articles")

    # print signposting stats
    with_signposting = sum(
        1 for a in output["articles"].values() if a["signposting"]
    )
    print(f"\nArticles with signposting: {with_signposting}/{len(output['articles'])}")


if __name__ == "__main__":
    main()
