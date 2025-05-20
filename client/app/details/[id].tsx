import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { BackIcon, DateDetailBackground, FavIcon, LineIcon, LocationDetailIcon, ParticipantsIcon, ShareIcon, TimerIcon, WarningIcon } from '@/src/components/Vectors';
import NuText from '@/src/components/NuText';
import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { useGet } from '@/src/hooks/common/useGet';
import { formatDate } from '@/src/utils/dateUtils';
import { Event } from '@/src/types/event';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { imageBlurHash } from '@/src/constants/images';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';
import { useEvent } from '@/src/hooks/event/useEvent';
import useAxios from '@/src/hooks/common/useAxios';
import { errorMessages, successMessages } from '@/src/constants/messages';
import { Toast } from 'toastify-react-native';
import { set } from 'react-hook-form';
import { useEventFavorite } from '@/src/hooks/event/useEventFavorite';

const EventDetail = () => {
    const { id } = useLocalSearchParams();
    const decodedToken = useDecodedToken();
    const axiosInstance = useAxios();

    const [onProgress, setOnProgress] = useState(false);
    const { isFavorited, onProgress: favoriteOnProgress, handleFavorite } = useEventFavorite(id as string);

    const { getEventById } = useEvent();
    const [event, setEvent] = useState<Event | null>(null);
    const { title, description, quota, type, location, date, isLimitedTime, isOnline, isPrivate, isFree, cover, participants, creator } = event || {};

    const dateParts = formatDate(new Date(date ?? "")).split(" ");
    const remainingSlots = Number(quota) - (participants?.length ?? 0) + 1;
    const quotaWithOwner = Number(quota) + 1;

    const isUserEventOwner = creator?._id === decodedToken?.userId;
    const isUserParticipant = participants?.some((participant) => participant._id === decodedToken?.userId);
    const editEventLink = `/event/edit-event/${id}` as const;

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setEvent(await getEventById(id as string));
            };
            fetchData();
        }, [])
    );

    const handleAttend = async () => {
        if (!id) return;
        if (!decodedToken.userId) {
            Toast.error("You need to be logged in to attend an event.");
            router.push('/(tabs)/profile/login');
            return;
        }
        try {
            setOnProgress(true);
            Toast.info("Joining event...");
            const { data: responseData } = await axiosInstance.post(`/event/${id}/attend`);
            Toast.success(responseData.message || successMessages.attended);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : errorMessages.attended;
            Toast.error(message);
        }
        finally {
            setOnProgress(false);
        }
    };

    const handleLeave = async () => {
        if (!id) return;
        try {
            setOnProgress(true);
            Toast.info("Leaving event...");
            const { data: responseData } = await axiosInstance.post(`/event/${id}/leave`);
            Toast.success(responseData.message || successMessages.unAttended);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : errorMessages.unAttended;
            Toast.error(message);
        }
        finally {
            setOnProgress(false);
        }
    };

    const handleShare = async () => {
        const message = 'Event Name: Example Event\nJoin us at this amazing event!';
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
            await Sharing.shareAsync(message);
        } else {
            alert('Sharing is not available on this device');
        }
    };

    return (
        <View className='flex-1 bg-whitish'>
            <ScrollView>
                <StatusBar style="light" />
                <Stack.Screen
                    options={{
                        headerTransparent: true,
                        header: ({ navigation }) => (
                            <LinearGradient colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']} className='flex-1' start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                                <SafeAreaView className='flex-row ps-6 pe-8 justify-between'>
                                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                                        <BackIcon width={24} height={24} />
                                        <NuText variant='bold' className='text-2xl text-white'>Event Detail</NuText>
                                    </TouchableOpacity>
                                    <View className='flex-row gap-x-3'>
                                        <TouchableOpacity onPress={handleFavorite} disabled={onProgress}>
                                            <FavIcon isFilled={isFavorited} isWhite height={26} width={26} viewBox='0 0 16 14' strokeWidth={1.25} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleShare}>
                                            <ShareIcon width={25} height={25} />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </LinearGradient>
                        )
                    }}
                />
                <View className='h-96 w-full relative overflow-hidden items-center'>
                    <Image
                        source={cover}
                        contentFit="cover"
                        transition={500}
                        placeholder={{ blurhash: imageBlurHash }}
                        style={{ width: "100%", height: "100%" }}
                    />
                    <View className='absolute bottom-0 items-center'>
                        <DateDetailBackground width={316} height={54} />
                        <View className='absolute bottom-1.5 flex-row items-center gap-x-0.5'>
                            <NuText variant='bold' className='text-whitish text-3xl'>{dateParts[0]}</NuText>
                            <NuText variant='semiBold' className='text-whitish text-2xl mx-1'>{dateParts[1]}</NuText>
                            <NuText variant='bold' className='text-whitish text-2xl'>2024</NuText>
                            <View className='rotate-[-90deg] mt-1.5 -mx-3'><LineIcon width={48} height={8} /></View>
                            <NuText variant='bold' className='text-whitish text-3xl'>{dateParts[2]}</NuText>
                        </View>
                    </View>
                </View>
                <View className='p-4'>
                    <NuText variant='medium' className='text-base'>{type?.title}</NuText>
                    <NuText variant='bold' className='text-2xl mt-2 mb-4'>{title}</NuText>
                    <View className='bg-greeyish p-4 rounded-lg'>
                        <NuText className='text-base mb-2'>{description}</NuText>
                    </View>
                    <View className='ms-4 mt-4 gap-y-2.5'>
                        <View className='flex-row items-center gap-x-4'>
                            <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                                <TimerIcon width={24} height={24} />
                            </View>
                            <NuText variant='medium' className='text-lg'>MONDAY EVENING</NuText>
                        </View>
                        <View className='flex-row items-center gap-x-4'>
                            <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                                <ParticipantsIcon width={24} height={24} />
                            </View>
                            <View className='flex-row gap-x-2 items-centeer'>
                                <NuText variant='medium' className='text-lg'>{quotaWithOwner} PEOPLE</NuText>
                                <NuText variant='medium' className='text-base text-secondary'>({remainingSlots} LEFT)</NuText>
                            </View>
                        </View>
                        <View className='flex-row items-center gap-x-4'>
                            <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                                <LocationDetailIcon width={24} height={24} />
                            </View>
                            <NuText variant='medium' className='text-lg'>{location}</NuText>
                        </View>
                    </View>

                    <View className="-mx-4 mt-6 gap-y-1">
                        {isOnline && (
                            <View className="bg-primary px-2 py-0.5">
                                <NuText variant='bold' className="text-white text-xl text-center">Online</NuText>
                            </View>
                        )}
                        {isFree && (
                            <View className="bg-tertiary px-2 py-0.5">
                                <NuText variant='bold' className="text-white text-xl text-center">Free Entry!</NuText>
                            </View>
                        )}
                        {isLimitedTime && (
                            <View className="bg-quaternary px-2 py-0.5">
                                <NuText variant='bold' className="text-white text-xl text-center">Limited Access</NuText>
                            </View>
                        )}
                        {isPrivate && (
                            <View className="bg-quintuple px-2 py-0.5">
                                <NuText variant='bold' className="text-blackish text-xl text-center">VIP Access</NuText>
                            </View>
                        )}
                    </View>

                    <View className='mt-6'>
                        <NuText variant='bold' className='text-xl'>RULES</NuText>
                        <View className='mt-3 gap-y-1'>
                            <View className='bg-greeyish flex-row items-center gap-x-2 px-4 py-2 rounded-lg'>
                                <WarningIcon width={24} height={24} />
                                <NuText variant='bold'>Mauris a leo magna.</NuText>
                            </View>
                            <View className='bg-greeyish flex-row items-center gap-x-2 px-4 py-2 rounded-lg'>
                                <WarningIcon width={24} height={24} />
                                <NuText variant='bold'>Aenean nisl diam pulvinar ultrices.</NuText>
                            </View>
                            <View className='bg-greeyish flex-row items-center gap-x-2 px-4 py-2 rounded-lg'>
                                <WarningIcon width={24} height={24} />
                                <NuText variant='bold'>Mauris a leo magna.</NuText>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {
                isUserEventOwner && (
                    <TouchableOpacity onPress={() => router.push(editEventLink)} className='fixed bottom-0 bg-secondary h-20 items-center justify-center pb-2 rounded-[14px]'>
                        <NuText variant='extraBold' className='text-2xl text-white'>EDIT EVENT</NuText>
                    </TouchableOpacity>
                )
            }
            {
                !isUserEventOwner && (
                    isUserParticipant ?
                        <TouchableOpacity onPress={handleLeave} disabled={onProgress} className='fixed bottom-0 bg-quaternary h-20 items-center justify-center pb-2 rounded-[14px]'>
                            <NuText variant='extraBold' className='text-2xl text-white'>{!onProgress ? 'LEAVE' : 'LEAVING...'}</NuText>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={handleAttend} disabled={onProgress} className='fixed bottom-0 bg-primary h-20 items-center justify-center pb-2 rounded-[14px]'>
                            <NuText variant='extraBold' className='text-2xl text-white'>{!onProgress ? 'ATTEND NOW' : 'ATTENDING...'}</NuText>
                        </TouchableOpacity>
                )
            }
        </View>
    );
}

export default EventDetail;
