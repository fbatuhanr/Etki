import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import NuText from '@/src/components/NuText';
import { defaultUserCover } from '@/src/data/defaultValues';
import { ParticipantsIcon } from '@/src/components/Vectors';
import { router } from 'expo-router';
import { TouchableWithoutFeedback } from 'react-native';
import COLORS from '@/src/constants/colors';
import useAuthentication from '@/src/hooks/common/useAuthentication';
import { Toast } from 'toastify-react-native';
import { errorMessages, successMessages } from '@/src/constants/messages';
import { useUser } from '@/src/hooks/user/useUser';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { Image } from 'expo-image';
import { imageBlurHash } from '@/src/constants/images';
import { Event } from '@/src/types/event';
import { useGet } from '@/src/hooks/common/useGet';

const MainProfile = () => {

  const decodedToken = useDecodedToken();
  const { logoutCall } = useAuthentication();
  const { getUserById, data, loading, error } = useUser();
  const { data: createdEvents, loading: loadingCreated, error: errorCreated } = useGet<Event[]>(`/events/created/${decodedToken.userId}`)
  const { data: joinedEvents, loading: loadingJoined, error: errorJoined } = useGet<Event[]>(`/events/joined/${decodedToken.userId}`)

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
              <Image
                source={data?.photo || defaultUserCover}
                contentFit="cover"
                transition={500}
                placeholder={{ blurhash: imageBlurHash }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <View>
              <NuText variant='extraBold' className='text-4xl leading-tight'>{data?.name}</NuText>
              <NuText variant='extraBold' className='text-4xl leading-tight'>{data?.surname}</NuText>
            </View>
          </View>
          <View className='h-16 justify-center'>
            {
              (data?.biography && data?.biography.trim()) ?
                <NuText variant='bold' className='text-2xl'>
                  {data.biography}
                </NuText>
                :
                <TouchableOpacity onPress={() => router.push('/profile/profile-settings')}>
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
                <NuText variant='extraBold' className='text-2xl text-primary'>0</NuText>
                <NuText variant='semiBold' className='text-2xl'>Friends</NuText>
              </View>
            </View>
            <View className='flex-row items-center gap-x-2'>
              <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                <View className='h-8 w-8 bg-whitish rounded-full' />
              </View>
              <NuText variant='bold' className='text-xl text-primary'>0</NuText>
              <NuText variant='medium' className='text-xl'>Event Attends</NuText>
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
              onPress={() => router.push('/profile/profile-settings')}
            >
              <NuText variant='bold' className='text-xl text-white'>Settings</NuText>
              <AntDesign name="setting" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            <NuText variant='bold' className='text-3xl mb-2'>Event History</NuText>
            {/* <FlatList
              data={}
              renderItem={({ item }) => <EventCardHistory {...item} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              className='-mr-6 opacity-50'
            /> */}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default MainProfile;