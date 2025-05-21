import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { DateBackground, LocationIcon, FavIcon, LineIcon } from '@/src/components/Vectors';
import NuText from '@/src/components/NuText';
import { Link } from 'expo-router';
import { formatDate } from '@/src/utils/dateUtils';
import { EventCard as IEventCard } from '@/src/types/event';
import { imageBlurHash } from '@/src/constants/images';
import { cn } from '@/src/lib/utils';
import { defaultUserCover } from '@/src/data/defaultValues';
import { useEventFavorite } from '@/src/hooks/event/useEventFavorite';

const EventCard: React.FC<IEventCard> = ({
    _id,
    title,
    quota,
    location,
    date,
    isLimitedTime,
    isOnline,
    isPrivate,
    isFree,
    cover,
    participants
}) => {
    const { isFavorited, onProgress, handleFavorite } = useEventFavorite(_id);
    const dateParts = formatDate(new Date(date ?? "")).split(" ");
    const remainingSlots = Number(quota) - (participants?.length ?? 0);
    const targetLink = `/details/${_id}` as const;
    return (
        <View className="w-[226px] h-[326px] p-2 mr-2 bg-white rounded-tr-[15px] rounded-br-[15px] rounded-bl-[15px] shadow-[-1px_4px_4px] shadow-greyish">
            <View className="w-[209px] h-[209px] relative overflow-hidden rounded-tr-[15px] rounded-bl-[15px]">
                <Image
                    source={cover}
                    contentFit="cover"
                    transition={500}
                    placeholder={{ blurhash: imageBlurHash }}
                    style={{ width: "100%", height: "100%" }}
                />
                <View className="absolute top-12">
                    <DateBackground width={58} height={105} />
                    <View className="absolute top-4">
                        <View>
                            <NuText variant="bold" className="text-2xl text-whitish -mb-1 text-center">
                                {dateParts[0]}
                            </NuText>
                            <NuText variant="semiBold" className="text-lg text-whitish text-center">
                                {dateParts[1].slice(0, 3)}
                            </NuText>
                        </View>
                        <LineIcon width={48} height={8} />
                        <NuText variant="bold" className="text-base text-whitish text-center">
                            {dateParts[2]}
                        </NuText>
                    </View>
                </View>
                <View className="absolute top-5 right-0 gap-y-1">
                    {isOnline && (
                        <View className="bg-primary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-sm font-nunitoMedium">Online</Text>
                        </View>
                    )}
                    {remainingSlots > 0 && (
                        <View className="bg-secondary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-sm font-nunitoMedium">{remainingSlots} Spots Left!</Text>
                        </View>
                    )}
                    {isFree && (
                        <View className="bg-tertiary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-sm font-nunitoMedium">Free Entry!</Text>
                        </View>
                    )}
                    {isLimitedTime && (
                        <View className="bg-quaternary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-sm font-nunitoMedium">Limited Access</Text>
                        </View>
                    )}
                    {isPrivate && (
                        <View className="bg-quintuple px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-blackish text-sm font-nunitoMedium">VIP Access</Text>
                        </View>
                    )}
                </View>
                <Link href={targetLink} className='absolute top-0 right-0 bottom-0 left-0' accessibilityLabel={`View details about ${title}`}></Link>
                <TouchableOpacity
                    disabled={onProgress}
                    onPress={handleFavorite}
                    className="bg-white rounded-tl-lg pl-2 pr-0.5 pt-2 absolute bottom-0 right-0"
                >
                    <FavIcon isFilled={isFavorited} width={16} height={16} />
                </TouchableOpacity>
            </View>
            <Link href={targetLink} className='flex-1 mt-1.5' accessibilityLabel={`View details about ${title}`}>
                <View className="w-full h-full justify-between pt-1 pb-1 px-3">
                    <View>
                        <NuText variant="bold" className="text-xl">
                            {title}
                        </NuText>
                    </View>
                    <View className="flex-row items-center justify-evenly gap-x-2 ps-4 pe-2 border-t border-b py-0.5 border-neutral-200">
                        <View className='flex-row justify-center items-center'>
                            {Array(3).fill(null).map((_, i) =>
                                participants.slice(0, 3)[i - Math.floor((3 - participants.length) / 2)] || null
                            ).map((participant, index) => (
                                <View
                                    key={participant?._id || `placeholder-${index}`}
                                    className={cn(
                                        "w-6 h-6 rounded-full overflow-hidden",
                                        index === 1 && "w-8 h-8 border-2 border-white -ml-1 -mr-1 z-10"
                                    )}
                                >
                                    <Image
                                        source={participant?.photo || defaultUserCover}
                                        contentFit="cover"
                                        transition={500}
                                        placeholder={{ blurhash: imageBlurHash }}
                                        style={{ width: "100%", height: "100%", }}
                                    />
                                </View>
                            ))}
                        </View>
                        <View>
                            {/* {participants.length > 3 && (
                            <NuText variant="bold">+{participants.length - 3} participants</NuText>
                        )} */}
                            <NuText variant='semiBold'>+{participants?.length} participants</NuText>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-x-1">
                        <LocationIcon width={18} height={18} />
                        <NuText variant='bold'>{location}</NuText>
                    </View>
                </View>
            </Link>
        </View>
    );
};

export default EventCard;
