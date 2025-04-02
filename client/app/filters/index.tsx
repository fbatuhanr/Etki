import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon, SearchIcon } from '../components/Vectors';
import COLORS from '../constants/colors';
import NuText from '../components/NuText';
import { sampleEvents, sampleEventTypes } from '../data/sample';
import PickerModal from '../components/PickerModal';
import CalendarModal from '../components/CalendarModal';
import EventCardWide from '../components/EventCardWide';
import { LinearGradient } from 'expo-linear-gradient';
import { clipText } from '../utils/textUtils';

type FilterOptions = {
    sortBy: {
        [key: string]: string;
    };
    type: {
        [key: string]: string;
    };
};
const filterOptions: FilterOptions = {
    sortBy: {
        'featured': 'Featured',
        'newest': 'Newest',
        'mostPopular': 'Most Popular',
    },
    type: sampleEventTypes.reduce((acc, item) => {
        acc[item.id] = item.title;
        return acc;
    }, {} as { [key: string]: string })
}
const FiltersLayout = () => {

    const { query, sortBy, type, dateLabel, startDate, endDate } = useLocalSearchParams();
    const [events, setEvents] = useState(sampleEvents);
    const [filters, setFilters] = useState([
        {
            id: 'date',
            label: dateLabel as string || '',
            defaultLabel: 'Date',
            value: {
                label: dateLabel as string || '',
                start: startDate as string || '',
                end: endDate as string || ''
            },
            isModalVisible: false
        },
        {
            id: 'sortBy',
            label: filterOptions.sortBy[sortBy as string] || '',
            defaultLabel: 'Sort By',
            value: sortBy as string || '',
            isModalVisible: false
        },
        {
            id: 'type',
            label: filterOptions.type[type as string] || '',
            defaultLabel: 'Type',
            value: type as string || '',
            isModalVisible: false
        },
    ]);
    useEffect(() => {
        if (query) {
            setEvents((prev) => prev.filter(i => i.title.includes(query as string)));
        }
        /*const date = filters.find(i => i.id === 'date');
        if(date?.value?.start && date?.value?.end) {
            setEvents((prev) => prev.filter(i => i.title.includes(query as string)));
        }*/
        /*
        if(sortBy){
        }
        */
        if (type) {
            const typeName = sampleEventTypes.find(i => i.id === type)?.title;
            setEvents((prev) => prev.filter(i => i.type === typeName));
        }

        reorderFilters();
    }, []);

    useEffect(() => {

        const typeFilter = filters.find(i => i.id === 'type');
        const typeName = sampleEventTypes.find(i => i.id === typeFilter?.value)?.title;
        if (typeFilter && typeName) {
            setEvents(sampleEvents.filter(i => i.type === typeName));
            console.log(`typeName: ${typeName}`);
        }
        else {
            setEvents(sampleEvents);
        }

    }, [filters])



    const handleFilterApply = (id: string, value: any) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id
                    ? {
                        ...filter,
                        label: id === 'date' ? value.label : filterOptions[id as keyof FilterOptions][value],
                        value,
                        isModalVisible: false
                    }
                    : filter
            )
        );
        reorderFilters();
    }

    const reorderFilters = () => {

        setFilters((prevFilters) =>
            [...prevFilters].sort((a, b) => {
                if (a.label && !b.label) return -1;
                if (!a.label && b.label) return 1;

                return a.id.localeCompare(b.id);
            })
        );
    };

    const handleModal = (id: string, isVisible: boolean) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id
                    ? {
                        ...filter,
                        isModalVisible: isVisible
                    }
                    : filter
            )
        );
    }

    return (
        <View className='flex-1 bg-whitish'>
            <StatusBar style='dark' />
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    header: ({ navigation }) => (
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)']}
                            style={{ flex: 1 }} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }}
                        >
                            <SafeAreaView className='gap-y-2'>
                                <View className='flex-row ps-6 gap-x-4'>
                                    <TouchableOpacity onPress={() => navigation.goBack()} className='flex-row items-center gap-x-4'>
                                        <BackIcon width={24} height={24} strokeColor={COLORS.primary} />
                                    </TouchableOpacity>
                                    <ScrollView className='h-10' horizontal showsHorizontalScrollIndicator={false}>
                                        {filters.map((filter) => (
                                            <TouchableOpacity
                                                key={filter.id}
                                                className={`flex-row items-center gap-x-2 rounded-lg px-4 h-full mr-1 ${!!filter.label ? 'bg-primaryActive' : 'bg-primary'}`}
                                                onPress={() => handleModal(filter.id, true)}
                                            >
                                                <NuText variant="bold" className="text-white text-xl">
                                                    {filter.label ? clipText(filter.label) : filter.defaultLabel}
                                                </NuText>
                                                <View className="rotate-[-90deg]">
                                                    <BackIcon
                                                        width={16}
                                                        height={16}
                                                        viewBox="0 0 24 24"
                                                        isFilled={!!filter.label}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                                {
                                    query &&
                                    <View className='bg-primary flex-row justify-center items-center'>
                                        <View className='w-3/5 flex-row justify-between items-center'>
                                            <View><SearchIcon width={22} height={22} /></View>
                                            <NuText variant='mediumItalic' className='text-xl text-white px-2 py-2'>{clipText(query as string, 22)}</NuText>
                                            <NuText variant='bold' className='text-xl text-white px-2 py-2'>x</NuText>
                                        </View>
                                    </View>
                                }
                            </SafeAreaView>
                        </LinearGradient>
                    )
                }}
            />
            <View>
                {
                    events.length ?
                        <FlatList
                            data={events}
                            renderItem={({ item }) => <EventCardWide {...item} />}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            className='p-4'
                            ListHeaderComponent={<SafeAreaView className={query ? 'mt-12' : ''}></SafeAreaView>}
                        /> :
                        <View className='h-full w-full items-center justify-center'>
                            <NuText variant='semiBold' className='text-2xl'>
                                No Results Found
                            </NuText>
                        </View>
                }
            </View >
            {
                filters.map((filter) => (
                    filter.id === 'date' ?
                        <CalendarModal
                            key={`modal-${filter.id}`}
                            visible={filters.find(i => i.id === filter.id)?.isModalVisible || false}
                            selectedValue={filters.find(i => i.id === filter.id)?.value || ''}
                            onDateSelect={(value) => handleFilterApply(filter.id, value)}
                            onClose={() => handleModal(filter.id, false)}
                        /> :
                        <PickerModal
                            key={`modal-${filter.id}`}
                            title={filter.defaultLabel as string}
                            options={filterOptions[filter.id as keyof FilterOptions] || {}}
                            visible={filters.find(i => i.id === filter.id)?.isModalVisible || false}
                            selectedValue={filters.find(i => i.id === filter.id)?.value as string || ''}
                            defaultValue={
                                filterOptions[filter.id as keyof FilterOptions] &&
                                    typeof filterOptions[filter.id as keyof FilterOptions] === 'object'
                                    ? Object.keys(filterOptions[filter.id as keyof FilterOptions])[0] || ''
                                    : ''
                            }
                            onValueChange={(value) => handleFilterApply(filter.id, value)}
                            onClose={() => handleModal(filter.id, false)}
                        />
                ))
            }
        </View>
    );
};

export default FiltersLayout;