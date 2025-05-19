import React, { useEffect } from 'react';
import { View } from 'react-native';
import NuText from '@/src/components/NuText';
import NuLink from '@/src/components/NuLink';
import EventType from '@/src/components/EventType';
import { useGet } from '@/src/hooks/common/useGet';
import { EventType as IEventType } from '@/src/types/event-type';
import { useEventTypes } from '@/src/hooks/event/useEventTypes';

const EventTypes = () => {

  const { eventTypes, getEventTypes, loading: eventTypesLoading, error: eventTypesError } = useEventTypes();

  useEffect(() => {
    const fetchEventTypes = async () => {
      await getEventTypes();
    }
    fetchEventTypes();
  }, []);

  if (eventTypesLoading)
    return (
      <View className='h-[512px] mr-6 items-center justify-center'>
        <NuText variant='regular' className='text-2xl text-neutral-500'>Loading...</NuText>
      </View>
    );

  if (eventTypesError)
    return (
      <View className='h-[512px] mr-6 items-center justify-center'>
        <NuText variant='regular' className='text-2xl text-grayish'>Something went wrong!</NuText>
      </View>
    );
  return (
    <View className='mt-8 mr-5 mb-16'>
      <View className='mb-2 mr-1 flex-row justify-between'>
        <NuText variant='extraBold' className='text-4xl'>All Event Types</NuText>
        <NuLink href='/(tabs)/attend' variant='regular' className='text-2xl text-grayish'>Back</NuLink>
      </View>
      <View className='gap-y-2.5'>
        {
          eventTypes?.map(eventType =>
            <EventType key={eventType._id} {...eventType} extraClass='mr-0 w-full h-32' />
          )
        }
      </View>
    </View>
  )
}

export default EventTypes