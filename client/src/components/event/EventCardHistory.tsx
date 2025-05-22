import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { DateBackground, LineIcon } from '@/src/components/Vectors';
import NuText from '@/src/components/NuText';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { clipText } from '@/src/utils/textUtils';
import { EventCardHistory as IEventCardHistory } from '@/src/types/event';
import { formatDate } from '@/src/utils/dateUtils';
import { imageBlurHash } from '@/src/constants/images';
import { cn } from '@/src/lib/utils';

const EventCardHistory: React.FC<IEventCardHistory> = ({ _id, title, cover, date }) => {
    const isDatePassed = new Date(date ?? "").getTime() < Date.now();
    const dateParts = formatDate(new Date(date ?? "")).split(" ");
    const targetLink = `/details/${_id}` as const;
    return (
        <View className={cn(
            'w-[180px] h-[180px] mr-3 relative rounded-[15px] overflow-hidden shadow-[-1px_4px_4px] shadow-greyish',
            isDatePassed ? 'opacity-50' : 'opacity-100',
        )}>
            <Image
                source={cover}
                contentFit="cover"
                transition={250}
                placeholder={{ blurhash: imageBlurHash }}
                style={{ width: "100%", height: "100%" }}
            />
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
