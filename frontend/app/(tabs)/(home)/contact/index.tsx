import React from "react";
import { View, 
  Text, 
  Pressable,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
 } from 'react-native';
 import { SafeAreaView } from "react-native-safe-area-context";
 import { Stack } from "expo-router";
import TopBar from '@/components/TopBar'

//MOCK DATA: replace with data from webflow
const openURL = async (url: string, fallback: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unavailable", fallback);
    }
  } catch {
    Alert.alert("Error", "Sorry, something went wrong.");
  }
};


export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.topSafeArea} edges={["top"]} />

      {/*TopBar*/}
      <TopBar />

      {/* Page Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-4 pb-8">
          <Text className="text-xl font-bold text-center mb-4">
            Contact Us
          </Text>

          {/* Section 1 -> Support helpline */}
          <View className="mb-4">
            <Text className="font-semibold mb-4">Support helpline:</Text>

            <Text className="text-sm mb-2">
              For non-judgmental information and support, please contact our helpline on:
            </Text>

            {/* Email link */}
            <Pressable
              onPress={() =>
                openURL(
                  "mailto: support@nextchapterscotland.org.uk "
                )
              }
            >
              <Text className="text-sm text-blue-600 underline">
                support@nextchapterscotland.org.uk 
              </Text>
            </Pressable>
            <Text className="text-sm my-1">or</Text>

            {/* Phone Link */}
            <Pressable
              onPress={() =>
                openURL(
                  "tel: +443303557145"
                )
              }
            >
              <Text className="text-sm text-blue-600 underline">
                Call: 03303557145
              </Text>
            </Pressable>

            {/* Whatsapp Link */}
            <Pressable
              onPress={() =>
                openURL(
                  "https://wa.me/447591339618",
                  "Unable to open WhatsApp on this device"
                )
              }
            >
              <Text className="text-sm text-blue-600 underline">
                Whatsapp: 07591 339618
              </Text>
            </Pressable>

            {/* SMSLink */}
            <Pressable
              onPress={() =>
                openURL(
                  "sms:+447591339618"
                )
              }
            >
              <Text className="text-sm text-blue-600 underline">
                Text: 07591 339618
              </Text>
            </Pressable>

            {/* Signal Link */}
            <Pressable
              onPress={() =>
                openURL(
                  "sgnl://send?phone=+447591339618"
                )
              }
            >
              <Text className="text-sm text-blue-600 underline">
                Signal: 07591 339618
              </Text>
            </Pressable>
          </View>


        </View>


        {/* Section 2 -> Opening Hours */}
        <View className="px-4 pt-4 pb-8">
          <Text className="font-semibold mb-1">Opening Hours:</Text>

          <Text className="text-sm mb-1">
            Our helpline is currently operating part-time. This means we may
            not be able to answer when you call.
          </Text>
          <Text className="text-sm mb-1">
            Please leave an answer machine message with your contact details
            and we will get back to you as soon as we can.
          </Text>
          <Text className="text-sm">
            We aim to respond to all queries within 48 hours (Monday - Friday).
          </Text>
        </View> 

        {/* Section 3 atc. can be added */}
      </ScrollView>
    </View>   
  );
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
  scrollContent: {
    paddingBottom: 20,
  },
});
