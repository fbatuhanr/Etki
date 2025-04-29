import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, set } from 'react-hook-form';
import NuText from '@/src/components/NuText';
import { BackIcon, CalendarIcon, CreateIcon } from '@/src/components/Vectors';
import PickerModal from '@/src/components/PickerModal';
import COLORS from '@/src/constants/colors';
import { sampleEventTypes } from '@/src/data/sample';
import { useState } from 'react';
import { UserGuard } from '@/src/guards';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePickerModal from '@/src/components/DatePickerModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getDaysAgo, getYesterday } from '@/src/utils/dateUtils';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'toastify-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/src/configs/firebase';
import { useDecodedToken } from '@/src/hooks/useDecodedToken';
import useAxios from '@/src/hooks/useAxios';
import { errorMessages, successMessages } from '@/src/constants/messages';
import { AxiosError } from 'axios';
import { ApiErrorProps } from '@/src/types/ApiError.types';

type FormData = {
  title: string;
  description: string;
  type: string;
  quota: string;
  location: string;
  date: Date;
  isOnline: boolean;
  isPrivate: boolean;
  isFree: boolean;
  entranceFee: string;
  expDate: string;
  photo: ImagePicker.ImagePickerAsset | null;
};
const Create = () => {

  const decodedToken = useDecodedToken();
  const axiosInstance = useAxios();

  const [onProgress, setOnProgress] = useState(false);

  const { control, watch, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      type: '',
      quota: '',
      location: '',
      date: new Date(),
      isOnline: false,
      isPrivate: false,
      isFree: true,
      entranceFee: '',
      expDate: '',
      photo: null
    }
  });
  const [date, isFree] = watch(['date', 'isFree']);

  const [isModalVisible, setIsModalVisible] = useState({
    type: false,
    quota: false,
    date: false,
    expDate: false,
  });

  const pickImage = async (onChange: (val: any) => void, fromCamera = false) => {
    try {
      const permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        Toast.warn(`Please give ${fromCamera ? 'camera' : 'media'} access!`);
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: 'images' })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images' });

      if (!result.canceled) {
        onChange(result.assets[0]);
      }
    } catch (err) {
      console.error('Photo selection error: ', err);
      Toast.error('Photo selection error!');
    }
  };
  const uploadToFirebase = async (image: any) => {
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const filename = image.fileName || `photo_${Date.now()}`;
      const imageRef = ref(storage, `user-photos/${filename}`);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    } catch (error) {
      console.error('Firebase upload error:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log('form data:', data);

    Toast.info("Event is creating...");
    setOnProgress(true);

    try {
      let photoUrl: string | undefined = undefined;

      if (data.photo && typeof data.photo !== "string") {
        photoUrl = await uploadToFirebase(data.photo);
      }

      const { photo, ...restData } = data;

      const payload = {
        ...restData,
        photo: photoUrl ?? ''
      };

      const response = await axiosInstance.post(`event/${decodedToken.userId}`, payload);
      Toast.success(response.data.message || successMessages.default);

    } catch (err: unknown) {
      console.error(err);
      const axiosError = err as AxiosError<ApiErrorProps>;
      Toast.error(axiosError.response?.data?.message || errorMessages.default);

    } finally {
      setOnProgress(false);
    }
  }
  return (
    // <UserGuard>
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
              name="title"
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
            />
            {errors.title && <Text>This is required.</Text>}
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Description</NuText>
            <Controller
              name="description"
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
            />
            {errors.description && <Text>This is required.</Text>}
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Type</NuText>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, type: true })}>
                    <View className='bg-secondary text-white rounded-xl px-4 h-12 flex-row justify-between items-center'>
                      <NuText variant='semiBold' className='text-xl text-white'>{sampleEventTypes.find(i => i.id === value)?.title}</NuText>
                      <View className='rotate-[270deg] scale-[0.85]'>
                        <BackIcon width={24} height={24} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <PickerModal
                    title='Type'
                    visible={isModalVisible.type}
                    onClose={() => setIsModalVisible({ ...isModalVisible, type: false })}
                    options={sampleEventTypes.reduce((acc, item) => { acc[item.id] = item.title; return acc; }, {} as { [key: string]: string })}
                    defaultValue={value}
                    selectedValue={value}
                    onValueChange={(value) => {
                      onChange(value);
                      setIsModalVisible({ ...isModalVisible, type: false })
                    }} />
                </View>
              )}
            />
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Max. Quota</NuText>
            <Controller
              name="quota"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, quota: true })}>
                    <View className='bg-secondary text-white rounded-xl px-4 h-12 flex-row justify-between items-center'>
                      <NuText variant='semiBold' className='text-xl text-white'>{value || `No Limit`}</NuText>
                      <View className='rotate-[270deg] scale-[0.85]'>
                        <BackIcon width={24} height={24} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <PickerModal
                    title='Quota'
                    visible={isModalVisible.quota}
                    onClose={() => setIsModalVisible({ ...isModalVisible, quota: false })}
                    options={Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`${i + 1}`, `${i + 1}`]))}
                    defaultValue="1"
                    selectedValue={value}
                    onValueChange={(value) => {
                      onChange(value);
                      setIsModalVisible({ ...isModalVisible, quota: false })
                    }} />
                </View>
              )}
            />
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Location</NuText>
            <Controller
              name="location"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  cursorColor={COLORS.white}
                  selectionColor={COLORS.white}
                  placeholderTextColor={COLORS.whietish}
                  className='bg-primary text-white rounded-xl px-4 pt-2.5 pb-3.5 text-xl'
                  placeholder="enter here..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Date</NuText>
            <Controller
              name="date"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, date: true })}>
                    <View className='bg-primary text-white rounded-xl px-4 h-12 flex-row justify-between items-center'>
                      <NuText variant='semiBold' className='text-xl text-white'>{value.toLocaleDateString()}</NuText>
                      <CalendarIcon width={24} height={24} />
                    </View>
                  </TouchableOpacity>
                  {
                    <DatePickerModal
                      title="Select Date"
                      date={value}
                      onChange={(event: any, selectedDate?: Date) => {
                        console.log('selected date', selectedDate);
                        if (selectedDate) onChange(selectedDate);
                      }}
                      visible={isModalVisible.date}
                      onClose={() => setIsModalVisible({ ...isModalVisible, date: false })}
                    />
                  }
                </View>
              )}
            />
            {errors.date && <Text>This is required.</Text>}
          </View>
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Offer Expiration</NuText>
            <Controller
              name="expDate"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, expDate: true })}>
                    <View className='bg-primary text-white rounded-xl px-4 h-12 flex-row justify-between items-center'>
                      <NuText variant='semiBold' className='text-xl text-white'>
                        {`${value} ${(Number(value) === 1) ? 'Day' : 'Days'} Before (${getDaysAgo(date, Number(value)).toLocaleDateString()})`}
                      </NuText>
                      <View className='rotate-[270deg] scale-[0.85]'>
                        <BackIcon width={24} height={24} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <PickerModal
                    title='How many days before the event?'
                    visible={isModalVisible.expDate}
                    onClose={() => setIsModalVisible({ ...isModalVisible, expDate: false })}
                    options={Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`${i + 1}`, `${i + 1} ${i + 1 === 1 ? 'day' : 'days'}`]))}
                    defaultValue={`${value}`}
                    selectedValue={`${value}`}
                    onValueChange={(value) => {
                      onChange(value);
                      setIsModalVisible({ ...isModalVisible, expDate: false })
                    }} />
                </View>
              )}
            />
          </View>
          <View>
            <Controller
              name="isOnline"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TouchableOpacity
                  className='mt-4 flex-row items-center gap-x-4'
                  onPress={() => onChange(!value)}
                >
                  <View className='size-10 rounded-2xl bg-secondary items-center justify-center'>
                    {value && <FontAwesome name="check" size={24} color={COLORS.white} />}
                  </View>
                  <NuText variant='semiBold' className='text-2xl'>The event will be held online.</NuText>
                </TouchableOpacity>
              )}
            />
          </View>
          <View>
            <Controller
              name="isPrivate"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TouchableOpacity
                  className='mt-2 flex-row items-center gap-x-4'
                  onPress={() => onChange(!value)}
                >
                  <View className='size-10 rounded-2xl bg-secondary items-center justify-center'>
                    {value && <FontAwesome name="check" size={24} color={COLORS.white} />}
                  </View>
                  <NuText variant='semiBold' className='text-2xl'>The event is only for followers.</NuText>
                </TouchableOpacity>
              )}
            />
          </View>
          <View>
            <Controller
              name="isFree"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TouchableOpacity
                  className='mt-2 flex-row items-center gap-x-4'
                  onPress={() => onChange(!value)}
                >
                  <View className='size-10 rounded-2xl bg-secondary items-center justify-center'>
                    {value && <FontAwesome name="check" size={24} color={COLORS.white} />}
                  </View>
                  <NuText variant='semiBold' className='text-2xl'>The event entrance is free.</NuText>
                </TouchableOpacity>
              )}
            />
          </View>
          {
            !isFree &&
            <View className='bg-blue-200 p-5 rounded-xl'>
              <NuText variant='bold' className='text-2xl ml-2 mb-1'>Entrance Fee</NuText>
              <Controller
                name="entranceFee"
                rules={{ required: !isFree }}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={COLORS.white}
                    selectionColor={COLORS.white}
                    placeholderTextColor={COLORS.whietish}
                    className='bg-primary text-white rounded-xl px-4 pt-2.5 pb-3.5 text-xl'
                    placeholder="Type here (exp: $10)..."
                    onBlur={onBlur}
                    defaultValue={value}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.entranceFee && <Text className='mt-2'>This is required.</Text>}
            </View>
          }
          <View>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Cover</NuText>
            <Controller
              name="photo"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View className='bg-primary h-24 rounded-xl'>
                  <View className='h-full flex-row justify-between items-center'>
                    <TouchableOpacity
                      className='w-1/2 h-full gap-y-1 justify-center items-center border-r border-primaryActive'
                      onPress={() => pickImage(onChange, true)}
                    >
                      <Entypo name="camera" size={24} color={COLORS.whitish} />
                      <NuText variant='semiBold' className='text-md text-whitish'>take a photo</NuText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className='w-1/2 h-full gap-y-1 justify-center items-center border-l border-primaryActive'
                      onPress={() => pickImage(onChange, false)}
                    >
                      <Entypo name="folder-images" size={24} color={COLORS.whitish} />
                      <NuText variant='semiBold' className='text-md text-whitish'>choose from gallery</NuText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            {errors.photo && <Text>This is required.</Text>}
          </View>
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={onProgress} className='mt-4 mb-16 h-24 bg-tertiary rounded-xl items-center justify-center'>
            <NuText variant='bold' className='text-white text-3xl'>CREATE EVENT</NuText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    //  
  );
}
export default Create;