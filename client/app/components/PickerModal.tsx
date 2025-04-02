import React from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Picker } from "@react-native-picker/picker";
import NuText from "./NuText";
import COLORS from "../constants/colors";

type PickerModalProps = {
    visible: boolean;
    onClose: () => void;
    options: { [key: string]: string };
    defaultValue: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    title: string;
};

const PickerModal: React.FC<PickerModalProps> = ({
    visible,
    onClose,
    options,
    selectedValue,
    defaultValue,
    onValueChange,
    title,
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

                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={onValueChange}
                                style={{ width: '100%' }}
                            >
                                {Object.entries(options).map(([key, label]) => (
                                    <Picker.Item key={key} label={label} value={key} color={COLORS.black} />
                                ))}
                            </Picker>
                            {
                                selectedValue ?
                                    <TouchableOpacity
                                        className="bg-quaternary p-3 rounded-lg items-center mt-5"
                                        onPress={() => onValueChange('')}
                                    >
                                        <NuText variant='bold' className="text-white text-lg">Clear</NuText>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        className="bg-primary p-3 rounded-lg items-center mt-5"
                                        onPress={() => onValueChange(selectedValue ? selectedValue : defaultValue)}
                                    >
                                        <NuText variant='bold' className="text-white font-bold text-lg">Select</NuText>
                                    </TouchableOpacity>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default PickerModal;
