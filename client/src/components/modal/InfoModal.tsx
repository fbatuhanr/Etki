import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import NuText from '../NuText';
import AntDesign from '@expo/vector-icons/AntDesign';

interface InfoModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    description: string;
    buttonText?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
    visible,
    onClose,
    title,
    description,
    buttonText = "Close",
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View className="w-11/12 min-h-52 bg-white rounded-2xl p-5">
                            <View className="flex-row justify-between items-center mb-3">
                                <NuText variant='bold' className="text-xl text-black">{title}</NuText>
                                <TouchableOpacity onPress={onClose}>
                                    <AntDesign name="close" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View className='mt-1'>
                                <NuText variant='semiBold' className="text-neutral-700 py-4">{description}</NuText>
                                <TouchableOpacity onPress={onClose}>
                                    <NuText variant="bold" className="text-2xl text-gray-500">
                                        {buttonText}
                                    </NuText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default InfoModal;
