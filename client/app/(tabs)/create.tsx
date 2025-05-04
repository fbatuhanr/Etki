import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
import { cn } from '@/src/lib/utils';
import { useGet } from '@/src/hooks/common/useGet';

type FormData = {
  title: string;
  description: string;
  type: string;
  quota: string;
  location: string;
  date: Date;
  isLimitedTime: boolean;
  isOnline: boolean;
  isPrivate: boolean;
  isFree: boolean;
  entranceFee: string;
  cover: ImagePicker.ImagePickerAsset | null;
};
const Create = () => {

  const decodedToken = useDecodedToken();
  const axiosInstance = useAxios();

  const [onProgress, setOnProgress] = useState(false);

  const { data: eventTypes, loading, error } = useGet<any[]>("/event/types");
  console.log('eventTypes:', eventTypes);

  const { control, watch, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      type: '',
      quota: '',
      location: '',
      date: new Date(),
      isLimitedTime: false,
      isOnline: false,
      isPrivate: false,
      isFree: true,
      entranceFee: '',
      cover: null
    }
  });
  const isFree = watch('isFree');
  const cover = watch('cover');

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
      console.error('Cover selection error: ', err);
      Toast.error('Cover selection error!');
    }
  };
  const uploadToFirebase = async (image: any) => {
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const filename = image.fileName || `cover_${Date.now()}`;
      const imageRef = ref(storage, `event-cover/${filename}`);

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
      let coverUrl: string | undefined = undefined;

      if (data.cover && typeof data.cover !== "string") {
        coverUrl = await uploadToFirebase(data.cover);
      }

      const { cover, ...restData } = data;

      const payload = {
        ...restData,
        cover: coverUrl ?? ''
      };

      const response = await axiosInstance.post('event', payload);
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
        <View className='gap-y-5'>
          <View>
            <View className='flex-row justify-between items-center px-2 mb-1'>
              <NuText variant='bold' className='text-2xl'>Title</NuText>
              {errors.title && <NuText variant='medium' className='text-lg ml-2 text-red-500'>Required*</NuText>}
            </View>
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
                  className={cn(
                    'h-[50px] bg-primary text-white text-xl rounded-xl px-4 pt-2 leading-none',
                    value ? 'font-semibold not-italic' : 'italic'
                  )}
                  placeholder="Amazing Event"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View>
            <View className='flex-row justify-between items-center px-2 mb-1'>
              <NuText variant='bold' className='text-2xl'>Description</NuText>
              {errors.description && <NuText variant='medium' className='text-lg ml-2 text-red-500'>Required*</NuText>}
            </View>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  cursorColor={COLORS.white}
                  selectionColor={COLORS.white}
                  placeholderTextColor={COLORS.whietish}
                  className={cn(
                    'h-28 bg-primary text-white text-xl rounded-xl px-4 pt-4 leading-none',
                    value ? 'font-semibold not-italic' : 'italic'
                  )}
                  multiline={true}
                  numberOfLines={10}
                  placeholder="Let's go together..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View>
            <View className='flex-row justify-between items-center px-2 mb-1'>
              <NuText variant='bold' className='text-2xl'>Type</NuText>
              {errors.type && <NuText variant='medium' className='text-lg ml-2 text-red-500'>Required*</NuText>}
            </View>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, type: true })}>
                    <View className='h-[50px] bg-secondary text-white rounded-xl px-4 flex-row justify-between items-center'>
                      <NuText variant='semiBold' className='text-xl text-white'>
                        {
                          eventTypes?.find(i => i._id === value)?.title || 'Select an event type'
                        }
                      </NuText>
                      <View className='rotate-[270deg] scale-[0.85]'>
                        <BackIcon width={24} height={24} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <PickerModal
                    title='Type'
                    visible={isModalVisible.type}
                    onClose={() => setIsModalVisible({ ...isModalVisible, type: false })}
                    options={eventTypes && Object.fromEntries(eventTypes.map(item => [item._id, item.title]))}
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
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, quota: true })}>
                    <View className='h-[50px] bg-secondary text-white rounded-xl px-4 flex-row justify-between items-center'>
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
            <View className='flex-row justify-between items-center px-2 mb-1'>
              <NuText variant='bold' className='text-2xl'>Location</NuText>
              {errors.type && <NuText variant='medium' className='text-lg ml-2 text-red-500'>Required*</NuText>}
            </View>
            <Controller
              name="location"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  cursorColor={COLORS.white}
                  selectionColor={COLORS.white}
                  placeholderTextColor={COLORS.whietish}
                  className={cn(
                    'h-[50px] bg-primary text-white text-xl rounded-xl px-4 pt-2 leading-none',
                    value ? 'font-semibold not-italic' : 'italic'
                  )}
                  placeholder="Maltepe University / Zoom"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View>
            <View className='flex-row justify-between items-center px-2 mb-1'>
              <NuText variant='bold' className='text-2xl'>Date</NuText>
              {errors.date && <NuText variant='medium' className='text-lg ml-2 text-red-500'>Required*</NuText>}
            </View>
            <Controller
              name="date"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, date: true })}>
                    <View className='h-[50px] bg-primary text-white rounded-xl px-4 flex-row justify-between items-center'>
                      <NuText variant='semiBold' className='text-xl text-white tracking-wider'>{value.toLocaleDateString()}</NuText>
                      <CalendarIcon width={24} height={24} />
                    </View>
                  </TouchableOpacity>
                  {
                    <DatePickerModal
                      title="Select Date"
                      date={value}
                      onChange={(event: any, selectedDate?: Date) => {
                        if (selectedDate) onChange(selectedDate);
                      }}
                      visible={isModalVisible.date}
                      onClose={() => setIsModalVisible({ ...isModalVisible, date: false })}
                    />
                  }
                </View>
              )}
            />
          </View>
          <View>
            <Controller
              name="isLimitedTime"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TouchableOpacity
                  className='mt-4 flex-row items-center gap-x-4'
                  onPress={() => onChange(!value)}
                >
                  <View className='size-10 rounded-2xl bg-secondary items-center justify-center'>
                    {value && <FontAwesome name="check" size={24} color={COLORS.white} />}
                  </View>
                  <NuText variant='semiBold' className='text-2xl'>The event is limited time!</NuText>
                </TouchableOpacity>
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
                  className='mt-4 flex-row items-center gap-x-4'
                  onPress={() => onChange(!value)}
                >
                  <View className='size-10 rounded-2xl bg-secondary items-center justify-center'>
                    {value && <FontAwesome name="check" size={24} color={COLORS.white} />}
                  </View>
                  <NuText variant='semiBold' className='text-2xl'>The event is only for friends.</NuText>
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
                  className='mt-4 flex-row items-center gap-x-4'
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
            <View className='bg-secondary p-4 rounded-xl'>
              <View className='flex-row justify-between items-center px-2 mb-1'>
                <NuText variant='bold' className='text-2xl'>Entrance Fee</NuText>
                {errors.entranceFee && <NuText variant='medium' className='text-lg ml-2 text-red-500'>Required*</NuText>}
              </View>
              <Controller
                name="entranceFee"
                rules={{ required: !isFree }}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={COLORS.black}
                    selectionColor={COLORS.black}
                    placeholderTextColor={COLORS.grayish}
                    className='h-[50px] bg-white text-black text-lg rounded-xl px-4 pt-2 leading-none'
                    placeholder="Type here (exp: $10)..."
                    onBlur={onBlur}
                    defaultValue={value}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
          }
          <View className='mt-4'>
            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Cover</NuText>
            {
              cover ?
                <View className='w-full h-28 rounded-2xl overflow-hidden relative'>
                  <View className='h-full w-auto'>
                    <ActivityIndicator size="large" color="#888" className="absolute inset-0" />
                    <Image source={typeof cover === 'string' ? { uri: cover } : cover} className='w-full h-full object-contain' />
                  </View>
                  {
                    <TouchableOpacity
                      onPress={() => setValue('cover', null)}
                      className='absolute inset-0 items-center justify-center bg-primary/50'
                    >
                      <NuText variant='bold' className='text-xl text-white'>tap here to remove</NuText>
                    </TouchableOpacity>
                  }
                </View>
                :
                <Controller
                  name="cover"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <View className='bg-primary h-28 rounded-xl'>
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
            }
          </View>
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={onProgress} className='mb-16 h-28 bg-tertiary disabled:bg-tertiary/50 rounded-xl items-center justify-center'>
            <NuText variant='bold' className='text-white text-3xl'>{!onProgress ? 'CREATE EVENT' : 'CREATING...'}</NuText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    //  
  );
}
export default Create;