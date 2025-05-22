import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router/stack';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_500Medium_Italic, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import StoreProvider from '@/src/providers/StoreProvider';
import ToastManager from 'toastify-react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BackIcon } from '@/src/components/Vectors';
import NuText from '@/src/components/NuText';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_500Medium, Nunito_500Medium_Italic, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  return (
    <StoreProvider>
      <ToastManager duration={2000} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile/profile-settings"
            options={{
              headerTransparent: true,
              header: ({ navigation }) => (
                <LinearGradient colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  <SafeAreaView className='flex-row ps-6 pe-8 justify-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                      <BackIcon width={24} height={24} />
                      <NuText variant='bold' className='text-2xl text-white'>Profile Settings</NuText>
                    </TouchableOpacity>
                  </SafeAreaView>
                </LinearGradient>
              )
            }}
          />
          <Stack.Screen name="event/edit-event/[id]"
            options={{
              headerTransparent: true,
              header: ({ navigation }) => (
                <LinearGradient colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  <SafeAreaView className='flex-row ps-6 pe-8 justify-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                      <BackIcon width={24} height={24} />
                      <NuText variant='bold' className='text-2xl text-white'>Edit Event</NuText>
                    </TouchableOpacity>
                  </SafeAreaView>
                </LinearGradient>
              )
            }}
          />
          <Stack.Screen name="profile/friends"
            options={{
              headerTransparent: true,
              header: ({ navigation }) => (
                <LinearGradient colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  <SafeAreaView className='flex-row ps-6 pe-8 justify-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                      <BackIcon width={24} height={24} />
                      <NuText variant='bold' className='text-2xl text-white'>Back to Profile</NuText>
                    </TouchableOpacity>
                  </SafeAreaView>
                </LinearGradient>
              )
            }}
          />
          <Stack.Screen name="profile/[id]"
            options={{
              headerTransparent: true,
              header: ({ navigation }) => (
                <LinearGradient colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  <SafeAreaView className='flex-row ps-6 pe-8 justify-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                      <BackIcon width={24} height={24} />
                      <NuText variant='bold' className='text-2xl text-white'>Back</NuText>
                    </TouchableOpacity>
                  </SafeAreaView>
                </LinearGradient>
              )
            }}
          />
          <Stack.Screen name="attenders/[id]"
            options={{
              headerTransparent: true,
              header: ({ navigation }) => (
                <LinearGradient colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  <SafeAreaView className='flex-row ps-6 pe-8 justify-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                      <BackIcon width={24} height={24} />
                      <NuText variant='bold' className='text-2xl text-white'>Back to Event</NuText>
                    </TouchableOpacity>
                  </SafeAreaView>
                </LinearGradient>
              )
            }}
          />
          <Stack.Screen name="message-center" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
        </Stack>
      </GestureHandlerRootView>
    </StoreProvider>
  );
}