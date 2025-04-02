import React from 'react';
import { View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import EventCard from '../../components/EventCard';
import NuText from '../../components/NuText';
import NuLink from '../../components/NuLink';
import EventType from '../../components/EventType';
import { sampleEvents, sampleEventTypes } from '../../data/sample';

const Attend = () => {

  return (
    <View>
      <View className='mt-8'>
        <View className='mb-2 mr-6 flex-row justify-between'>
          <NuText variant='extraBold' className='text-4xl'>Event Types</NuText>
          <NuLink href='/(tabs)/attend/EventTypes' variant='regular' className='text-2xl text-grayish'>All</NuLink>
        </View>
        <FlatList
          data={sampleEventTypes}
          renderItem={({ item }) => <EventType {...item} />}
          keyExtractor={(item) => item.id}
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
          data={sampleEvents}
          renderItem={({ item }) => <EventCard {...item} />}
          keyExtractor={(item) => item.id}
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
          data={sampleEvents}
          renderItem={({ item }) => <EventCard {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className='pt-1 pl-2 -ml-2 pb-3 pr-4'
        />
      </View>
    </View>
  );
}
export default Attend;