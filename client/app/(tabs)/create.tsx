import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import NuText from '../components/NuText';
import { CreateIcon } from '../components/Vectors';
import PickerModal from '../components/PickerModal';
import COLORS from '../constants/colors';
import { sampleEventTypes } from '../data/sample';
import { useState } from 'react';

type FormData = {
  title: string;
  description: string;
  type: string;
  quota: string;
  location: string;
  date: string;
  isOnline: boolean;
  isVip: boolean;
  entranceFee: string;
  expDate: string;
  cover: string;
  isConditionsAgreed: boolean;
};
const Create = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      type: '',
      quota: '',
      location: '',
      date: '',
      isOnline: false,
      isVip: false,
      entranceFee: '',
      expDate: '',
      cover: '',
      isConditionsAgreed: false
    }
  });
  const onSubmit = (data: FormData) => console.log(data);

  const [isVisible, setIsVisible] = useState(false);

  return (
    <SafeAreaView edges={['top']} className='flex-1'>
      <ScrollView className='mx-5'>
        <View className='flex-row gap-x-2 mt-8 mb-8'>
          <NuText variant='extraBold' className='text-4xl'>Create an Event</NuText>
          <View><CreateIcon width={26} height={26} strokeColor='#000000' viewBox='0 0 22 22' /></View>
        </View>
        <View className='gap-y-4'>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Title</NuText>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  cursorColor={COLORS.white}
                  selectionColor={COLORS.white}
                  placeholderTextColor={COLORS.whietish}
                  className='bg-primary text-white rounded-xl px-4 pt-2.5 pb-3.5 text-xl'
                  placeholder="type here..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="title"
            />
            {errors.title && <Text>This is required.</Text>}
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Description</NuText>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  cursorColor={COLORS.white}
                  selectionColor={COLORS.white}
                  placeholderTextColor={COLORS.whietish}
                  className='bg-primary text-white rounded-xl px-4 pb-1.5 min-h-24 text-xl'
                  multiline={true}
                  numberOfLines={10}
                  placeholder="type here..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="description"
            />
            {errors.description && <Text>This is required.</Text>}
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Type</NuText>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsVisible(true)}>
                    <View className='bg-secondary text-white rounded-xl px-4 pb-1.5 h-12 text-xl'>
                      <NuText>{sampleEventTypes.find(i => i.id === value)?.title}</NuText>
                    </View>
                  </TouchableOpacity>
                  <PickerModal
                    visible={isVisible}
                    onClose={() => setIsVisible(false)}
                    options={sampleEventTypes.reduce((acc, item) => { acc[item.id] = item.title; return acc; }, {} as { [key: string]: string })}
                    defaultValue={value}
                    selectedValue={value}
                    onValueChange={(value) => {
                      onChange(value);
                      setIsVisible(false);
                    }}
                    title='Type' />
                </View>
              )}
              name="type"
            />
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Quota</NuText>
            <TextInput className='bg-secondary text-white rounded-xl px-4 pb-1.5 h-12 text-xl' />
          </View>

          <TouchableOpacity onPress={handleSubmit(onSubmit)} className='h-24 bg-tertiary rounded-xl items-center justify-center'>
            <NuText variant='bold' className='text-white text-3xl'>CREATE EVENT</NuText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default Create;