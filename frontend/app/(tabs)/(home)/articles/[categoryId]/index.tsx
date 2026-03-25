import { Text, View, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import TopBar from '@/components/TopBar'
import { useArticles } from '@/hooks/useArticles'
import type { CategoryArticle, CategoryData } from '@/types/articles'

type ArticleButtonProps = {
  article: CategoryArticle
  onPress?: () => void
}

function ArticleButton({ article, onPress }: ArticleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#FFDD00] min-h-[39px] rounded-[9px] w-full mb-[15px] items-center justify-center px-3 py-2"
    >
      <Text className="text-black text-base font-medium text-center">
        {article.name}
      </Text>
    </Pressable>
  )
}

type ArticlesListProps = {
  articles: CategoryArticle[]
  categoryId: string
}

function ArticlesList({ articles, categoryId }: ArticlesListProps) {
  const router = useRouter()

  const handleArticlePress = (article: CategoryArticle) => {
    router.push(`/(tabs)/(home)/articles/${categoryId}/${article.slug}`)
  }

  return (
    <View className="px-[30px]">
      {articles.map((article) => (
        <ArticleButton
          key={article.id}
          article={article}
          onPress={() => handleArticlePress(article)}
        />
      ))}
    </View>
  )
}

const DEFAULT_CATEGORY: CategoryData = {
  name: 'Category',
  description: '',
  articles: [],
}

export default function ArticlesScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>()
  const { data, isPending, isError } = useArticles()

  if (isPending && !data) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFDD00" />
        </View>
      </View>
    )
  }

  if (isError && !data) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-500 text-center">Unable to load content</Text>
        </View>
      </View>
    )
  }

  const categoryData = data.category_articles[categoryId ?? ''] ?? DEFAULT_CATEGORY

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']} />
      <TopBar />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center px-4 mt-3">
          <Text className="font-bold text-2xl text-black text-center">
            {categoryData.name}
          </Text>
          {categoryData.description ? (
            <Text className="font-normal text-sm text-black text-center mt-4 leading-5">
              {categoryData.description}
            </Text>
          ) : null}
        </View>
        <View className="mt-6">
          <ArticlesList articles={categoryData.articles} categoryId={categoryId ?? ''} />
        </View>
      </ScrollView>
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
