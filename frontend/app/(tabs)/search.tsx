import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function search() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text>search</Text>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})