export type Category = {
  id: number
  slug: string
  label: string
  image_url: string
}

export type CategoryArticle = {
  id: string
  name: string
  slug: string
}

export type CategoryData = {
  name: string
  description: string
  articles: CategoryArticle[]
}

export type HeadingBlock = {
  type: 'heading'
  text: string
  level: number
}

export type ParagraphBlock = {
  type: 'paragraph'
  text: string
  bold: boolean
}

export type Segment = {
  text: string
  bold: boolean
  link: string | null
}

export type RichParagraphBlock = {
  type: 'rich_paragraph'
  segments: Segment[]
}

export type ListBlock = {
  type: 'list'
  items: string[]
  ordered: boolean
}

export type ContentBlock = HeadingBlock | ParagraphBlock | RichParagraphBlock | ListBlock

export type SignpostingOrg = {
  name: string
  description: string
  url: string
  image_url: string
}

export type Article = {
  id: string
  title: string
  category_slug: string
  category_label: string
  last_updated: string
  content: ContentBlock[]
  signposting: SignpostingOrg[]
  source_url: string
}

export type ContactUsPage = {
  name: string
  absolute_url: string
  main_content: ContentBlock[]
}

export type ArticlesData = {
  categories: Category[]
  category_articles: Record<string, CategoryData>
  articles: Record<string, Article>
  contact_us?: ContactUsPage
}
