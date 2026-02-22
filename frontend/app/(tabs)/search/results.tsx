import { StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useMemo } from "react";
import TopBar from '@/components/TopBar'
import { Stack, useRouter, useLocalSearchParams } from "expo-router";


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


export default function search() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const query = (params.q ?? "").toLowerCase();

  const filteredResults = useMemo(() => {
    if (!query) return [];
    return MOCK_ITEMS.filter(
        (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        
    );
  }, [query]);

  const renderItem = ({ item } : {item: Item }) => (
    <Pressable
        className="mb-3 rounded-xl border border-gray-300 p-3"
        onPress={() => {
            {/*later router.push('/articles/${item.id}') */}
        }}
    >
        <Text className="font-semibold text-base mb-1">{item.title}</Text>
        <Text className="text-xs text-gray-500" numberOfLines={2}>{item.description}</Text>
    </Pressable>
  );
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.topSafeArea}/>
        <TopBar />
        <View 
        style={styles.content} 
        className="px-4 pt-4 pb-4 flex-1">
          <Text className="text-2xl font-semibold mb-4 text-center text-black">Search Results</Text>


        <View className="flex-1 px-4 pt-4 bg-white rounded-t-3xl">

          {query === "" ? (
              <View className="flex-1 items-center justify-center">
                  <Text classname="text-gray-500">
                      Nothing was typed, please go back and type something to search.
                  </Text>
                  <Text 
                      className="text-blue-600"
                      onPress={() => router.back()}
                  >
                      Try another search
                  </Text>
              </View>
          ): (
              <FlatList
                  data={filteredResults}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  contentContainerStyle={{ paddingBottom: 16 }}
              />
          )}
          </View>
        </View>
      </View>
    </>
  );
}


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