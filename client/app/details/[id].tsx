import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { BackIcon, DateDetailBackground, FavIcon, LineIcon, LocationDetailIcon, ParticipantsIcon, ShareIcon, TimerIcon, WarningIcon } from '@/src/components/Vectors';
import NuText from '@/src/components/NuText';
import NuLink from '@/src/components/NuLink';
import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { formatDate, formatToDayAndTimePeriod } from '@/src/utils/dateUtils';
import { Event } from '@/src/types/event';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { imageBlurHash } from '@/src/constants/images';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';
import { useEvent } from '@/src/hooks/event/useEvent';
import { Toast } from 'toastify-react-native';
import { useEventFavorite } from '@/src/hooks/event/useEventFavorite';
import AntDesign from '@expo/vector-icons/AntDesign';

const EventDetail = () => {
    const { id } = useLocalSearchParams();
    const eventId = id as string;
    const decodedToken = useDecodedToken();

    const [onProgress, setOnProgress] = useState(false);
    const { isFavorited, onProgress: favoriteOnProgress, handleFavorite } = useEventFavorite(eventId);

    const { getEventById, attendEvent, leaveEvent } = useEvent();
    const [event, setEvent] = useState<Event | null>(null);
    const { title, description, quota, type, location, date, isLimitedTime, isOnline, isPrivate, isFree, entranceFee, cover, participants, creator, createdAt, updatedAt } = event || {};
    const [isLoading, setIsLoading] = useState(true);

    const dateParts = formatDate(new Date(date ?? "")).split(" ");
    const remainingSlots = Number(quota) - (participants?.length ?? 0);
    const quotaWithOwner = Number(quota);

    const isUserEventOwner = creator?._id === decodedToken?.userId;
    const isUserParticipant = participants?.some((participant) => participant._id === decodedToken?.userId);
    const editEventLink = `/event/edit-event/${id}` as const;

    const fetchData = async () => {
        setIsLoading(true);
        const result = await getEventById(eventId)
        setEvent(result);
        setIsLoading(false);
    };
    useFocusEffect(
        useCallback(() => {
            if (!eventId) return;
            fetchData();
        }, [])
    );

    const handleAttend = async () => {
        if (!eventId) return;
        if (!decodedToken.userId) {
            Toast.error("You need to be logged in to attend an event.");
            router.push('/(tabs)/profile/login');
            return;
        }
        setOnProgress(true);
        await attendEvent(eventId);
        setOnProgress(false);
        fetchData();
    };

    const handleLeave = async () => {
        if (!eventId) return;
        setOnProgress(true);
        await leaveEvent(eventId);
        setOnProgress(false);
        fetchData();
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
                            <LinearGradient
                                colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)']}
                                style={{ height: 100 }}
                            >
                                <SafeAreaView className='flex-row ps-6 pe-8 justify-between'>
                                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                                        <BackIcon width={24} height={24} />
                                        <NuText variant='bold' className='text-2xl text-white'>Event Detail</NuText>
                                    </TouchableOpacity>
                                    <View className='flex-row gap-x-3'>
                                        <TouchableOpacity onPress={handleFavorite} disabled={favoriteOnProgress}>
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
                        transition={250}
                        placeholder={{ blurhash: imageBlurHash }}
                        style={{ width: "100%", height: "100%" }}
                    />
                    <View className='absolute bottom-0 items-center'>
                        <DateDetailBackground width={316} height={54} />
                        {
                            !isLoading &&
                            <View className='absolute bottom-1.5 flex-row items-center gap-x-0.5'>
                                <NuText variant='bold' className='text-whitish text-3xl'>{dateParts[0]}</NuText>
                                <NuText variant='semiBold' className='text-whitish text-2xl mx-1'>{dateParts[1]}</NuText>
                                <NuText variant='bold' className='text-whitish text-2xl'>2024</NuText>
                                <View className='rotate-[-90deg] mt-1.5 -mx-3'><LineIcon width={48} height={8} /></View>
                                <NuText variant='bold' className='text-whitish text-3xl'>{dateParts[2]}</NuText>
                            </View>
                        }
                    </View>
                </View>
                <View className='p-4'>
                    <NuLink variant='medium' className='text-base' href={`/filters?type=${type?._id}`}>{type?.title}</NuLink>
                    <NuText variant='bold' className='text-2xl mt-2 mb-4'>{title}</NuText>
                    <View className='bg-greeyish p-4 rounded-lg'>
                        <NuText className='text-base mb-2'>{description}</NuText>
                    </View>
                    {
                        (!isFree && entranceFee) &&
                        <View className='bg-neutral-300 my-2 p-2 rounded-lg'>
                            <NuText variant='bold' className='text-lg text-center'>Entrance Free: {entranceFee}</NuText>
                        </View>
                    }
                    <View className='ms-4 mt-4 gap-y-2.5'>
                        <View className='flex-row items-center gap-x-4'>
                            <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                                <TimerIcon width={24} height={24} />
                            </View>
                            <NuText variant='medium' className='text-lg'>{formatToDayAndTimePeriod(new Date(date || ''))}</NuText>
                        </View>
                        <View className='flex-row items-center gap-x-4'>
                            <View className='h-10 w-10 bg-primary rounded-full items-center justify-center'>
                                <ParticipantsIcon width={24} height={24} />
                            </View>
                            <Link href={`/attenders/${id}`}>
                                <View className='flex-row gap-x-2 items-center'>
                                    {quotaWithOwner > 0
                                        ?
                                        <NuText variant='medium' className='text-lg text-primary border-b border-primary'>{quotaWithOwner} PEOPLE</NuText>
                                        :
                                        <NuText variant='medium' className='text-lg text-primary border-b border-primary'>NO QUOTA LIMIT</NuText>
                                    }
                                    {remainingSlots >= 0 && <NuText variant='medium' className='text-base text-secondary'>({remainingSlots} LEFT)</NuText>}
                                </View>
                            </Link>
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
                                <NuText variant='bold'>You can leave the event anytime before it starts.</NuText>
                            </View>
                            <View className='bg-greeyish flex-row items-center gap-x-2 px-4 py-2 rounded-lg'>
                                <WarningIcon width={24} height={24} />
                                <NuText variant='bold'>You can't join if the participant limit is full.</NuText>
                            </View>
                            <View className='bg-greeyish flex-row items-center gap-x-2 px-4 py-2 rounded-lg'>
                                <WarningIcon width={24} height={24} />
                                <NuText variant='bold'>Only logged-in users can join events.</NuText>
                            </View>
                            <View className='bg-greeyish flex-row items-center gap-x-2 px-4 py-2 rounded-lg'>
                                <WarningIcon width={24} height={24} />
                                <NuText variant='bold'>The organizer can approve or cancel participation.</NuText>
                            </View>
                            <View className='bg-greeyish flex-row items-center gap-x-2 pl-4 pr-12 py-2 rounded-lg'>
                                <WarningIcon width={24} height={24} />
                                <NuText variant='bold'>Participants who break the rules may be removed by the organizer.</NuText>
                            </View>
                            <View className='bg-greeyish flex-row justify-center items-center px-4 py-2 rounded-lg'>
                                <NuText variant='mediumItalic' className='text-neutral-700 italic'>The platform owners are not responsible for any event or its content.</NuText>
                            </View>
                        </View>
                    </View>
                    <View className='mt-6 border-t border-neutral-300 p-4 rounded-lg'>
                        <NuText variant='bold' className='text-lg text-neutral-900'>
                            {`This event was created on ${formatDate(new Date(createdAt || ''))} and last updated on ${formatDate(new Date(updatedAt || ''))}.`}
                        </NuText>
                    </View>
                </View>
            </ScrollView>
            {
                !isLoading &&
                    isUserEventOwner ? (
                    <View className='fixed bottom-0'>
                        <TouchableOpacity onPress={() => router.push(editEventLink)} className='bg-secondary h-16 items-center justify-center rounded-t-3xl'>
                            <NuText variant='extraBold' className='text-2xl text-white'>EDIT EVENT</NuText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push(`/attenders/${id}`)} className='bg-primary h-20 items-center justify-center pb-2'>
                            <NuText variant='extraBold' className='text-2xl text-white'>VIEW ATTENDEES</NuText>
                        </TouchableOpacity>
                    </View>)
                    :
                    isUserParticipant ?
                        <View className='fixed bottom-0'>
                            <TouchableOpacity onPress={() => router.push(`/message-center/${eventId}?fromDetailPage=1`)} className='bg-primary h-16 items-center justify-center rounded-t-3xl flex-row gap-x-2'>
                                <NuText variant='extraBold' className='text-2xl text-white'>EVENT CHAT</NuText>
                                <AntDesign name="wechat" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLeave} disabled={onProgress} className='bg-quaternary h-20 items-center justify-center pb-2'>
                                <NuText variant='extraBold' className='text-2xl text-white'>{!onProgress ? 'LEAVE' : 'LEAVING...'}</NuText>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity onPress={handleAttend} disabled={onProgress} className='fixed bottom-0 bg-primary h-20 items-center justify-center pb-2 rounded-[14px]'>
                            <NuText variant='extraBold' className='text-2xl text-white'>{!onProgress ? 'ATTEND NOW' : 'ATTENDING...'}</NuText>
                        </TouchableOpacity>
            }
        </View>
    );
}

export default EventDetail;
