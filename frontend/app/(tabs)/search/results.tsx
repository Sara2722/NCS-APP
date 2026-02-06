import { StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from "react";
import TopBar from '@/components/TopBar'
import { useRouter } from "expo-router";




export default function search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

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
        <Text className="text-2xl font-semibold mb-4 text-center text-black">Search</Text>
      </View>
    </View>
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