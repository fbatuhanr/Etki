import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NuText from '@/src/components/NuText';
import { BackIcon } from '@/src/components/Vectors';
import { UserGuard } from '@/src/guards';

const MessageCenterLayout = () => {
    const { fromDetailPage } = useLocalSearchParams<{ fromDetailPage?: string; }>();
    const isFromDetailPage = fromDetailPage === "1";
    return (
        <UserGuard>
            <StatusBar style="light" />
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerTransparent: true,
                        header: ({ navigation }) => (
                            <LinearGradient
                                colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)']}
                                style={{ height: 100 }}
                            >
                                <SafeAreaView className="flex-row ps-6 pe-8 justify-between pb-12">
                                    <TouchableOpacity
                                        onPress={() => navigation.goBack()}
                                        className="flex-row items-center gap-x-4"
                                    >
                                        <BackIcon width={24} height={24} />
                                        <NuText variant="bold" className="text-2xl text-white">Back to Profile</NuText>
                                    </TouchableOpacity>
                                </SafeAreaView>
                            </LinearGradient>
                        ),
                    }}
                />
                <Stack.Screen
                    name="[eventId]"
                    options={{
                        headerTransparent: true,
                        header: ({ navigation }) => (
                            <LinearGradient
                                colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)']}
                                style={{ height: 100 }}
                            >
                                <SafeAreaView className="flex-row ps-6 pe-8 justify-between">
                                    <TouchableOpacity
                                        onPress={() => navigation.goBack()}
                                        className="flex-row items-center gap-x-4"
                                    >
                                        <BackIcon width={24} height={24} />
                                        <NuText variant="bold" className="text-2xl text-white">Back to {isFromDetailPage ? 'Event' : 'Center'}</NuText>
                                    </TouchableOpacity>
                                </SafeAreaView>
                            </LinearGradient>
                        ),
                    }}
                />
            </Stack>
        </UserGuard>
    );
};

export default MessageCenterLayout;
