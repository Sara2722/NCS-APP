import { Text, View, Pressable, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import TopBar from '@/components/TopBar'

type Article = {
  id: string
  name: string
  slug: string
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

// Mock data - will be replaced with Webflow API data
const MOCK_CATEGORY_DATA: Record<string, { name: string; description: string; articles: Article[] }> = {
  '1': {
    name: 'Work',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi...',
    articles: [
      { id: '1', name: 'Finding Employment', slug: 'finding-employment' },
      { id: '2', name: 'Work Permits', slug: 'work-permits' },
      { id: '3', name: 'Employee Rights', slug: 'employee-rights' },
      { id: '4', name: 'Job Applications', slug: 'job-applications' },
      { id: '5', name: 'Interview Tips', slug: 'interview-tips' },
      { id: '6', name: 'Workplace Culture', slug: 'workplace-culture' },
      { id: '7', name: 'Career Development', slug: 'career-development' },
      { id: '8', name: 'Self Employment', slug: 'self-employment' },
      { id: '9', name: 'Finding Employment', slug: 'finding-employment' },
      { id: '10', name: 'Work Permits', slug: 'work-permits' },
      { id: '11', name: 'Employee Rights', slug: 'employee-rights' },
      { id: '12', name: 'Job Applications', slug: 'job-applications' },
      { id: '13', name: 'Interview Tips', slug: 'interview-tips' },
      { id: '14', name: 'Workplace Culture', slug: 'workplace-culture' },
      { id: '15', name: 'Career Development', slug: 'career-development' },
      { id: '16', name: 'Self Employment', slug: 'self-employment' },
    ],
  },
  '2': {
    name: 'Health',
    description: 'Access healthcare services, understand your rights, and find support for physical and mental wellbeing. Information about NHS registration, GP services, and emergency care.',
    articles: [
      { id: '1', name: 'NHS Registration', slug: 'nhs-registration' },
      { id: '2', name: 'Finding a GP', slug: 'finding-a-gp' },
      { id: '3', name: 'Emergency Services', slug: 'emergency-services' },
      { id: '4', name: 'Mental Health Support', slug: 'mental-health-support' },
      { id: '5', name: 'Dental Care', slug: 'dental-care' },
      { id: '6', name: 'Prescriptions', slug: 'prescriptions' },
    ],
  },
  '3': {
    name: 'Housing',
    description: 'Find safe and affordable accommodation. Learn about your housing rights, how to apply for housing support, and what to do if you face homelessness.',
    articles: [
      { id: '1', name: 'Finding Accommodation', slug: 'finding-accommodation' },
      { id: '2', name: 'Tenant Rights', slug: 'tenant-rights' },
      { id: '3', name: 'Housing Benefits', slug: 'housing-benefits' },
      { id: '4', name: 'Council Housing', slug: 'council-housing' },
      { id: '5', name: 'Homelessness Support', slug: 'homelessness-support' },
    ],
  },
  '4': {
    name: 'Family & Society',
    description: 'Support for families including childcare, education, and community integration. Learn about family reunification, schools, and social services.',
    articles: [
      { id: '1', name: 'Family Reunification', slug: 'family-reunification' },
      { id: '2', name: 'Childcare Options', slug: 'childcare-options' },
      { id: '3', name: 'School Enrollment', slug: 'school-enrollment' },
      { id: '4', name: 'Community Groups', slug: 'community-groups' },
      { id: '5', name: 'Social Services', slug: 'social-services' },
      { id: '6', name: 'Language Classes', slug: 'language-classes' },
    ],
  },
}

// Default fallback data
const DEFAULT_CATEGORY = {
  name: 'Category',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi...',
  articles: [
    { id: '1', name: 'Article 1', slug: 'article-1' },
    { id: '2', name: 'Article 2', slug: 'article-2' },
    { id: '3', name: 'Article 3', slug: 'article-3' },
  ],
}

export default function ArticlesScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>()

  // Get category data from mock or use default
  const categoryData = MOCK_CATEGORY_DATA[categoryId ?? ''] ?? DEFAULT_CATEGORY

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
          <Text className="font-normal text-sm text-black text-center mt-4 leading-5">
            {categoryData.description}
          </Text>
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
