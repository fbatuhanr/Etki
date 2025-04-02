import React from 'react'
import { View, Text } from 'react-native'
import NuLink from '@/app/components/NuLink';

const Profile = () => {
  return (
    <View className='size-full justify-center items-center gap-y-2'>
      <NuLink href='/(tabs)/profile/login' variant='bold' className='text-3xl'>LOGIN</NuLink>
      <NuLink href='/(tabs)/profile/signup' variant='bold' className='text-3xl'>SIGN UP</NuLink>
    </View>
  )
}

export default Profile;