import { useState, useCallback } from 'react'
import { StyleSheet, Text, View, Pressable, ScrollView, Linking, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, ImageLoadEventData } from 'expo-image'
import { router, Href } from 'expo-router'
import TopBar from '@/components/TopBar'
import { useArticles } from '@/hooks/useArticles'
import type { Category } from '@/types/articles'

const FORUM_ANDROID_RIPPLE = { color: 'rgba(0,0,0,0.12)' as const }

type CategoryCardProps = {
  category: Category
  onPress?: () => void
  onAspectRatioDetected?: (id: number, aspectRatio: number) => void
  isWide?: boolean
  aspectRatio?: number
}

function CategoryCard({ category, onPress, onAspectRatioDetected, isWide, aspectRatio }: CategoryCardProps) {
  const [hasError, setHasError] = useState(false)

  const showFallback = !category.image_url || hasError

  const handleLoad = useCallback((event: ImageLoadEventData) => {
    const { width, height } = event.source
    if (width && height && onAspectRatioDetected) {
      onAspectRatioDetected(category.id, width / height)
    }
  }, [category.id, onAspectRatioDetected])

  if (isWide) {
    return (
      <Pressable 
        onPress={onPress} 
        className="w-full mb-4 overflow-hidden rounded-2xl"
        style={{ aspectRatio: aspectRatio }}
      >
        {showFallback ? (
          <View className="w-full h-full bg-[#FFDD00] items-center justify-center p-3">
            <Text className="text-black text-lg font-bold text-center">{category.label}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: category.image_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            accessibilityLabel={category.label}
            transition={200}
            cachePolicy="memory-disk"
            onError={() => setHasError(true)}
          />
        )}
      </Pressable>
    )
  }

  return (
    <Pressable onPress={onPress} className="w-[48%] aspect-square mb-4 overflow-hidden rounded-2xl">
      {showFallback ? (
        <View className="w-full h-full bg-[#FFDD00] items-center justify-center p-3">
          <Text className="text-black text-lg font-bold text-center">{category.label}</Text>
        </View>
      ) : (
        <Image
          source={{ uri: category.image_url }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          accessibilityLabel={category.label}
          transition={200}
          cachePolicy="memory-disk"
          onLoad={handleLoad}
          onError={() => setHasError(true)}
        />
      )}
    </Pressable>
  )
}

type CategoryGridProps = {
  categories: Category[]
}

function CategoryGrid({ categories }: CategoryGridProps) {
  const [aspectRatios, setAspectRatios] = useState<Record<number, number>>({})

  const handleCategoryPress = (category: Category) => {
    router.push(`/(home)/articles/${category.slug}` as Href)
  }

  const handleAspectRatioDetected = useCallback((id: number, ratio: number) => {
    setAspectRatios(prev => ({ ...prev, [id]: ratio }))
  }, [])

  const elements: React.ReactNode[] = []
  let i = 0

  while (i < categories.length) {
    const category = categories[i]
    const ratio = aspectRatios[category.id]
    const isWide = ratio !== undefined && ratio > 1.2

    if (isWide) {
      elements.push(
        <CategoryCard
          key={category.id}
          category={category}
          onPress={() => handleCategoryPress(category)}
          isWide
          aspectRatio={ratio}
        />
      )
      i++
    } else {
      const nextCategory = categories[i + 1]
      const nextRatio = nextCategory ? aspectRatios[nextCategory.id] : undefined
      const nextIsWide = nextRatio !== undefined && nextRatio > 1.2

      elements.push(
        <View key={`row-${category.id}`} className="flex-row justify-between w-full">
          <CategoryCard
            category={category}
            onPress={() => handleCategoryPress(category)}
            onAspectRatioDetected={handleAspectRatioDetected}
          />
          {nextCategory && !nextIsWide ? (
            <CategoryCard
              category={nextCategory}
              onPress={() => handleCategoryPress(nextCategory)}
              onAspectRatioDetected={handleAspectRatioDetected}
            />
          ) : (
            <View className="w-[48%]" />
          )}
        </View>
      )
      i += nextCategory && !nextIsWide ? 2 : 1
    }
  }

  return <View className="px-4">{elements}</View>
}

function ForumCtaButton() {
  const [opening, setOpening] = useState(false)

  const handlePress = useCallback(async () => {
    setOpening(true)
    try {
      await Linking.openURL('https://forum.nextchapterscotland.org.uk/')
    } finally {
      setOpening(false)
    }
  }, [])

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: opening }}
      disabled={opening}
      className="h-16 w-[80%] bg-[#FFDD00] my-7 rounded-lg flex-row items-center justify-center gap-3"
      style={({ pressed }) => ({
        opacity: opening ? 0.9 : pressed ? 0.82 : 1,
      })}
      android_ripple={FORUM_ANDROID_RIPPLE}
      onPress={handlePress}
    >
      {opening ? <ActivityIndicator size="small" color="#000000" /> : null}
      <Text className="text-2xl font-medium">
        {opening ? 'Opening…' : 'Go to our Forum'}
      </Text>
    </Pressable>
  )
}

export default function HomeScreen() {
  const { data, isPending, isError } = useArticles()

  if (isPending && !data) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar showBack={false} />
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
        <TopBar showBack={false} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-500 text-center">Unable to load content</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']} />
      <TopBar showBack={false} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <Text className="font-bold text-2xl mt-3 mx-auto">Information Hub</Text>
          <ForumCtaButton />
        </View>
        <CategoryGrid categories={data.categories} />
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
