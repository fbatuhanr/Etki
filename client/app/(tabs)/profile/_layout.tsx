import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileLayout = () => {
    return (
        <SafeAreaView>
            <Slot />
        </SafeAreaView>
    )
}

export default ProfileLayout;