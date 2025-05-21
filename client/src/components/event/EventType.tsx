import React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native'
import NuText from '@/src/components/NuText'
import { Link } from 'expo-router';
import { cn } from '@/src/lib/utils';
import { imageBlurHash } from '@/src/constants/images';
import { EventType as IEventType } from '@/src/types/event-type';

type EventTypeProps = IEventType & { extraClass?: string }
const EventType: React.FC<EventTypeProps> = ({ _id, title, cover, extraClass }) => {
    return (
        <View
            className={cn(
                "h-28 w-48 relative rounded-2xl overflow-hidden flex-row items-center mr-2",
                extraClass
            )}
        >
            <Image
                source={cover}
                contentFit="cover"
                transition={1000}
                placeholder={{ imageBlurHash }}
                style={{ width: "100%", height: "100%" }}
            />

            <View className='absolute top-0 left-0 right-0 bottom-0 bg-blackish opacity-50'></View>
            <NuText variant='bold' className='text-2xl text-white pt-1 absolute left-0 right-0 text-center leading-[1.1]'>{title}</NuText>
            <Link href={`/filters?type=${_id}`} className='absolute top-0 right-0 bottom-0 left-0' accessibilityLabel={`View ${title} Events`}></Link>
        </View>
    )
}

export default EventType;