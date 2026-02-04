import { Text, View, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import TopBar from '@/components/TopBar'

// Mock article data - will be replaced with API data
const MOCK_ARTICLES: Record<string, { name: string; content: string }> = {
  'finding-employment': {
    name: 'Finding Employment',
    content: `The following information applies from the 1st April 2025.

The information on this page reflects our understanding of the new rules and should not be taken as legal advice.

We will be updating this information in line with Disclosure Scotland's guidance once it is published.

Disclosure Scotland

Disclosure Scotland is the Scottish Government agency responsible for conducting criminal record checks as part of the Protecting Vulnerable Groups (PVG) Scheme and the Disclosure levels.

You may be asked to apply to become a PVG Scheme member when applying for a job or volunteering in a regulated role with Children and/or Protected Adults.

The information on this page is designed to help you understand the PVG Scheme. If you require a different level of disclosure, please see our Disclosure Levels page.

PVG Scheme

What is the PVG scheme?

The Protecting Vulnerable Groups (PVG) scheme is a government-run scheme in Scotland that helps to safeguard children and protected adults from harm. It does this by providing a criminal record check for people who want to work with these vulnerable groups.

The PVG Scheme is governed by two pieces of legislation. The Disclosure (Scotland) Act 2020 and the Protection of Vulnerable Groups (Scotland) Act 2007.

What is the purpose of the PVG scheme?

The PVG scheme is an important safeguarding measure for protecting children and protected adults from harm. By conducting criminal record and other checks, the PVG scheme helps to ensure that only those who are suitable to work with these vulnerable groups are able to do so.

Who manages the PVG scheme?

The PVG scheme is managed by Disclosure Scotland.

How do I apply for a PVG?

Information on how to apply to the PVG scheme can be accessed on the Disclosure Scotland website.

Who needs a PVG in Scotland?

Anyone who wants to do a regulated role with children and/or protected adults in Scotland will need to join the PVG scheme.

It is important to understand what counts as a regulated role because only then will you know whether you need to join the PVG scheme or not.

Disclosure Scotland have created an online tool that should help you to work out whether your role needs PVG scheme membership.`,
  },
  'work-permits': {
    name: 'Work Permits',
    content: `Understanding Work Permits in the UK

If you are not a UK citizen or do not have settled status, you may need a work permit or visa to work legally in the UK.

Types of Work Visas

There are several types of work visas available:

Skilled Worker Visa
This is the main visa for people coming to the UK for work. You need a job offer from an approved employer.

Health and Care Worker Visa
For qualified doctors, nurses, and other health professionals.

Graduate Visa
For international students who have completed a UK degree and want to work or look for work.

Your Rights at Work

Regardless of your immigration status, you have certain rights at work including:
- The right to be paid at least the National Minimum Wage
- Protection from discrimination
- Safe working conditions
- Rest breaks and holiday entitlement

Getting Help

If you need advice about work permits or your rights at work, you can contact:
- Citizens Advice
- ACAS (Advisory, Conciliation and Arbitration Service)
- Your local refugee support organization`,
  },
}

const DEFAULT_ARTICLE = {
  name: 'Article',
  content: 'Article content will be loaded from the API.',
}

export default function ArticleScreen() {
  const { articleSlug } = useLocalSearchParams<{ articleSlug: string }>()

  // Get article data from mock or use default
  const articleData = MOCK_ARTICLES[articleSlug ?? ''] ?? DEFAULT_ARTICLE

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
            {articleData.name}
          </Text>
          <View className="mt-6">
            <ArticleContent content={articleData.content} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

type ArticleContentProps = {
  content: string
}

function ArticleContent({ content }: ArticleContentProps) {
  // Split into paragraphs and render as regular text
  const paragraphs = content.split('\n\n')

  return (
    <View>
      {paragraphs.map((paragraph, index) => {
        const trimmed = paragraph.trim()
        if (!trimmed) return null

        return (
          <Text
            key={index}
            className="font-normal text-sm text-black leading-5 mb-4"
          >
            {trimmed}
          </Text>
        )
      })}
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
