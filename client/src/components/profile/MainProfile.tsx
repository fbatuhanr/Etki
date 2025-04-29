import React, { useCallback, useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import NuText from '@/src/components/NuText';
import { defaultUserCover } from '@/src/data/defaultValues';
import { ParticipantsIcon } from '@/src/components/Vectors';
import EventCardHistory from '@/src/components/EventCardHistory';
import { FlatList } from 'react-native-gesture-handler';
import { sampleEvents } from '@/src/data/sample';
import { router } from 'expo-router';
import { TouchableWithoutFeedback } from 'react-native';
import COLORS from '@/src/constants/colors';
import useAuthentication from '@/src/hooks/useAuthentication';
import { Toast } from 'toastify-react-native';
import { errorMessages, successMessages } from '@/src/constants/messages';
import { useUser } from '@/src/hooks/user/useUser';
import { useDecodedToken } from '@/src/hooks/useDecodedToken';

const MainProfile = () => {

  const decodedToken = useDecodedToken();
  const { getUserById, data, loading, error } = useUser();
  const { logoutCall } = useAuthentication();

  console.log('main profile data:', data);
  console.log('main profile loading:', loading);
  console.log('main profile error:', error);

  const [isLoading, setIsLoading] = useState(false);

  const [showMore, setShowMore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getUserById(decodedToken.userId as string);
    }, [decodedToken.userId])
  );

  const handleLogout = async () => {
    setIsLoading(true);
    Toast.info("Logging out...");

    try {
      await logoutCall();
      Toast.success(successMessages.default);
      router.replace('/');

    } catch (error) {
      Toast.error(errorMessages.default);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <TouchableWithoutFeedback onPress={() => { if (showMore) setShowMore(false); }}>
      <View>
        <View className='px-6 gap-y-6 pb-14'>
          <View className='flex-row justify-end gap-x-2 relative'>
            <TouchableOpacity onPress={() => setShowMore(!showMore)}>
              <Entypo name="dots-three-horizontal" size={24} color="black" />
            </TouchableOpacity>
            {
              showMore &&
              <View className='absolute top-1 right-0 z-10'>
                <TouchableOpacity
                  className='bg-red-600 rounded-xl px-4 py-2 flex-row items-center justify-center gap-x-2'
                  onPress={handleLogout}
                  disabled={isLoading}
                >
                  <NuText variant='bold' className='text-white text-xl'>Log out</NuText>
                  <AntDesign name="logout" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            }
          </View>
          <View className='flex-row justify-center items-center px-24 gap-x-6'>
            <View className='w-28 h-28 rounded-full overflow-hidden '>
              <ActivityIndicator size="large" color="#888" className="absolute inset-0" />
              {!loading && <Image source={data?.photo ? { uri: data.photo } : defaultUserCover} className='w-full h-full' />}
            </View>
            <View>
              <NuText variant='extraBold' className='text-4xl leading-tight'>{data?.name}</NuText>
              <NuText variant='extraBold' className='text-4xl leading-tight'>{data?.surname}</NuText>
            </View>
          </View>
          <View className='h-16 justify-center'>
            {
              data?.biography ?
                <NuText variant='bold' className='text-2xl'>
                  {data.biography}
                </NuText>
                :
                <TouchableOpacity onPress={() => router.push('/profile/ProfileSettings')}>
                  <NuText variant='mediumItalic' className='text-xl text-center text-blackish'>
                    Tap here to add biography text...
                  </NuText>
                </TouchableOpacity>
            }
          </View>
          <View className='gap-y-3'>
            <View className='flex-row gap-x-8'>
              <View className='flex-row items-center gap-x-2'>
                <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                  <ParticipantsIcon width={24} height={24} />
                </View>
                <NuText variant='bold' className='text-xl text-primary'>0</NuText>
                <NuText variant='medium' className='text-xl'>Followers</NuText>
              </View>
              <View className='flex-row items-center gap-x-2'>
                <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                  <ParticipantsIcon width={24} height={24} />
                </View>
                <NuText variant='bold' className='text-xl text-primary'>0</NuText>
                <NuText variant='medium' className='text-xl'>Following</NuText>
              </View>
            </View>
            <View className='flex-row items-center gap-x-2'>
              <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                <View className='h-8 w-8 bg-whitish rounded-full' />
              </View>
              <NuText variant='bold' className='text-xl text-primary'>0</NuText>
              <NuText variant='medium' className='text-xl'>Events Attended / Attending</NuText>
            </View>
            <View className='flex-row items-center gap-x-2'>
              <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                <View className='h-8 w-8 bg-whitish rounded-full' />
              </View>
              <NuText variant='bold' className='text-xl text-primary'>0</NuText>
              <NuText variant='medium' className='text-xl'>Events Created</NuText>
            </View>
          </View>
          <View className='flex-row gap-x-2'>
            <TouchableOpacity
              className='bg-primary w-3/5 h-11 rounded-xl flex-row justify-center items-center gap-x-2'
              onPress={() => null}
            >
              <NuText variant='bold' className='text-xl text-white'>Message Center</NuText>
              <AntDesign name="message1" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className='bg-secondary flex-1 h-11 rounded-xl flex-row justify-center items-center gap-x-2'
              onPress={() => router.push('/profile/ProfileSettings')}
            >
              <NuText variant='bold' className='text-xl text-white'>Settings</NuText>
              <AntDesign name="setting" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            <NuText variant='bold' className='text-3xl mb-2'>Event History</NuText>
            <FlatList
              data={sampleEvents}
              renderItem={({ item }) => <EventCardHistory {...item} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              className='-mr-6 opacity-50'
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default MainProfile;