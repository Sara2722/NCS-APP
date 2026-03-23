import { View, Image, Pressable, BackHandler, Platform, Alert } from 'react-native'
import React from 'react'
import phoneIcon from '@/assets/icons/phone.png';
import logoIcon from '@/assets/icons/logo.png';
import logoutIcon from '@/assets/icons/logout.png';
import { router } from "expo-router";

export default function TopBar() {
  const handleLogout = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      // iOS doesn't allow programmatic app exit, but we can show an alert
      Alert.alert(
        'Logout',
        'To exit the app, please use the home button or swipe up from the bottom.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View className='bg-[#FFDD00] h-[64px] flex flex-row items-center px-6 justify-between'>
      {/* Phone icon -> navigate to contact tab */} 
      <Pressable onPress={() => router.push('/(tabs)/(home)/contact')}>
        <Image source={phoneIcon} className='h-8 w-8' resizeMode="contain" />
      </Pressable>
      <Image source={logoIcon} className='h-[42px] w-auto' resizeMode="contain" />
      <Pressable onPress={handleLogout}>
        <Image source={logoutIcon} className='h-8 w-8' resizeMode="contain" />
      </Pressable>
    </View>
  )
}
