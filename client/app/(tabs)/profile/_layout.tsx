import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileLayout = () => {
    return (
        <SafeAreaView edges={['top']}>
            <Slot />
        </SafeAreaView>
    )
}

export default ProfileLayout;