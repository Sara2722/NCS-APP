import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { router, Href } from 'expo-router'
import TopBar from '@/components/TopBar'
import articlesData from '@/data/articles.json'

type Category = {
  id: number
  slug: string
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
      {category.image_url ? (
        <Image
          source={{ uri: category.image_url }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          accessibilityLabel={category.label}
        />
      ) : (
        <View className="w-full h-full bg-[#FFDD00] items-center justify-center p-3">
          <Text className="text-black text-lg font-bold text-center">{category.label}</Text>
        </View>
      )}
    </Pressable>
  )
}

type CategoryGridProps = {
  categories: Category[]
}

function CategoryGrid({ categories }: CategoryGridProps) {
  const handleCategoryPress = (category: Category) => {
    router.push(`/(home)/articles/${category.slug}` as Href)
  }

  return (
    <View className="flex-row flex-wrap justify-between px-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onPress={() => handleCategoryPress(category)}
        />
      ))}
    </View>
  )
}

const categories = articlesData.categories as Category[]

export default function HomeScreen() {
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
        <CategoryGrid categories={categories} />
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
