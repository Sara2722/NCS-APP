import { Text, View, Image } from 'react-native'
import React from 'react'
import phoneIcon from '@/assets/icons/phone.png';
import logoIcon from '@/assets/icons/logo.png';
import logoutIcon from '@/assets/icons/logout.png';




export default function TopBar() {
  return (
    <View className='bg-[#FFDD00] h-[64px] flex flex-row items-center px-6 justify-between'>
        <Image source={phoneIcon} className='h-8 w-8' resizeMode="contain" />
        <Image source={logoIcon} className='h-[42px] w-auto' resizeMode="contain" />
        <Image source={logoutIcon} className='h-8 w-8' resizeMode="contain" />
    </View>
  )
}
