import NuText from '@/src/components/NuText';
import { imageBlurHash } from '@/src/constants/images';
import { defaultUserCover } from '@/src/data/defaultValues';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { useEvent } from '@/src/hooks/event/useEvent';
import { Event } from '@/src/types/event';
import { Participant } from '@/src/types/participant';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewAttenders = () => {
    const { id } = useLocalSearchParams();
    const eventId = id as string;
    const decodedToken = useDecodedToken();
    const [onProgress, setOnProgress] = useState(false);

    const { getEventById, removeParticipantFromEvent } = useEvent();
    const [event, setEvent] = useState<Event | null>(null);
    const [attenders, setAttenders] = useState<Participant[]>([]);
    const [creator, setCreator] = useState<Participant | null>(null);

    const isCurrentUserEventOwner = creator?._id === decodedToken?.userId;

    const fetchEvent = async () => {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        setAttenders(eventData.participants.filter((participant: Participant) => participant._id !== eventData.creator._id));
        setCreator(eventData.creator);
    };

    useEffect(() => {
        if (!id) return;
        fetchEvent();
    }, [id, getEventById]);

    const handleRemoveParticipantFromEvent = async (participantId: string) => {
        setOnProgress(true);
        await removeParticipantFromEvent(eventId, participantId);
        fetchEvent();
        setOnProgress(false);
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 pt-14">
            <StatusBar style="light" />
            <ScrollView className="px-5" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View className='mt-8'>
                    <NuText variant='bold' className='text-3xl mb-2 border-b border-neutral-200 pb-1'>Event Creator</NuText>
                    <Animated.View
                        key={creator?._id}
                        entering={FadeInUp.delay(50)}
                        className="w-full h-24 bg-primary rounded p-4 mt-2 flex flex-row justify-between items-center shadow"
                    >
                        <View className="flex-row items-center gap-x-4">
                            <Link href={`/profile/${creator?._id}`}>
                                <View className="w-16 h-16 rounded-full overflow-hidden">
                                    <Image
                                        source={creator?.photo || defaultUserCover}
                                        contentFit="cover"
                                        transition={250}
                                        placeholder={{ blurhash: imageBlurHash }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </View>
                            </Link>
                            <Link href={`/profile/${creator?._id}`}>
                                <View>
                                    <NuText variant="bold" className="text-2xl text-white">{`${creator?.name} ${creator?.surname}`}</NuText>
                                    <NuText variant="regular" className="text-white">@{creator?.username}</NuText>
                                </View>
                            </Link>
                        </View>
                    </Animated.View>
                </View>
                <View className="mt-8">
                    <NuText variant="bold" className="text-3xl mb-2 border-b border-neutral-200 pb-1">
                        Attendees
                        &nbsp;
                        {attenders.length + 1}
                        {Number(event?.quota) > 0 && '/' + Number(event?.quota)}
                    </NuText>
                    {attenders.length > 0 ? (
                        attenders.map((attender) => (
                            <Animated.View
                                key={attender._id}
                                entering={FadeInUp.delay(50)}
                                className="w-full h-24 bg-primary rounded p-4 mt-2 flex flex-row justify-between items-center shadow"
                            >
                                <View className="flex-row items-center gap-x-4">
                                    <Link href={`/profile/${attender._id}`}>
                                        <View className="w-16 h-16 rounded-full overflow-hidden">
                                            <Image
                                                source={attender.photo || defaultUserCover}
                                                contentFit="cover"
                                                transition={250}
                                                placeholder={{ blurhash: imageBlurHash }}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                    </Link>
                                    <Link href={`/profile/${attender._id}`}>
                                        <View>
                                            <NuText variant="bold" className="text-2xl text-white">{`${attender.name} ${attender.surname}`}</NuText>
                                            <NuText variant="regular" className="text-white">@{attender.username}</NuText>
                                        </View>
                                    </Link>
                                </View>
                                {
                                    isCurrentUserEventOwner &&
                                    <TouchableOpacity onPress={() => handleRemoveParticipantFromEvent(attender._id)} disabled={onProgress} className="w-24 bg-red-700 justify-between items-center rounded p-2">
                                        <AntDesign name="close" size={24} color="white" />
                                        <NuText variant="bold" className="text-white">{onProgress ? 'Cancelling' : 'Cancel'}</NuText>
                                    </TouchableOpacity>
                                }
                            </Animated.View>
                        ))
                    ) : (
                        <Animated.View entering={FadeInUp.delay(50)}>
                            <NuText variant="regular" className="text-neutral-800 mt-4">
                                You don't have any attenders yet.
                            </NuText>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewAttenders