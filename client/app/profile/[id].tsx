import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NuText from '@/src/components/NuText';
import { defaultUserCover } from '@/src/data/defaultValues';
import { ParticipantsIcon } from '@/src/components/Vectors';
import { router, useLocalSearchParams } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { errorMessages } from '@/src/constants/messages';
import { useUser } from '@/src/hooks/user/useUser';
import { Image } from 'expo-image';
import { imageBlurHash } from '@/src/constants/images';
import { Event } from '@/src/types/event';
import { useEvent } from '@/src/hooks/event/useEvent';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { User } from '@/src/types/user';
import EventCardHistory from '@/src/components/event/EventCardHistory';
import { useFriend } from '@/src/hooks/friend/useFriend';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';

const ViewProfile = () => {
    const { id } = useLocalSearchParams();
    const profileId = Array.isArray(id) ? id[0] : id ?? '';
    const decodedToken = useDecodedToken();
    const isCurrentUser = decodedToken?.userId === profileId;

    const { getUserById } = useUser();
    const [user, setUser] = useState<User | null>(null);

    const { onProgress, sendFriendRequest, cancelFriendRequestByUser, removeFriend, checkIsFriend, checkHasPendingRequest } = useFriend();
    const [isFriend, setIsFriend] = useState(false);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);

    const { getCreatedEvents, getJoinedEvents, getFavoritedEvents } = useEvent();
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
    const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
    const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [cEvents, jEvents, fEvents, user, isFriend, hasPendingRequest] = await Promise.all([
                getCreatedEvents(profileId),
                getJoinedEvents(profileId),
                getFavoritedEvents(profileId),
                getUserById(profileId),
                checkIsFriend(profileId),
                checkHasPendingRequest(profileId)
            ]);
            setCreatedEvents(cEvents);
            setJoinedEvents(jEvents);
            setFavoriteEvents(fEvents);
            setUser(user);
            setIsFriend(isFriend);
            setHasPendingRequest(hasPendingRequest);
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
            if (!profileId) return;
            fetchData();
        }, [profileId])
    );

    const handleSendRequest = async () => {
        try {
            await sendFriendRequest(profileId);
            const [isFriend, hasPending] = await Promise.all([
                checkIsFriend(profileId),
                checkHasPendingRequest(profileId),
            ]);
            setIsFriend(isFriend);
            setHasPendingRequest(hasPending);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : errorMessages.default;
            Toast.error(msg);
        }
    };

    const handleCancelRequest = async () => {
        try {
            await cancelFriendRequestByUser(profileId);
            const [isFriend, hasPending] = await Promise.all([
                checkIsFriend(profileId),
                checkHasPendingRequest(profileId),
            ]);
            setIsFriend(isFriend);
            setHasPendingRequest(hasPending);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : errorMessages.default;
            Toast.error(msg);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            await removeFriend(profileId);
            const [isFriend, hasPending] = await Promise.all([
                checkIsFriend(profileId),
                checkHasPendingRequest(profileId),
            ]);
            setIsFriend(isFriend);
            setHasPendingRequest(hasPending);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : errorMessages.default;
            Toast.error(msg);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View className='px-6 gap-y-6 py-14'>
                    <View className='gap-y-6'>
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
                                    <View className='flex-row gap-x-2'>
                                        <NuText variant='bold' className='text-xl text-primary'>{user?.friends.length}</NuText>
                                        <NuText variant='medium' className='text-xl'>Friends</NuText>
                                    </View>
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
                        {/* <View className='flex-row gap-x-2'>
                            <TouchableOpacity
                                className='bg-primary w-full h-11 rounded-xl flex-row justify-center items-center gap-x-2'
                                onPress={() => null}
                            >
                                <NuText variant='bold' className='text-xl text-white'>Message Center</NuText>
                                <AntDesign name="message1" size={20} color="white" />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    <View>
                        <NuText variant='bold' className='text-3xl mb-2 border-b border-neutral-200 pb-1'>Event History</NuText>
                        {
                            user?.isPublic || isFriend ?
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
                                            <NuText variant='medium' className='text-2xl mb-2 ml-2'>Favorite Events {`${favoriteEvents.length && `(${favoriteEvents.length})`}`}</NuText>
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
                                :
                                <View className='h-96 items-center justify-center'>
                                    <NuText variant='medium' className='text-xl text-center text-blackish'>
                                        This user's profile is not public.
                                    </NuText>
                                    <NuText variant='medium' className='text-xl text-center text-blackish'>
                                        Send friend request to see their events.
                                    </NuText>
                                </View>
                        }
                    </View>
                </View>
            </ScrollView>
            {
                !isCurrentUser &&
                <View className='fixed bottom-10'>
                    {isFriend ? (
                        <TouchableOpacity
                            onPress={handleRemoveFriend}
                            disabled={onProgress}
                            className='bg-quaternary h-20 items-center justify-center pb-2 rounded-[14px]'
                        >
                            <NuText variant='extraBold' className='text-2xl text-white'>
                                {!onProgress ? 'REMOVE FRIEND' : 'REMOVING...'}
                            </NuText>
                        </TouchableOpacity>
                    ) : hasPendingRequest ? (
                        <TouchableOpacity
                            onPress={handleCancelRequest}
                            disabled={onProgress}
                            className='bg-yellow-500 h-20 items-center justify-center pb-2 rounded-[14px]'
                        >
                            <NuText variant='extraBold' className='text-2xl text-white'>
                                {!onProgress ? 'CANCEL REQUEST' : 'CANCELLING...'}
                            </NuText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleSendRequest}
                            disabled={onProgress}
                            className='bg-primary h-20 items-center justify-center pb-2 rounded-[14px]'
                        >
                            <NuText variant='extraBold' className='text-2xl text-white'>
                                {!onProgress ? 'SEND FRIEND REQUEST' : 'SENDING...'}
                            </NuText>
                        </TouchableOpacity>
                    )}
                </View>
            }

        </SafeAreaView>
    )
}

export default ViewProfile;