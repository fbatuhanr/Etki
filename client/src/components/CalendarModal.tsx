import React, { useEffect, useState } from 'react'
import { SafeAreaView, TouchableOpacity, Modal, View, TouchableWithoutFeedback, Platform, StyleSheet } from 'react-native'
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import NuText from './NuText';
import { BackIcon, CalendarIcon, UpArrowIcon } from './Vectors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { dateFormatter, getDateRange, getDayName, isDateLabelCustom, isToday, isTomorrow } from '../utils/dateUtils';
import COLORS from '../constants/colors';

type CalendarModalProps = {
    visible: boolean;
    selectedValue?: any;
    onDateSelect?: (value: any) => void;
    onClose: () => void;
    navigateOnSelect?: boolean;
}
export enum SelectionType {
    Today = 'Today',
    Tomorrow = 'Tomorrow',
    ThisWeek = 'This Week',
    NextWeek = 'Next Week',
    Custom = 'Custom Date',
}

const CalendarModal: React.FC<CalendarModalProps> = ({
    visible,
    selectedValue,
    onDateSelect,
    onClose,
    navigateOnSelect = false
}) => {
    const [pickerDate, setPickerDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const pickerDateHeight = useSharedValue(0);
    const animatedPickerCalendarStyle = useAnimatedStyle(() => ({
        height: pickerDateHeight.value,
        overflow: 'hidden',
    }));

    const handleCustom = () => {
        if (showPicker) {
            handleSelection(SelectionType.Custom);
        } else {
            setShowPicker(true);
            pickerDateHeight.value = withTiming(300, { duration: 500 });
        }
    };

    const handlePickerOnChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) setPickerDate(selectedDate);
    };

    const handleModalClose = () => {
        setShowPicker(false);
        onClose();
    }

    const handleSelection = (type: SelectionType) => {
        const dateResult = type === SelectionType.Custom ? getDateRange(SelectionType.Custom, pickerDate) : getDateRange(type);
        const formattedDateResult = {
            label: dateResult.label,
            start: dateFormatter(dateResult.start),
            end: dateFormatter(dateResult.end),
        };

        if (navigateOnSelect) {
            router.push(
                `/filters?dateLabel=${formattedDateResult.label}&startDate=${formattedDateResult.start}&endDate=${formattedDateResult.end}`
            );
        }
        onDateSelect?.(formattedDateResult);
        handleModalClose();
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={handleModalClose}
        >
            <TouchableWithoutFeedback onPress={handleModalClose}>
                <SafeAreaView className="flex-1 bg-black/50">
                    <TouchableWithoutFeedback>
                        <View className="h-auto bg-white mx-5 mt-6 p-5 gap-y-2 rounded-lg">
                            <View className='flex-row flex-wrap justify-between gap-y-2'>
                                {
                                    Object.values(SelectionType)
                                        .filter((value) => value !== SelectionType.Custom)
                                        .map((selection: SelectionType) =>
                                            <TouchableOpacity
                                                key={selection}
                                                onPress={() => handleSelection(selection)}
                                                className={`w-[49%] px-4 py-2 rounded ${selectedValue?.label === selection ? 'bg-primaryActive' : 'bg-primary'}`}
                                            >
                                                <NuText variant='bold' className='text-lg text-white'>{selection}</NuText>
                                            </TouchableOpacity>
                                        )
                                }
                            </View>
                            <TouchableOpacity
                                onPress={handleCustom}
                                className={`rounded px-4 py-2 flex-row items-center gap-x-2 ${isDateLabelCustom(selectedValue?.label) ? 'bg-secondaryActive' : 'bg-secondary'}`}
                            >
                                <View><CalendarIcon width={22} height={22} /></View>
                                <View className='flex-1 flex-row justify-between items-center'>
                                    <NuText variant='bold' className='text-lg text-white'>
                                        {
                                            showPicker ?
                                                `Check the ${pickerDate.toLocaleDateString()}` :
                                                isDateLabelCustom(selectedValue?.label) ? 'Chose from Calendar' : 'Choose from Calendar'
                                        }
                                    </NuText>
                                    <View className={`${showPicker ? 'rotate-[180deg]' : 'rotate-[-90deg]'} scale-[0.85]`}>
                                        <BackIcon width={24} height={24} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {showPicker &&
                                <Animated.View style={animatedPickerCalendarStyle}>
                                    <DateTimePicker
                                        style={{ flex: 1 }}
                                        minimumDate={new Date()}
                                        value={pickerDate}
                                        mode='date'
                                        display='inline'
                                        onChange={handlePickerOnChange}
                                    />
                                </Animated.View>
                            }
                            {
                                selectedValue?.label &&
                                <TouchableOpacity
                                    className="bg-quaternary p-2 rounded-lg items-center mt-3 mx-auto w-24"
                                    onPress={() => onDateSelect?.({ label: '', start: '', end: '' })}
                                >
                                    <NuText variant='bold' className="text-white text-lg">Clear</NuText>
                                </TouchableOpacity>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default CalendarModal