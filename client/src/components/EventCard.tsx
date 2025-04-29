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

const EventCard: React.FC<EventCardProps> = ({
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
        <View className="w-[226px] h-[326px] p-2 mr-2 bg-white rounded-tr-[15px] rounded-br-[15px] rounded-bl-[15px] shadow-[-1px_4px_4px] shadow-greyish">
            <View className="w-[209px] h-[209px] relative overflow-hidden rounded-tr-[15px] rounded-bl-[15px]">
                <Image source={cover} className="w-full h-full object-cover" resizeMode="cover" />
                <View className="absolute top-12">
                    <DateBackground width={58} height={105}/>
                    <View className="absolute top-4">
                        <View>
                            <NuText variant="bold" className="text-2xl text-whitish -mb-1 text-center">
                                {dateParts[0]}
                            </NuText>
                            <NuText variant="semiBold" className="text-lg text-whitish text-center">
                                {dateParts[1].slice(0,3)}
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
                    {isEntryFree && (
                        <View className="bg-tertiary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-sm font-nunitoMedium">Free Entry!</Text>
                        </View>
                    )}
                    {isLimitedAccess && (
                        <View className="bg-quaternary px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-white text-sm font-nunitoMedium">Limited Access</Text>
                        </View>
                    )}
                    {isVipAccess && (
                        <View className="bg-quintuple px-2 rounded-tl-[5px] rounded-bl-[5px] self-end">
                            <Text className="text-blackish text-sm font-nunitoMedium">VIP Access</Text>
                        </View>
                    )}
                </View>
                <Link href={targetLink} className='absolute top-0 right-0 bottom-0 left-0' accessibilityLabel={`View details about ${title}`}></Link>
                <TouchableOpacity className="bg-white rounded-tl-lg pl-2 pr-0.5 pt-2 absolute bottom-0 right-0"
                    onPress={() => setIsFavorited(!isFavorited)}>
                    <FavIcon isFilled={isFavorited} width={16} height={16} />
                </TouchableOpacity>
            </View>
            <Link href={targetLink} className='flex-1 mt-1.5' accessibilityLabel={`View details about ${title}`}>
                <View className="w-full h-full justify-between pt-1 pb-2 px-3">
                    <View>
                        <NuText variant="bold" className="text-xl">
                            {title}
                        </NuText>
                    </View>
                    <View className="flex-row items-center justify-evenly gap-x-2 ps-4 pe-2">
                        <View className="flex-row items-center">
                            {participants.slice(0, 3).map((participant, index) => (
                                <View key={participant.id} className={`w-6 h-6 rounded-full overflow-hidden ${index === 1 || participants.length === 1 ? 'w-8 h-8 border-2 border-white -ml-2.5 -mr-2.5 z-10' : ''}`}>
                                    <Image source={participant.image} className="w-full h-full object-cover scale-[1.2]" resizeMode="cover" />
                                </View>
                            ))}
                        </View>
                        <View>
                            {/* {participants.length > 3 && (
                            <NuText variant="bold">+{participants.length - 3} participants</NuText>
                        )} */}
                            <NuText variant='semiBold'>+{participants.length} participants</NuText>
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
