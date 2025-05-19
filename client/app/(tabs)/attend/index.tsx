import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import EventCard from '@/src/components/EventCard';
import NuText from '@/src/components/NuText';
import NuLink from '@/src/components/NuLink';
import EventType from '@/src/components/EventType';
import { useEvent } from '@/src/hooks/event/useEvent';
import { useEventTypes } from '@/src/hooks/event/useEventTypes';
import { Event } from '@/src/types/event';
import { set } from 'react-hook-form';
import { Toast } from 'toastify-react-native';
import { errorMessages } from '@/src/constants/messages';

const Attend = () => {

  const { getAllEvents } = useEvent();
  const { eventTypes, getEventTypes } = useEventTypes();
  const [events, setEvents] = useState<Event[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const featuredEvents = [...events].filter((e) => new Date(e.date).getTime() > Date.now()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const newestEvents = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const mostPopularEvents = [...events].sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0));

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [events] = await Promise.all([getAllEvents(), getEventTypes()]);
      setEvents(events);
      opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
    } catch (err: unknown) {
      setIsError(true);
      const errorMessage = err instanceof Error ? err.message : errorMessages.default;
      Toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      translateY.value = 40;
      fetchData();
    }, [])
  );

  if (isLoading)
    return (
      <View className='h-[512px] mr-6 items-center justify-center'>
        <NuText variant='regular' className='text-2xl text-neutral-500'>Loading...</NuText>
      </View>
    );

  if (isError)
    return (
      <View className='h-[512px] mr-6 items-center justify-center'>
        <NuText variant='regular' className='text-2xl text-grayish'>Something went wrong!</NuText>
      </View>
    );

  return (
    <Animated.View style={animatedStyle}>
      <View className='mt-8'>
        <View className='mb-2 mr-6 flex-row justify-between'>
          <NuText variant='extraBold' className='text-4xl'>Event Types</NuText>
          <NuLink href='/(tabs)/attend/event-types' variant='regular' className='text-2xl text-grayish'>All</NuLink>
        </View>
        <FlatList
          data={eventTypes}
          renderItem={({ item }) => <EventType {...item} />}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View className='mt-8'>
        <View className='mb-2 mr-6 flex-row justify-between'>
          <NuText variant='extraBold' className='text-4xl'>Featured Events</NuText>
          <NuLink href='/filters?sortBy=featured' variant='regular' className='text-2xl text-grayish'>All</NuLink>
        </View>
        <FlatList
          data={featuredEvents}
          renderItem={({ item }) => <EventCard {...item} />}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className='pt-1 pl-2 -ml-2 pb-3'
        />
      </View>
      <View className='mt-8'>
        <View className='mb-2 mr-6 flex-row justify-between'>
          <NuText variant='extraBold' className='text-4xl'>Newest Events</NuText>
          <NuLink href='/filters?sortBy=newest' variant='regular' className='text-2xl text-grayish'>All</NuLink>
        </View>
        <FlatList
          data={newestEvents}
          renderItem={({ item }) => <EventCard {...item} />}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className='pt-1 pl-2 -ml-2 pb-3 pr-4'
        />
      </View>
      <View className='mt-8 mb-16'>
        <View className='mb-2 mr-6 flex-row justify-between'>
          <NuText variant='extraBold' className='text-4xl'>Popular Events</NuText>
          <NuLink href='/filters?sortBy=mostPopular' variant='regular' className='text-2xl text-grayish'>All</NuLink>
        </View>
        <FlatList
          data={mostPopularEvents}
          renderItem={({ item }) => <EventCard {...item} />}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className='pt-1 pl-2 -ml-2 pb-3 pr-4'
        />
      </View>
    </Animated.View>
  );
};

export default Attend;
