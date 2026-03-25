import { StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useMemo } from 'react'
import TopBar from '@/components/TopBar'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useArticles } from '@/hooks/useArticles'
import type { Article } from '@/types/articles'

type SearchResult = {
  id: string
  slug: string
  title: string
  categorySlug: string
  categoryLabel: string
  excerpt: string
}

type InternalSearchableArticle = {
  slug: string
  title: string
  categorySlug: string
  categoryLabel: string
  rawText: string
  lowerText: string
}

function buildArticleText(article: Article): { rawText: string; lowerText: string } {
  const pieces: string[] = []

  if (article.title) {
    pieces.push(article.title)
  }

  for (const block of article.content) {
    switch (block.type) {
      case 'heading':
        pieces.push(block.text)
        break
      case 'paragraph':
        pieces.push(block.text)
        break
      case 'rich_paragraph':
        pieces.push(block.segments.map((s) => s.text).join(' '))
        break
      case 'list':
        pieces.push(block.items.join(' '))
        break
      default:
        break
    }
  }

  const rawText = pieces.join(' ').replace(/\s+/g, ' ').trim()
  const lowerText = rawText.toLowerCase()
  return { rawText, lowerText }
}

function getExcerpt(
  rawText: string,
  lowerText: string,
  tokens: string[],
  contextChars = 80
): string {
  if (!rawText) return ''

  let matchIndex = -1

  for (const token of tokens) {
    const idx = lowerText.indexOf(token)
    if (idx !== -1 && (matchIndex === -1 || idx < matchIndex)) {
      matchIndex = idx
    }
  }

  if (matchIndex === -1) {
    if (rawText.length <= contextChars * 2) return rawText
    const end = rawText.indexOf(' ', contextChars * 2)
    const snippet = rawText.slice(0, end === -1 ? contextChars * 2 : end).trim()
    return snippet + '...'
  }

  const start = Math.max(0, matchIndex - contextChars)
  const end = Math.min(rawText.length, matchIndex + contextChars)

  let snippetStart = start
  if (snippetStart > 0) {
    const prevSpace = rawText.lastIndexOf(' ', snippetStart)
    if (prevSpace !== -1) snippetStart = prevSpace + 1
  }

  let snippetEnd = end
  if (snippetEnd < rawText.length) {
    const nextSpace = rawText.indexOf(' ', snippetEnd)
    if (nextSpace !== -1) snippetEnd = nextSpace
  }

  let snippet = rawText.slice(snippetStart, snippetEnd).trim()
  if (snippetStart > 0) snippet = '...' + snippet
  if (snippetEnd < rawText.length) snippet = snippet + '...'
  return snippet
}

export default function SearchResultsScreen() {
  const router = useRouter()
  const handleTopBarBack = () => {
    if (router.canGoBack()) router.back()
    else router.replace('/(tabs)/search')
  }
  const params = useLocalSearchParams<{ q?: string }>()
  const query = (params.q ?? '').trim()
  const lowerQuery = query.toLowerCase()
  const { data, isPending, isError } = useArticles()

  const allSearchableArticles: InternalSearchableArticle[] = useMemo(() => {
    if (!data) return []
    return Object.entries(data.articles).map(([slug, article]) => {
      const { rawText, lowerText } = buildArticleText(article)
      return {
        slug,
        title: article.title,
        categorySlug: article.category_slug,
        categoryLabel: article.category_label,
        rawText,
        lowerText,
      }
    })
  }, [data])

  const filteredResults: SearchResult[] = useMemo(() => {
    if (!lowerQuery) return []

    const tokens = lowerQuery.split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return []

    const allMatches: SearchResult[] = []
    const anyMatches: SearchResult[] = []

    for (const article of allSearchableArticles) {
      const haystack = `${article.title.toLowerCase()} ${article.lowerText}`

      const tokenMatches = tokens.map((token) => haystack.includes(token))
      const matchesAny = tokenMatches.some(Boolean)
      if (!matchesAny) continue

      const matchesAll = tokenMatches.every(Boolean)
      const excerpt = getExcerpt(article.rawText, article.lowerText, tokens)

      const result: SearchResult = {
        id: article.slug,
        slug: article.slug,
        title: article.title,
        categorySlug: article.categorySlug,
        categoryLabel: article.categoryLabel,
        excerpt,
      }

      if (matchesAll) {
        allMatches.push(result)
      } else {
        anyMatches.push(result)
      }
    }

    return [...allMatches, ...anyMatches]
  }, [allSearchableArticles, lowerQuery])

  const renderItem = ({ item }: { item: SearchResult }) => (
    <Pressable
      className="mb-3 rounded-xl border border-gray-300 p-3"
      onPress={() =>
        router.push({
          pathname: '/(tabs)/(home)/articles/[categoryId]/[articleSlug]',
          params: {
            categoryId: item.categorySlug,
            articleSlug: item.slug,
            fromSearch: '1',
            searchQ: query,
          },
        })
      }
    >
      <Text className="font-semibold text-base mb-1 text-black">{item.title}</Text>
      <Text className="text-xs text-gray-500 mb-1">{item.categoryLabel}</Text>
      <Text className="text-xs text-gray-600" numberOfLines={3}>
        {item.excerpt}
      </Text>
    </Pressable>
  )

  const hasQuery = query.length > 0
  const hasResults = filteredResults.length > 0

  if (isPending && !data) {
    return (
        <View style={styles.container}>
          <SafeAreaView edges={['top']} style={styles.topSafeArea} />
          <TopBar onBackPress={handleTopBarBack} />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FFDD00" />
          </View>
        </View>
    )
  }

  if (isError && !data) {
    return (
        <View style={styles.container}>
          <SafeAreaView edges={['top']} style={styles.topSafeArea} />
          <TopBar onBackPress={handleTopBarBack} />
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-lg text-gray-500 text-center">Unable to load content</Text>
          </View>
        </View>
    )
  }

  return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.topSafeArea} />
        <TopBar onBackPress={handleTopBarBack} />
        <View style={styles.content} className="px-4 pt-4 pb-4 flex-1">
          <Text className="text-2xl font-semibold mb-4 text-center text-black">
            Search Results
          </Text>

          <View className="flex-1 px-4 pt-4 bg-white rounded-t-3xl">
            {!hasQuery ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 text-center mb-2">
                  Nothing was typed, please go back and type something to search.
                </Text>
                <Text
                  className="text-blue-600"
                  onPress={() =>
                    router.replace('/(tabs)/search')
                  }
                >
                  Try another search
                </Text>
              </View>
            ) : hasResults ? (
              <FlatList
                data={filteredResults}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 text-center mb-2">
                  No articles matched your search.
                </Text>
                <Text
                  className="text-blue-600"
                  onPress={() =>
                    router.replace('/(tabs)/search')
                  }
                >
                  Try another search
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSafeArea: {
    backgroundColor: '#FFDD00',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
})