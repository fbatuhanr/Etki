import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon, SearchIcon } from '@/src/components/Vectors';
import COLORS from '@/src/constants/colors';
import NuText from '@/src/components/NuText';
import PickerModal from '@/src/components/PickerModal';
import CalendarModal from '@/src/components/CalendarModal';
import EventCardWide from '@/src/components/EventCardWide';
import { LinearGradient } from 'expo-linear-gradient';
import { clipText } from '@/src/utils/textUtils';
import { useGet } from '@/src/hooks/common/useGet';
import { Event } from '@/src/types/event';
import { EventType } from '@/src/types/event-type';
import useAxios from '@/src/hooks/common/useAxios';
import { useDebouncedValue } from '@/src/hooks/common/useDebouncedValue';

type FilterOptions = {
    sortBy: { [key: string]: string };
    type: { [key: string]: string };
};

const FiltersLayout = () => {
    const axiosInstance = useAxios();
    const { query, sortBy, type, dateLabel, startDate, endDate } = useLocalSearchParams();
    const { data: eventTypes, loading: eventTypesLoading } = useGet<EventType[]>('/event/types');
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    const safeQuery = Array.isArray(query) ? query[0] : query ?? '';
    const [queryString, setQueryString] = useState<string>(safeQuery);
    const debouncedQuery = useDebouncedValue(queryString, 500);
    

    const filterOptions: FilterOptions = {
        sortBy: {
            featured: 'Featured',
            newest: 'Newest',
            mostPopular: 'Most Popular',
        },
        type:
            eventTypes?.reduce((acc, eventType) => {
                acc[eventType._id] = eventType.title;
                return acc;
            }, {} as { [key: string]: string }) ?? {},
    };

    const [filters, setFilters] = useState(() => [
        {
            id: 'date',
            label: (dateLabel as string) || '',
            defaultLabel: 'Date',
            value: {
                label: (dateLabel as string) || '',
                start: (startDate as string) || '',
                end: (endDate as string) || '',
            },
            isModalVisible: false,
        },
        {
            id: 'sortBy',
            label: filterOptions.sortBy[sortBy as string] || '',
            defaultLabel: 'Sort By',
            value: (sortBy as string) || '',
            isModalVisible: false,
        },
        {
            id: 'type',
            label: '',
            defaultLabel: 'Type',
            value: (type as string) || '',
            isModalVisible: false,
        },
    ]);

    useEffect(() => {
        if (!eventTypes || eventTypes.length === 0) return;

        setFilters((prev) => prev.map((f) => f.id === 'type' && f.value ? { ...f, label: filterOptions.type[f.value as string] ?? '' } : f));
    }, [eventTypes]);

    useEffect(() => {
        if (!eventTypes || eventTypes.length === 0) return;

        const fetchFilteredEvents = async () => {
            try {
                const { data } = await axiosInstance.get("/event/filter", {
                    params: {
                        filters: encodeURIComponent(JSON.stringify(filters)),
                        query: debouncedQuery,
                    },
                });
                setFilteredEvents(data);
            } catch (error) {
                console.error("Filter error", error);
            }
        };

        fetchFilteredEvents();
    }, [filters, debouncedQuery, eventTypes]);

    const handleFilterApply = (id: string, value: any) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id
                    ? {
                        ...filter,
                        label:
                            id === 'date'
                                ? value.label
                                : filterOptions?.[id as keyof FilterOptions]?.[value] ?? '',
                        value,
                        isModalVisible: false,
                    }
                    : filter
            )
        );
        reorderFilters();
    };

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
                    ? { ...filter, isModalVisible: isVisible }
                    : filter
            )
        );
    };

    return (
        <View className="flex-1 bg-whitish">
            <StatusBar style="dark" />
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    header: ({ navigation }) => (
                        <LinearGradient
                            colors={[
                                'rgba(255, 255, 255, 1)',
                                'rgba(255, 255, 255, 0.5)',
                                'rgba(255, 255, 255, 0)',
                            ]}
                            style={{ flex: 1 }}
                            start={{ x: 0, y: 0.1 }}
                            end={{ x: 0, y: 1 }}
                        >
                            <SafeAreaView className="gap-y-2">
                                <View className="flex-row ps-6 gap-x-4">
                                    <TouchableOpacity
                                        onPress={() => navigation.goBack()}
                                        className="flex-row items-center gap-x-4"
                                    >
                                        <BackIcon width={24} height={24} strokeColor={COLORS.primary} />
                                    </TouchableOpacity>
                                    <ScrollView
                                        className="h-10"
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {filters.map((filter) => (
                                            <TouchableOpacity
                                                key={filter.id}
                                                className={`flex-row items-center gap-x-2 rounded-lg px-4 h-full mr-1 ${!!filter.label ? 'bg-primaryActive' : 'bg-primary'
                                                    }`}
                                                onPress={() => handleModal(filter.id, true)}
                                            >
                                                <NuText variant="bold" className="text-white text-xl">
                                                    {filter.label || filter.defaultLabel}
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
                                {query && (
                                    <View className="bg-primary flex-row justify-center items-center">
                                        <View className="w-3/5 flex-row justify-between items-center">
                                            <View>
                                                <SearchIcon width={22} height={22} />
                                            </View>
                                            <TextInput
                                                className="w-3/5 text-center text-xl leading-tight"
                                                value={queryString}
                                                autoCapitalize='none'
                                                onChangeText={(text: string) => setQueryString(text)}
                                                placeholderTextColor={COLORS.white}
                                                style={{ color: COLORS.white }}
                                            />
                                            <TouchableOpacity onPress={() => setQueryString('')}>
                                                <NuText variant="bold" className="text-2xl text-white px-2 pt-1 pb-1.5">x</NuText>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </SafeAreaView>
                        </LinearGradient>
                    ),
                }}
            />
            <View className='min-h-screen'>
                {filteredEvents.length ? (
                    <FlatList
                        data={filteredEvents}
                        renderItem={({ item }) => <EventCardWide {...item} />}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        className="p-4"
                        ListHeaderComponent={
                            <SafeAreaView className={query ? 'mt-12' : ''} />
                        }
                    />
                ) : (
                    <View className="h-full w-full items-center justify-center">
                        <NuText variant="semiBold" className="text-2xl">
                            No Results Found
                        </NuText>
                    </View>
                )}
            </View>
            {filters.map((filter) =>
                filter.id === 'date' ? (
                    <CalendarModal
                        key={`modal-${filter.id}`}
                        visible={
                            filters.find((i) => i.id === filter.id)?.isModalVisible || false
                        }
                        selectedValue={
                            filters.find((i) => i.id === filter.id)?.value || ''
                        }
                        onDateSelect={(value) => handleFilterApply(filter.id, value)}
                        onClose={() => handleModal(filter.id, false)}
                    />
                ) : (
                    <PickerModal
                        key={`modal-${filter.id}`}
                        title={filter.defaultLabel as string}
                        options={filterOptions[filter.id as keyof FilterOptions] || {}}
                        visible={
                            filters.find((i) => i.id === filter.id)?.isModalVisible || false
                        }
                        selectedValue={
                            (filters.find((i) => i.id === filter.id)?.value as string) || ''
                        }
                        defaultValue={
                            typeof filterOptions?.[filter.id as keyof FilterOptions] ===
                                'object' &&
                                filterOptions[filter.id as keyof FilterOptions] !== null
                                ? Object.keys(
                                    filterOptions[filter.id as keyof FilterOptions]!
                                )[0] || ''
                                : ''
                        }
                        onValueChange={(value) => handleFilterApply(filter.id, value)}
                        onClose={() => handleModal(filter.id, false)}
                    />
                )
            )}
        </View>
    );
};

export default FiltersLayout;
