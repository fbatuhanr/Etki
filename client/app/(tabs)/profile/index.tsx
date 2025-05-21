import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import NuText from '@/src/components/NuText';
import { defaultUserCover } from '@/src/data/defaultValues';
import { ParticipantsIcon } from '@/src/components/Vectors';
import { Link, router } from 'expo-router';
import { TouchableWithoutFeedback } from 'react-native';
import COLORS from '@/src/constants/colors';
import useAuthentication from '@/src/hooks/common/useAuthentication';
import { Toast } from 'toastify-react-native';
import { errorMessages } from '@/src/constants/messages';
import { useUser } from '@/src/hooks/user/useUser';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { Image } from 'expo-image';
import { imageBlurHash } from '@/src/constants/images';
import { Event } from '@/src/types/event';
import { useEvent } from '@/src/hooks/event/useEvent';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { User } from '@/src/types/user';
import { UserGuard } from '@/src/guards';
import EventCardHistory from '@/src/components/event/EventCardHistory';
import { useFriend } from '@/src/hooks/friend/useFriend';

const Profile = () => {
  const decodedToken = useDecodedToken();

  const { logoutCall } = useAuthentication();
  const { getUserById } = useUser();
  const [user, setUser] = useState<User | null>(null);

  const { getCreatedEvents, getJoinedEvents, getFavoritedEvents } = useEvent();
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);

  const { getIncomingRequests } = useFriend();
  const [incomingRequestsCount, setIncomingRequestsCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [cEvents, jEvents, fEvents, user, iRequests] = await Promise.all([
        getCreatedEvents(decodedToken.userId),
        getJoinedEvents(decodedToken.userId),
        getFavoritedEvents(decodedToken.userId),
        getUserById(decodedToken.userId),
        getIncomingRequests()
      ]);
      setCreatedEvents(cEvents);
      setJoinedEvents(jEvents);
      setFavoriteEvents(fEvents);
      setUser(user);
      setIncomingRequestsCount(iRequests.length);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : errorMessages.default;
      Toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!decodedToken.userId) return;
      fetchData();
    }, [decodedToken.userId])
  );

  const handleLogout = async () => {
    setIsLoading(true);
    Toast.info("Logging out...");

    try {
      await logoutCall();
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserGuard>
      <TouchableWithoutFeedback onPress={() => { if (showMore) setShowMore(false); }}>
        <View>
          <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View className='px-6 gap-y-6 pb-14'>
              <View className='gap-y-6'>
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
                      source={user?.photo || defaultUserCover}
                      contentFit="cover"
                      transition={500}
                      placeholder={{ blurhash: imageBlurHash }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  <View>
                    <NuText variant='extraBold' className='text-4xl leading-tight'>{user?.name}</NuText>
                    <NuText variant='extraBold' className='text-4xl leading-tight'>{user?.surname}</NuText>
                  </View>
                </View>
                <View className='h-16 justify-center'>
                  {
                    (user?.biography && user?.biography.trim()) ?
                      <NuText variant='mediumItalic' className='text-xl text-center text-blackish'>
                        {user.biography}
                      </NuText>
                      :
                      <TouchableOpacity onPress={() => router.push('/profile/profile-settings')}>
                        <NuText variant='mediumItalic' className='text-xl text-center text-blackish'>
                          Tap here to add biography text...
                        </NuText>
                      </TouchableOpacity>
                  }
                </View>
              </View>
              <View className='gap-y-6 '>
                <NuText variant='bold' className='text-3xl border-b border-neutral-200 pb-1'>{user?.username}</NuText>
                <View className='gap-y-3'>
                  <View className='flex-row gap-x-8'>
                    <View className='flex-row items-center gap-x-2'>
                      <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                        <ParticipantsIcon width={24} height={24} />
                      </View>
                      <Link href={'/profile/friends'}>
                        <View className='border-b border-primary flex-row gap-x-2'>
                          <NuText variant='extraBold' className='text-2xl text-primary'>{user?.friends.length}</NuText>
                          <NuText variant='extraBold' className='text-2xl text-primary'>Friends</NuText>
                          {
                            !!incomingRequestsCount &&
                            <View className='relative'>
                              <View><AntDesign name="bells" size={24} color={COLORS.primaryActive} /></View>
                              <View className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary justify-center items-center'>
                                <NuText variant='bold' className='text-sm text-white text-center'>{incomingRequestsCount}</NuText>
                              </View>
                            </View>
                          }
                        </View>
                      </Link>
                    </View>
                  </View>
                  <View className='flex-row items-center gap-x-2'>
                    <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                      <View className='h-8 w-8 bg-whitish rounded-full' />
                    </View>
                    <NuText variant='bold' className='text-xl text-primary'>{joinedEvents.length}</NuText>
                    <NuText variant='medium' className='text-xl'>Event Attends</NuText>
                  </View>
                  <View className='flex-row items-center gap-x-2'>
                    <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                      <View className='h-8 w-8 bg-whitish rounded-full' />
                    </View>
                    <NuText variant='bold' className='text-xl text-primary'>{createdEvents.length}</NuText>
                    <NuText variant='medium' className='text-xl'>Events Created</NuText>
                  </View>
                </View>
                <View className='flex-row gap-x-2'>
                  <TouchableOpacity
                    className='bg-primary w-3/5 h-11 rounded-xl flex-row justify-center items-center gap-x-2'
                    onPress={() => router.push('/message-center')}
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
              </View>
              <View>
                <NuText variant='bold' className='text-3xl mb-2 border-b border-neutral-200 pb-1'>Event History</NuText>
                <View className='mt-2 gap-y-4'>
                  <View>
                    <NuText variant='medium' className='text-2xl mb-2 ml-2'>Joined Events</NuText>
                    {
                      joinedEvents.length > 0 ?
                        <FlatList
                          data={joinedEvents}
                          renderItem={({ item }) => <EventCardHistory {...item} />}
                          keyExtractor={(item) => item._id}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          className='-mr-6'
                        />
                        :
                        <View className='h-40 items-center justify-center'>
                          <NuText variant='medium' className='text-xl text-center text-blackish'>
                            No joined events yet...
                          </NuText>
                        </View>
                    }
                  </View>
                  {
                    <View className='border-b border-t border-neutral-200 pt-2 pb-6'>
                      <NuText variant='medium' className='text-2xl mb-2 ml-2'>Favorite Events</NuText>
                      {
                        favoriteEvents.length > 0 ?
                          <FlatList
                            data={favoriteEvents}
                            renderItem={({ item }) => <EventCardHistory {...item} />}
                            keyExtractor={(item) => item._id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className='-mr-6'
                          />
                          :
                          <View className='h-40 items-center justify-center'>
                            <NuText variant='medium' className='text-xl text-center text-blackish'>
                              No favorite events yet...
                            </NuText>
                          </View>
                      }
                    </View>
                  }
                  <View>
                    <NuText variant='medium' className='text-2xl mb-2 ml-2'>Created Events</NuText>
                    {
                      createdEvents.length > 0 ?
                        <FlatList
                          data={createdEvents}
                          renderItem={({ item }) => <EventCardHistory {...item} />}
                          keyExtractor={(item) => item._id}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          className='-mr-6'
                        />
                        :
                        <View className='h-40 items-center justify-center'>
                          <NuText variant='medium' className='text-xl text-center text-blackish'>
                            No created events yet...
                          </NuText>
                        </View>
                    }
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </UserGuard>
  )
}

export default Profile;