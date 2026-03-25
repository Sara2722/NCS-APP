import { Alert, Linking, Text, View } from 'react-native'
import type {
  ContentBlock,
  HeadingBlock,
  ListBlock,
  ParagraphBlock,
  RichParagraphBlock,
} from '@/types/articles'

async function openLink(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return

  try {
    // Prefer openURL over canOpenURL: on iOS, canOpenURL returns false for mailto/tel
    // unless those schemes are listed in LSApplicationQueriesSchemes — but openURL still works.
    await Linking.openURL(trimmed)
  } catch {
    Alert.alert(
      'Unable to open link',
      'Email and phone links need Mail or Phone. Simulators often cannot open them; try a device.'
    )
  }
}

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
  return (
    <Text className="text-sm text-black leading-5 mb-3 font-normal">
      {block.segments.map((segment, i) => {
        if (segment.link) {
          return (
            <Text
              key={i}
              className={`text-blue-600 underline ${segment.bold ? 'font-bold' : 'font-normal'}`}
              onPress={() => void openLink(segment.link!)}
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

export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
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
