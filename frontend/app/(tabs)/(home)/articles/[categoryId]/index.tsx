import { Text, View, Pressable, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import TopBar from '@/components/TopBar'
import articlesData from '@/data/articles.json'

type Article = {
  id: string
  name: string
  slug: string
}

type CategoryData = {
  name: string
  description: string
  articles: Article[]
}

type ArticleButtonProps = {
  article: Article
  onPress?: () => void
}

function ArticleButton({ article, onPress }: ArticleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#FFDD00] h-[39px] rounded-[9px] w-full mb-[15px] items-center justify-center"
    >
      <Text className="text-black text-base font-medium text-center">
        {article.name}
      </Text>
    </Pressable>
  )
}

type ArticlesListProps = {
  articles: Article[]
  categoryId: string
}

function ArticlesList({ articles, categoryId }: ArticlesListProps) {
  const router = useRouter()

  const handleArticlePress = (article: Article) => {
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

const categoryArticles = articlesData.category_articles as Record<string, CategoryData>

const DEFAULT_CATEGORY: CategoryData = {
  name: 'Category',
  description: '',
  articles: [],
}

export default function ArticlesScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>()

  const categoryData = categoryArticles[categoryId ?? ''] ?? DEFAULT_CATEGORY

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
