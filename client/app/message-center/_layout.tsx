import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const MessageCenterLayout = () => {
    return (
        <SafeAreaView edges={['top']} className='flex-1 pt-12'>
            <Slot />
        </SafeAreaView>
    )
}

export default MessageCenterLayout;