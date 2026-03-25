import { useQuery } from '@tanstack/react-query'
import type { ArticlesData } from '@/types/articles'
import { ARTICLES_QUERY_KEY } from '@/lib/queryClient'

export { queryClient } from '@/lib/queryClient'

const ARTICLES_API = 'https://api.nextchapterscotland.org.uk/articles.json'

async function fetchArticles(): Promise<ArticlesData> {
  const res = await fetch(ARTICLES_API)
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export function useArticles() {
  return useQuery({
    queryKey: ARTICLES_QUERY_KEY,
    queryFn: fetchArticles,
  })
}
