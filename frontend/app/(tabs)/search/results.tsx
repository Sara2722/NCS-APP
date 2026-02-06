import { StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useMemo } from "react";
import TopBar from '@/components/TopBar'
import { useRouter, useLocalSearchParams } from "expo-router";

type Item = {
    id: string;
    title: string;
    description: string;
};

{/* MOCK DATA */}

const MOCK_ITEMS: Item[] = [
    {
        id: "1",
        title: "Example 1",
        description: "This is the first example."
    },
    {
        id: "2",
        title: "Example 2",
        description: "This is the second example."
    },
    {
        id: "3",
        title: "Example 3",
        description: "This is the third example."
    },
]

{/*}
export default function search() {
  const router = useRouter();
  const params = useLocalSearchParams

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/search/results",
      params: { q: trimmed },
    });
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.topSafeArea}/>
      <TopBar />
      <View 
      style={styles.content} 
      className="px-4 pt-4 pb-4 flex-1">
        <Text className="text-2xl font-semibold mb-4 text-center text-black">Search Results</Text>
      </View>
    </View>
  );
}

*/}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
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