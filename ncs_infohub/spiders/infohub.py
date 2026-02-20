from typing import Any, Optional
from scrapy import Spider, Request, signals
from scrapy.http import Response
from scrapy.exceptions import CloseSpider
from urllib.parse import urljoin
from anytree import Node, NodeMixin, RenderTree
from anytree.exporter.jsonexporter import JsonExporter


class ArticleItem(NodeMixin):
    name: str
    absolute_url: str
    title: str
    last_updated: str
    main_content: list[str]
    related_blogs: Optional[str]
    signposting: Optional[str]

    def __init__(
        self,
        parent,
        article_absolute_url: str,
        title: str,
        last_updated: str,
        main_content: list[str],
        related_blogs: Optional[str],
        signposting: Optional[str],
    ):
        self.parent = parent
        self.article_absolute_url = article_absolute_url
        self.title = title
        self.last_updated = last_updated
        self.main_content = main_content
        self.related_blogs = related_blogs
        self.signposting = signposting


class InfohubSpider(Spider):
    name = "infohub"
    allowed_domains = [
        "www.nextchapterscotland.org.uk",
    ]

    root = Node("root")

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(InfohubSpider, cls).from_crawler(
            crawler, *args, **kwargs
        )
        crawler.signals.connect(
            spider.spider_closed, signal=signals.spider_closed
        )
        return spider

    async def start(self):
        yield Request(
            url="https://www.nextchapterscotland.org.uk/information-hub",
            callback=self.parse_infohub_main_page,
        )

    def parse_article(self, response: Response):
        # Things to consider:
        # Each page has 1 <h1> title, article content in N >= 1 rich text
        # blocks, a 'last updated' section and then up to 2 additional
        # sections:
        #   1. Related Blogs
        #   2. Signposting
        # Unfortunately it doesn't appear to be consistently structured across
        # articles
        meta = response.meta
        topic_article: Node = meta["topic_article"]

        h1s = response.css("h1")
        if not h1s:
            raise CloseSpider(
                f"Couldn't find a title for {response.url}. Please check the article format hasn't changed"
            )
        elif len(h1s) > 1:
            self.logger.warning(
                f"Found more than 1 title for {response.url}. Using the first one found..."
            )

        title: str = h1s[0].css("::text").get("Unknown title")
        content = response.css(".w-richtext").getall()
        if not content:
            raise CloseSpider(
                f"Couldn't find any article content for {response.url}. Please check the article format hasn't changed"
            )

        last_updated = response.css(".updated-date-text::text").get(
            "Unknown date"
        )

        maybe_related_blogs = response.css(".section-related-blogs").get()
        maybe_signposting = (
            response.css("p.signposting-topic-page").xpath("../..")[0].get()
        )

        yield ArticleItem(
            topic_article,
            response.url,
            title,
            last_updated,
            content,
            maybe_related_blogs,
            maybe_signposting,
        )

    def parse_article_list_page(self, response: Response):
        meta = response.meta
        topic: Node = meta["topic"]

        # Example article 'list item' structure:
        # <div role="listitem" class="info-hub-item w-dyn-item">
        #   <a href="http://www.nextchapterscotland.org.uk/topic/disclosure-levels-2025" class="info-hub-link w-inline-block">
        #     <h1 class="heading-24">Disclosure Levels</h1>
        #   </a>
        # </div>
        articles = response.css(".info-hub-list > div > a")

        if not articles:
            self.logger.error(RenderTree(meta["root"]))
            raise CloseSpider(f"Could not find articles at {response.url}")

        for article in articles:
            article_title = article.css("h1::text").get()
            if not article_title:
                raise CloseSpider(
                    f"Could not find article title at {response.url}"
                )

            article_absolute_url = article.css("::attr(href)").get()
            if not article_absolute_url:
                raise CloseSpider(
                    f"Could not find article URL for {article_title}"
                )

            topic_article = Node(
                article_title,
                parent=topic,
                article_absolute_url=article_absolute_url,
            )
            meta["topic_article"] = topic_article

            yield Request(
                url=article_absolute_url,
                callback=self.parse_article,
                meta=meta,
            )

    def parse_infohub_main_page(self, response: Response):
        buttons = response.css(
            'section div[id^="w-node-_"][class*="quick-stack-"] > div'
        )

        if not buttons:
            raise CloseSpider(f"Could not find buttons at {response.url}")

        for div in buttons:
            # Example 'button' structure:
            #
            # <div class="w-layout-cell">
            #   <a href="/family-and-society" class="w-inline-block">
            #     <img src="https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e26c5974d3bfb1b07f65_Work(4).png"
            #          loading="lazy" sizes="(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px"
            #          srcset="<removed for legibility>"
            #          alt="">
            #   </a>
            # </div>
            button_relative_url = div.css("a::attr(href)").get()
            if not button_relative_url:
                raise CloseSpider(
                    f"Could not find page link for button at {response.url}"
                )

            button_img_url = div.css("a img::attr(src)").get()
            if not button_img_url:
                raise CloseSpider(
                    f"Could not find image for button at {response.url}"
                )

            button_absolute_url = urljoin(response.url, button_relative_url)
            meta: dict[str, Any] = {"root": self.root}
            # The Training page is a special case which does not follow the
            # same structure as the other pages. TODO ask whether this should
            # included in the app
            # for now it is being skipped, but we could optionally redirect
            # to a login screen in the user's default browser
            if not "training-new" in button_relative_url:
                topic_name = button_relative_url.replace("/", "")
                topic = Node(topic_name, self.root)
                meta["topic"] = topic

                yield Request(
                    url=button_absolute_url,
                    callback=self.parse_article_list_page,
                    meta=meta,
                )

    def spider_closed(self, spider):
        with open("./NCSInfoHubArticles.json", "w") as to_export:
            JsonExporter(sort_keys=False, indent=4).write(self.root, to_export)
