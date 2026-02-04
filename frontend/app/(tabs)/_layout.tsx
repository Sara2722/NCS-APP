import { Image } from 'react-native'
import { Tabs } from 'expo-router'
import React from 'react'
import homeIcon from '../../assets/icons/home.png';
import searchIcon from '../../assets/icons/search.png';


const TabIcon = ({ focused, icon }: { focused: boolean, icon: any }) => {
    if (focused){
      return(
        <Image source={icon} tintColor="#ffffff" className='size-7'/>
      )
    } else{
      return(
        <Image source={icon} tintColor="#ffffff" className="opacity-50 size-7"/>
      )
    }
  }
  


const _layout = () => {
  return (
    <Tabs screenOptions={{
        tabBarItemStyle: {
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        tabBarStyle: {
            backgroundColor: '#000000',
            height: 64
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)'
    }}>
    <Tabs.Screen 
        name='(home)'
        options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={homeIcon}/>

            )
        }}
    />

    <Tabs.Screen 
        name='search'
        options={{
            title: 'Search',
            headerShown: false,
            tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={searchIcon}/>

            )
        }}
    />
    </Tabs>

  )
}

export default _layout
