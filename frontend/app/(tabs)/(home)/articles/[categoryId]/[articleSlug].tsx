import { Text, View, ScrollView, StyleSheet, Linking, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import TopBar from '@/components/TopBar'
import { ContentBlockRenderer } from '@/components/ContentBlockRenderer'
import { useArticles } from '@/hooks/useArticles'
import type { SignpostingOrg } from '@/types/articles'

// signposting

function SignpostingCard({ org }: { org: SignpostingOrg }) {
  const handlePress = () => {
    if (org.url) {
      Linking.openURL(org.url)
    }
  }

  return (
    <Pressable onPress={handlePress} className="flex-row bg-gray-50 rounded-xl p-3 mb-3">
      {org.image_url ? (
        <Image
          source={{ uri: org.image_url }}
          style={{ width: 48, height: 48, marginRight: 12 }}
          contentFit="contain"
          className="rounded-lg"
          transition={200}
          cachePolicy="memory-disk"
        />
      ) : null}
      <View className="flex-1">
        <Text className="font-bold text-sm text-black">{org.name}</Text>
        {org.description ? (
          <Text className="text-xs text-gray-600 mt-1 leading-4" numberOfLines={3}>
            {org.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  )
}

function SignpostingSection({ orgs }: { orgs: SignpostingOrg[] }) {
  if (orgs.length === 0) return null

  return (
    <View className="mt-6 pt-4 border-t border-gray-200">
      <Text className="font-bold text-lg text-black mb-3">Signposting</Text>
      <Text className="text-xs text-gray-500 mb-4">
        The following organisations offer support on this topic.
      </Text>
      {orgs.map((org, i) => (
        <SignpostingCard key={i} org={org} />
      ))}
    </View>
  )
}

export default function ArticleScreen() {
  const router = useRouter()
  const { articleSlug, fromSearch, searchQ } = useLocalSearchParams<{
    articleSlug: string
    fromSearch?: string
    searchQ?: string
  }>()
  const openedFromSearch = fromSearch === '1'
  const handleBackFromSearch = () => {

    router.dismissTo('/(tabs)/(home)')
    router.navigate({
      pathname: '/(tabs)/search/results',
      params: { q: searchQ ?? '' },
    })
  }
  const topBarBackProps = openedFromSearch
    ? { onBackPress: handleBackFromSearch }
    : {}
  const { data, isPending, isError } = useArticles()

  if (isPending && !data) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar {...topBarBackProps} />
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
        <TopBar {...topBarBackProps} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-500 text-center">Unable to load content</Text>
        </View>
      </View>
    )
  }

  const articleData = data.articles[articleSlug ?? '']

  if (!articleData) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar {...topBarBackProps} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-500">Article not found</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']} />
      <TopBar {...topBarBackProps} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-[25px] mt-3">
          <Text className="font-bold text-2xl text-black text-center">
            {articleData.title}
          </Text>
          {articleData.last_updated ? (
            <Text className="text-xs text-gray-400 text-center mt-2">
              Last updated: {articleData.last_updated}
            </Text>
          ) : null}
          <View className="mt-6">
            {articleData.content.map((block, index) => (
              <ContentBlockRenderer key={index} block={block} />
            ))}
          </View>
          <SignpostingSection orgs={articleData.signposting} />
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
    paddingBottom: 40,
  },
})
