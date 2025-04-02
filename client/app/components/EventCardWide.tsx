import React, { useState } from 'react';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { DateBackground, LocationIcon, FavIcon, LineIcon } from './Vectors';
import NuText from '../components/NuText';
import { Link } from 'expo-router';

export interface ParticipantProps {
    id: string;
    image: ImageSourcePropType;
}
export interface EventCardProps {
    id: string;
    title: string;
    description: string;
    cover: ImageSourcePropType;
    type: 'Social & Networking'
    | 'Concerts & Performances'
    | 'Workshops & Classes'
    | 'Sports & Fitness'
    | 'Food & Drink'
    | 'Business & Tech'
    | 'Art & Creativity'
    | 'Charity & Volunteering';
    date: string;
    capacity: number;
    location: string;
    isOnline: boolean;
    isEntryFree: boolean;
    isLimitedAccess: boolean;
    isVipAccess: boolean;
    participants: ParticipantProps[];
}

const EventCardWide: React.FC<EventCardProps> = ({
    id,
    title,
    cover,
    type,
    date,
    capacity,
    location,
    isOnline,
    isEntryFree,
    isLimitedAccess,
    isVipAccess,
    participants
}) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const dateParts = date.split(' '); // ['30', 'DECEMBER', '18:00']
    const remainingSlots = capacity - participants.length;

    const targetLink = `/details/${id}`;

    return (
        <View className="w-full h-[310px] p-3 mb-3 bg-white rounded-[10px] shadow-[-1px_4px_4px] shadow-greyish">
            <View className="w-full h-[200px] relative overflow-hidden rounded-[10px]">
                <Image source={cover} className="w-full h-full object-cover" resizeMode="cover" />
                <View className="absolute top-6">
                    <View>
                        <DateBackground width={87} height={157.5} viewBox='0 0 58 105' />
                    </View>
                    <View className="absolute top-6 gap-y-1.5">
                        <View>
                            <NuText variant="bold" className="text-4xl text-whitish text-center">
                                {dateParts[0]}
                            </NuText>
                            <NuText variant="semiBold" className="text-3xl text-whitish text-center tracking-wide">
                                {dateParts[1].slice(0, 3)}
                            </NuText>
                        </View>
                        <View>
                            <LineIcon width={70} height={12} viewBox='0 0 48 8' />
                        </View>
                        <NuText variant="bold" className="text-2xl text-whitish text-center">
                            {dateParts[2]}
                        </NuText>
                    </View>
                </View>
                <View className="absolute top-7 right-0 gap-y-1">
                    {isOnline && (
                        <View className="bg-primary px-4 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-xl font-nunitoMedium">Online</Text>
                        </View>
                    )}
                    {remainingSlots > 0 && (
                        <View className="bg-secondary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-xl font-nunitoMedium">{remainingSlots} Spots Left!</Text>
                        </View>
                    )}
                    {isEntryFree && (
                        <View className="bg-tertiary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-xl font-nunitoMedium">Free Entry!</Text>
                        </View>
                    )}
                    {true && (
                        <View className="bg-quaternary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-xl font-nunitoMedium">Limited Access</Text>
                        </View>
                    )}
                    {isVipAccess && (
                        <View className="bg-quintuple px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-blackish text-xl font-nunitoMedium">VIP Access</Text>
                        </View>
                    )}
                </View>
                <Link href={targetLink} className='absolute top-0 right-0 bottom-0 left-0' accessibilityLabel={`View details about ${title}`}></Link>
                <TouchableOpacity className="bg-white rounded-tl-lg pl-2 pr-0.5 pt-2 absolute bottom-0 right-0"
                    onPress={() => setIsFavorited(!isFavorited)}>
                    <FavIcon isFilled={isFavorited} width={22} height={22} viewBox='0 0 16 16' />
                </TouchableOpacity>
            </View>
            <Link href={targetLink} className='flex-1' accessibilityLabel={`View details about ${title}`}>
                <View className="w-full h-full flex-row justify-between pt-2 pb-1.5 px-3">
                    <View className='justify-between'>
                        <View>
                            <NuText variant='regular' className='text-base'>
                                {type}
                            </NuText>
                            <NuText variant="bold" className='text-2xl'>
                                {title}
                            </NuText>
                        </View>
                        <View className='flex-row items-center gap-x-1'>
                            <LocationIcon width={18} height={18} />
                            <NuText variant='bold'>{location}</NuText>
                        </View>
                    </View>
                    <View className='justify-between pt-2'>
                        <View className='flex-row justify-center'>
                            {participants.slice(0, 3).map((participant, index) => (
                                <View key={participant.id} className={`w-8 h-12 rounded-full overflow-hidden ${index === 1 || participants.length === 1 ? 'w-10 h-14 -mt-1 border-2 border-white -ml-1.5 -mr-1.5 z-10' : ''}`}>
                                    <Image source={participant.image} className="w-full h-full object-cover scale-[1.2]" resizeMode="cover" />
                                </View>
                            ))}
                        </View>
                        <View>
                            <NuText variant='bold' className='text-sm'>+{participants.length} participants</NuText>
                        </View>
                    </View>
                </View>
            </Link>
        </View>
    );
};

export default EventCardWide;
