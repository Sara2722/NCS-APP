import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import TopBar from '@/components/TopBar'

type Category = {
  id: number
  label: string
  image_url: string
}

type CategoryCardProps = {
  category: Category
  onPress?: () => void
}

function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable onPress={onPress} className="w-[48%] aspect-square mb-4 overflow-hidden rounded-2xl">
      <Image
        source={{ uri: category.image_url }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        accessibilityLabel={category.label}
      />
    </Pressable>
  )
}

type CategoryGridProps = {
  categories: Category[]
}

function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between px-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </View>
  )
}

// Mock data - we will need to get this programatically from webflow cdn
const MOCK_CATEGORIES: Category[] = [
  { id: 1, label: 'Work', image_url: 'https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e08c44f677337b5cd9b7_Work(1).png' },
  { id: 2, label: 'Health', image_url: 'https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e1cfc45c4d79d1815feb_Work(2).png' },
  { id: 3, label: 'Housing', image_url: 'https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e26cf789f0bd643ad01b_Work(3).png' },
  { id: 4, label: 'Family & Society', image_url: 'https://cdn.prod.website-files.com/65477d920c8996a7579a72bf/68e8e26c5974d3bfb1b07f65_Work(4).png' },
  { id: 5, label: 'Work', image_url: 'https://picsum.photos/seed/work2/300/300' },
  { id: 6, label: 'Health', image_url: 'https://picsum.photos/seed/health2/300/300' },
  { id: 7, label: 'Housing', image_url: 'https://picsum.photos/seed/housing2/300/300' },
  { id: 8, label: 'Family & Society', image_url: 'https://picsum.photos/seed/family2/300/300' },
  { id: 9, label: 'Housing', image_url: 'https://picsum.photos/seed/housing3/300/300' },
  { id: 10, label: 'Family & Society', image_url: 'https://picsum.photos/seed/family3/300/300' },
]

export default function index() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']} />
      <TopBar />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <Text className="font-bold text-2xl mt-3 mx-auto">Information Hub</Text>
          <View className="h-16 w-[80%] bg-[#FFDD00] my-7 rounded-lg flex items-center justify-center">
            <Text className="text-2xl font-medium">Go to our Forum</Text>
          </View>
        </View>
        <CategoryGrid categories={MOCK_CATEGORIES} />
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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