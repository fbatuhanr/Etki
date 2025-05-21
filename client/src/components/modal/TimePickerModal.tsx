import React from "react";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import NuText from "@/src/components/NuText";
import DateTimePicker from '@react-native-community/datetimepicker';

type TimePickerModalProps = {
    title: string;
    time: Date;
    visible: boolean;
    onClose: () => void;
    onChange: (event: any, selectedTime?: Date) => void;
};

const TimePickerModal: React.FC<TimePickerModalProps> = ({
    title,
    time,
    visible,
    onClose,
    onChange,
}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-center bg-black/50">
                    <TouchableWithoutFeedback>
                        <View className="bg-white m-5 p-5 rounded-lg items-center">
                            <NuText variant='bold' className="text-2xl font-bold mb-4">{title}</NuText>
                            <View className="h-96">
                                <DateTimePicker
                                    mode='time'
                                    value={time}
                                    display='spinner'
                                    minuteInterval={15}
                                    style={{ flex: 1 }}
                                    onChange={onChange}
                                />
                            </View>
                            <TouchableOpacity
                                className="bg-primary p-3 rounded-lg items-center mt-5"
                                onPress={onClose}
                            >
                                <NuText variant='bold' className="text-white font-bold text-lg">Select</NuText>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default TimePickerModal;
