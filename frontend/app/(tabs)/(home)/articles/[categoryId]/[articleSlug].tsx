import { Text, View, ScrollView, StyleSheet, Linking, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import TopBar from '@/components/TopBar'
import articlesData from '@/data/articles.json'

// types

type HeadingBlock = {
  type: 'heading'
  text: string
  level: number
}

type ParagraphBlock = {
  type: 'paragraph'
  text: string
  bold: boolean
}

type Segment = {
  text: string
  bold: boolean
  link: string | null
}

type RichParagraphBlock = {
  type: 'rich_paragraph'
  segments: Segment[]
}

type ListBlock = {
  type: 'list'
  items: string[]
  ordered: boolean
}

type ContentBlock = HeadingBlock | ParagraphBlock | RichParagraphBlock | ListBlock

type SignpostingOrg = {
  name: string
  description: string
  url: string
  image_url: string
}

type ArticleData = {
  id: string
  title: string
  category_slug: string
  category_label: string
  last_updated: string
  content: ContentBlock[]
  signposting: SignpostingOrg[]
  source_url: string
}

// content Block Renderers

function HeadingRenderer({ block }: { block: HeadingBlock }) {
  const className =
    block.level === 2
      ? 'font-bold text-xl text-black mt-6 mb-2'
      : block.level === 3
        ? 'font-bold text-lg text-black mt-5 mb-2'
        : 'font-semibold text-base text-black mt-4 mb-1'

  return <Text className={className}>{block.text}</Text>
}

function ParagraphRenderer({ block }: { block: ParagraphBlock }) {
  return (
    <Text
      className={`text-sm text-black leading-5 mb-3 ${block.bold ? 'font-bold' : 'font-normal'}`}
    >
      {block.text}
    </Text>
  )
}

function RichParagraphRenderer({ block }: { block: RichParagraphBlock }) {
  const handleLinkPress = (url: string) => {
    if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      Linking.openURL(url)
    }
  }

  return (
    <Text className="text-sm text-black leading-5 mb-3 font-normal">
      {block.segments.map((segment, i) => {
        if (segment.link) {
          return (
            <Text
              key={i}
              className={`text-blue-600 underline ${segment.bold ? 'font-bold' : 'font-normal'}`}
              onPress={() => handleLinkPress(segment.link!)}
            >
              {segment.text}
            </Text>
          )
        }
        return (
          <Text key={i} className={segment.bold ? 'font-bold' : 'font-normal'}>
            {segment.text}
          </Text>
        )
      })}
    </Text>
  )
}

function ListRenderer({ block }: { block: ListBlock }) {
  return (
    <View className="mb-3 pl-2">
      {block.items.map((item, i) => (
        <View key={i} className="flex-row mb-1.5">
          <Text className="text-sm text-black mr-2 leading-5">
            {block.ordered ? `${i + 1}.` : '•'}
          </Text>
          <Text className="text-sm text-black leading-5 flex-1 font-normal">{item}</Text>
        </View>
      ))}
    </View>
  )
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <HeadingRenderer block={block} />
    case 'paragraph':
      return <ParagraphRenderer block={block} />
    case 'rich_paragraph':
      return <RichParagraphRenderer block={block} />
    case 'list':
      return <ListRenderer block={block} />
    default:
      return null
  }
}

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
          style={{ width: 48, height: 48 }}
          contentFit="contain"
          className="rounded-lg mr-3"
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

// main Screen

const allArticles = articlesData.articles as Record<string, ArticleData>

export default function ArticleScreen() {
  const { articleSlug } = useLocalSearchParams<{ articleSlug: string }>()

  const articleData = allArticles[articleSlug ?? '']

  if (!articleData) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-500">Article not found</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']} />
      <TopBar />
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
