import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon, SearchIcon } from '@/src/components/Vectors';
import COLORS from '@/src/constants/colors';
import NuText from '@/src/components/NuText';
import PickerModal from '@/src/components/modal/PickerModal';
import CalendarModal from '@/src/components/modal/CalendarModal';
import EventCardWide from '@/src/components/event/EventCardWide';
import { LinearGradient } from 'expo-linear-gradient';
import { Event } from '@/src/types/event';
import useAxios from '@/src/hooks/common/useAxios';
import { useDebouncedValue } from '@/src/hooks/common/useDebouncedValue';
import { useEventTypes } from '@/src/hooks/event/useEventTypes';

type FilterOptions = {
    sortBy: { [key: string]: string };
    type: { [key: string]: string };
};

const FiltersLayout = () => {
    const axiosInstance = useAxios();
    const { query, sortBy, type, dateLabel, startDate, endDate } = useLocalSearchParams();
    const { eventTypes, getEventTypes } = useEventTypes();

    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const safeQuery = Array.isArray(query) ? query[0] : query ?? '';
    const [queryString, setQueryString] = useState(safeQuery);
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
        const fetchData = async () => {
            getEventTypes();
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!eventTypes || eventTypes.length === 0) return;

        setFilters((prev) => prev.map((f) => f.id === 'type' && f.value ? { ...f, label: filterOptions.type[f.value as string] ?? '' } : f));
    }, [eventTypes]);

    const filterSignature = useMemo(() => {
        return JSON.stringify(
            filters.map(f => ({ id: f.id, value: f.value }))
        );
    }, [filters]);


    useEffect(() => {
        if (!eventTypes || eventTypes.length === 0) return;

        const fetchFilteredEvents = async () => {
            try {
                setIsLoading(true);
                const { data: responseData } = await axiosInstance.get("/event/filter", {
                    params: {
                        filters: encodeURIComponent(JSON.stringify(filters)),
                        query: debouncedQuery,
                    },
                });
                setFilteredEvents(responseData.data);
            } catch (error) {
                console.error("Filter error", error);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchFilteredEvents();
    }, [filterSignature, debouncedQuery, eventTypes]);

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
                                                placeholder='Search'
                                                onChangeText={(text: string) => setQueryString(text)}
                                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                {
                    !isLoading ?
                        filteredEvents.length ? (
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
                                <NuText variant='regular' className='text-2xl text-grayish'>No Results Found</NuText>
                            </View>
                        )
                        :
                        <View className="h-full w-full items-center justify-center">
                            <ActivityIndicator size="large" />
                        </View>
                }
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
