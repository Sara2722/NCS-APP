import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBar from '@/components/TopBar'

export default function index() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']} />
      <TopBar />
      <View style={styles.content}>
        <Text>index</Text>
      </View>
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
})