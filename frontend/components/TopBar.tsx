import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import phoneIcon from '@/assets/icons/phone.png'
import logoIcon from '@/assets/icons/logo.png'

const PHONE_ICON_SIZE = 32
const LOGO_WIDTH = 140
const LOGO_HEIGHT = 42
const SIDE_SLOT_SIZE = 44

type TopBarProps = {
  /**
   * Set false on tab roots so the back control stays hidden if navigation state is wrong.
   */
  showBack?: boolean
  /**
   * When set, the back affordance is shown whenever `showBack !== false`, and this runs on press
   * (e.g. search results when there is no stack history).
   */
  onBackPress?: () => void
}

export default function TopBar({ showBack, onBackPress }: TopBarProps) {
  const router = useRouter()
  const canGoBack = router.canGoBack()
  const displayBack =
    showBack !== false && (onBackPress != null || canGoBack)

  const handleBack = () => {
    if (onBackPress) {
      onBackPress()
    } else if (canGoBack) {
      router.back()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.sideSlot}>
        {displayBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={handleBack}
            style={styles.sideSlotInner}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={28} color="#000000" />
          </Pressable>
        ) : null}
      </View>

      <Image source={logoIcon} style={styles.logo} contentFit="contain" />

      <View style={styles.sideSlot}>
        <Pressable
          accessibilityLabel="Open contact page"
          onPress={() => router.push('/(tabs)/(home)/contact')}
          style={styles.sideSlotInner}
        >
          <Image source={phoneIcon} style={styles.phoneIcon} contentFit="contain" />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFDD00',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sideSlot: {
    alignItems: 'center',
    height: SIDE_SLOT_SIZE,
    justifyContent: 'center',
    width: SIDE_SLOT_SIZE,
  },
  sideSlotInner: {
    alignItems: 'center',
    height: SIDE_SLOT_SIZE,
    justifyContent: 'center',
    width: SIDE_SLOT_SIZE,
  },
  phoneIcon: {
    height: PHONE_ICON_SIZE,
    width: PHONE_ICON_SIZE,
  },
  logo: {
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
  },
})
