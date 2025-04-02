import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Link, router, Slot } from 'expo-router';

import NuText from '../../components/NuText';
import { LogoMultipleRing, SearchIcon, CalendarIcon, BackIcon } from '../../components/Vectors';

// import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';
import { sampleEvents, sampleEventTypes } from '../../data/sample';
import CalendarModal from '../../components/CalendarModal';

const AttendLayout = () => {

    const [search, setSearch] = useState({ isEnabled: false, isFocused: false, query: '' });
    const searchInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (search.isEnabled) {
            searchInputRef.current?.focus();
        }
    }, [search.isEnabled]);


    const [calendar, setCalendar] = useState({ isModalVisible: false, value: '' });
    useEffect(() => {
        if (!calendar.value) return;

        // alert(`value changed: ${calendar.value}`);
    }, [calendar.value])

    return (
        <SafeAreaView edges={['top']}>
            <ScrollView contentContainerClassName='ml-5' showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View className='mr-5'>
                    <Link href='/(tabs)/attend' className='my-2.5'>
                        <View className='flex-row items-center'>
                            <LogoMultipleRing width={38} height={38} />
                            <NuText variant='bold' className='flex-1 text-3xl tracking-[4] ml-2.5 mt-1.5'>ETKI</NuText>
                            <NuText variant='mediumItalic' className='text-base'>Unite Through Events</NuText>
                        </View>
                    </Link>
                    <View className='h-11 flex-row gap-x-0.5'>
                        <TouchableOpacity
                            onPress={() => setSearch((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
                            className='flex-1 flex-row items-center gap-x-2 bg-primary px-4 rounded-tl-[10px] rounded-bl-[10px]'
                        >
                            <View><SearchIcon width={22} height={22} /></View>
                            <TextInput
                                ref={searchInputRef}
                                className='flex-1 text-base font-nunitoBold text-white'
                                placeholder={search.isFocused ? 'Search...' : 'Search'}
                                placeholderTextColor={search.isFocused ? COLORS.greyish : COLORS.white}
                                value={search.query}
                                onChangeText={(text) => setSearch((prev) => ({ ...prev, query: text }))}
                                onFocus={() => setSearch((prev) => ({ ...prev, isFocused: true }))}
                                onBlur={() => setSearch((prev) => ({ ...prev, isEnabled: false, isFocused: false }))}
                                onSubmitEditing={() => router.push(`/filters?query=${search.query}`)}
                            />
                            {
                                search.query &&
                                <TouchableOpacity onPress={() => router.push(`/filters?query=${search.query}`)}>
                                    <View className='rotate-[180deg] scale-[0.85]'>
                                        <BackIcon width={24} height={24} />
                                    </View>
                                </TouchableOpacity>
                            }
                        </TouchableOpacity>
                        <View className='flex-1 relative z-10'>
                            <TouchableOpacity onPress={() => setCalendar((prev) => ({ ...prev, isModalVisible: true }))} className='flex-1 flex-row items-center gap-x-2 bg-primary px-4 rounded-tr-[10px] rounded-br-[10px]'>
                                <CalendarIcon width={22} height={22} />
                                <NuText variant='bold' className='text-white text-base'>Date</NuText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Slot />
            </ScrollView>
            <CalendarModal
                visible={calendar.isModalVisible}
                onClose={() => setCalendar((prev) => ({ ...prev, isModalVisible: false }))}
                navigateOnSelect
            />
        </SafeAreaView>
    );
}
export default AttendLayout;