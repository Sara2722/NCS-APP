import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, articlesPersistOptions } from "@/lib/queryClient";
import { setupReactQueryNetworkIntegration } from "@/lib/reactQueryNetwork";
import "./globals.css";

setupReactQueryNetworkIntegration();

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={articlesPersistOptions}
    >
      <SafeAreaProvider>
        <StatusBar hidden={true}/>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
