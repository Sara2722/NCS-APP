import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useRouter } from 'expo-router'
import TopBar from '@/components/TopBar'
import { ContentBlockRenderer } from '@/components/ContentBlockRenderer'
import { useArticles } from '@/hooks/useArticles'

export default function ContactScreen() {
  const router = useRouter()
  const { data, isPending, isError } = useArticles()

  const handleContactBack = () => {
    if (router.canGoBack()) router.back()
    else router.replace('/(tabs)/(home)')
  }

  if (isPending && !data) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar onBackPress={handleContactBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFDD00" />
        </View>
      </View>
    )
  }

  if (isError && !data) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar onBackPress={handleContactBack} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-500 text-center">Unable to load content</Text>
        </View>
      </View>
    )
  }

  const contact = data.contact_us

  if (!contact) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.topSafeArea} edges={['top']} />
        <TopBar onBackPress={handleContactBack} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-500 text-center">Unable to load contact information</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.topSafeArea} edges={['top']} />

      <TopBar onBackPress={handleContactBack} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-4 pb-8">
          <Text className="text-xl font-bold text-center mb-4">Contact Us</Text>

          {contact.main_content.map((block, index) => (
            <ContentBlockRenderer key={index} block={block} />
          ))}
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
