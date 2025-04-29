import React, { useState } from 'react';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { DateBackground, LocationIcon, FavIcon, LineIcon } from './Vectors';
import NuText from '../components/NuText';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { clipText } from '../utils/textUtils';


export interface EventCardHistoryProps {
    id: string;
    title: string;
    cover: ImageSourcePropType;
    date: string;
}

const EventCardHistory: React.FC<EventCardHistoryProps> = ({ id, title, cover, date }) => {
    const dateParts = date.split(' ');

    const targetLink = `/details/${id}`;
    return (
        <View className="w-[180px] h-[180px] mr-3 relative rounded-[15px] overflow-hidden shadow-[-1px_4px_4px] shadow-greyish">
            <Image source={cover} className="w-full h-full object-cover" resizeMode="cover" />
            <View className='absolute h-2/3 left-0 right-0 bottom-0 justify-end'>
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 1)']}
                    style={{ flex: 1 }} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }} />
            </View>
            <View className="absolute top-0">
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
            <View className='absolute left-4 bottom-7'>
                <NuText variant="bold" className="text-2xl text-white">{clipText(title, 16)}</NuText>
            </View>
            <Link href={targetLink} className='absolute top-0 right-0 bottom-0 left-0' accessibilityLabel={`View details about ${title}`}></Link>
        </View>
    );
};

export default EventCardHistory;
