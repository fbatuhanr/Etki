import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import NuText from '@/app/components/NuText'
import NuLink from '@/app/components/NuLink'
import { sampleEventTypes } from '@/app/data/sample'
import EventType from '@/app/components/EventType'

const EventTypes = () => {
  return (
    <View className='mt-8 mr-5'>
      <View className='mb-2 mr-1 flex-row justify-between'>
        <NuText variant='extraBold' className='text-4xl'>All Event Types</NuText>
        <NuLink href='/(tabs)/attend' variant='regular' className='text-2xl text-grayish'>Back</NuLink>
      </View>
      <View className='gap-y-2.5'>
        {
          sampleEventTypes.map(eventType =>
            <EventType key={eventType.id} {...eventType} extraClass='mr-0 w-full h-32' />
          )
        }
      </View>
    </View>
  )
}

export default EventTypes