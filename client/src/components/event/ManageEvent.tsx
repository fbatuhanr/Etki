import { View, TextInput, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import NuText from '@/src/components/NuText';
import { BackIcon, CalendarIcon, CreateIcon } from '@/src/components/Vectors';
import PickerModal from '@/src/components/modal/PickerModal';
import COLORS from '@/src/constants/colors';
import { useEffect, useState } from 'react';
import DatePickerModal from '@/src/components/modal/DatePickerModal';
import TimePickerModal from '@/src/components/modal/TimePickerModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'toastify-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import useAxios from '@/src/hooks/common/useAxios';
import { errorMessages, successMessages } from '@/src/constants/messages';
import { AxiosError } from 'axios';
import { ApiErrorProps } from '@/src/types/api-error';
import { cn } from '@/src/lib/utils';
import { deleteFromFirebase, uploadImageToFirebase } from '@/src/lib/firebaseOperations';
import { getRoundedMinute } from '@/src/utils/timeUtils';
import { useEvent } from '../../hooks/event/useEvent';
import { useEventTypes } from '../../hooks/event/useEventTypes';
import { useDecodedToken } from '../../hooks/common/useDecodedToken';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { imageBlurHash } from '../../constants/images';

type FormData = {
    title: string;
    description: string;
    type: string;
    quota: string;
    location: string;
    date: Date;
    time: Date;
    isLimitedTime: boolean;
    isOnline: boolean;
    isPrivate: boolean;
    isFree: boolean;
    entranceFee: string;
    cover: ImagePicker.ImagePickerAsset | string | null;
};
type ManageEventProps = {
    id?: string;
};
const ManageEvent: React.FC<ManageEventProps> = ({ id }) => {

    const decodedToken = useDecodedToken();
    const axiosInstance = useAxios();

    const [onProgress, setOnProgress] = useState(false);

    const { eventTypes, getEventTypes, loading: eventTypesLoading, error: eventTypesError } = useEventTypes();
    const { getEventById } = useEvent();

    const { control, watch, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>();
    const isFree = watch('isFree');
    const cover = watch('cover');

    const [isModalVisible, setIsModalVisible] = useState({
        type: false,
        quota: false,
        date: false,
        expDate: false,
        time: false,
    });

    const [isUserEventOwner, setIsUserEventOwner] = useState(false);
    const [oldCoverUrl, setOldCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            getEventTypes();
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!eventTypes) return;
        if (id) {
            getEventById(id).then((response) => {
                reset({
                    title: response.title ?? '',
                    description: response.description ?? '',
                    type: response.type._id ?? '',
                    quota: response.quota ?? '',
                    location: response.location ?? '',
                    date: new Date(response.date) ?? new Date(),
                    time: new Date(response.date) ?? getRoundedMinute(new Date(), 15),
                    isLimitedTime: response.isLimitedTime ?? false,
                    isOnline: response.isOnline ?? false,
                    isPrivate: response.isPrivate ?? false,
                    isFree: response.isFree ?? true,
                    entranceFee: response.entranceFee ?? '',
                    cover: response.cover ?? null
                });
                setIsUserEventOwner(response.creator?._id === decodedToken?.userId);
                setOldCoverUrl(response.cover || null);
            }
            ).catch((error) => {
                console.error('Error fetching event:', error);
                Toast.error(errorMessages.default);
            });
        }
        else {
            reset({
                title: '',
                description: '',
                type: '',
                quota: '',
                location: '',
                date: new Date(),
                time: getRoundedMinute(new Date(), 15),
                isLimitedTime: false,
                isOnline: false,
                isPrivate: false,
                isFree: true,
                entranceFee: '',
                cover: null
            })
        }
    }, [id, eventTypes, reset])

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

    const onSubmitCreate = async (data: FormData & { time: Date }) => {
        Toast.info("Event is creating...");
        setOnProgress(true);

        try {
            let coverUrl: string | boolean | undefined = undefined;

            if (data.cover && typeof data.cover !== "string") {
                coverUrl = await uploadImageToFirebase(data.cover, 'event-cover');
            }

            const eventDateTime = new Date(
                data.date.getFullYear(),
                data.date.getMonth(),
                data.date.getDate(),
                data.time.getHours(),
                data.time.getMinutes(),
            );

            const { cover, date, time, ...restData } = data;

            const payload = {
                ...restData,
                date: eventDateTime,
                cover: coverUrl ?? ''
            };

            const response = await axiosInstance.post('event', payload);
            Toast.success(response.data.message || successMessages.default);
            router.push('/(tabs)/attend');

        } catch (err: unknown) {
            console.error(err);
            const axiosError = err as AxiosError<ApiErrorProps>;
            Toast.error(axiosError.response?.data?.message || errorMessages.default);
        } finally {
            setOnProgress(false);
        }
    }

    const onSubmitUpdate = async (data: FormData & { time: Date }) => {
        if (!id) return;

        Toast.info("Event is updating...");
        setOnProgress(true);

        try {
            const { cover, date, time, ...restData } = data;
            let coverUrl: string | boolean | undefined = undefined;
            if (cover) {
                if (typeof cover === "string") {
                    coverUrl = cover;
                }
                else {
                    coverUrl = await uploadImageToFirebase(cover, 'event-cover');
                }
            }
            if (oldCoverUrl) {
                await deleteFromFirebase(oldCoverUrl);
            }

            const eventDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
            const payload = {
                ...restData,
                date: eventDateTime,
                cover: coverUrl || ''
            };

            const response = await axiosInstance.put(`event/${id}`, payload);
            Toast.success(response.data.message || successMessages.default);

        } catch (err: unknown) {
            console.error(err);
            const axiosError = err as AxiosError<ApiErrorProps>;
            Toast.error(axiosError.response?.data?.message || errorMessages.default);
        } finally {
            setOnProgress(false);
        }
    }

    const handleDeleteEvent = async () => {
        if (!id) return;
        Toast.info("Event is deleting...");
        setOnProgress(true);
        try {
            const response = await axiosInstance.delete(`event/${id}`);
            Toast.success(response.data.message || successMessages.default);
            router.push('/(tabs)/attend');
        } catch (err: unknown) {
            console.error(err);
            const axiosError = err as AxiosError<ApiErrorProps>;
            Toast.error(axiosError.response?.data?.message || errorMessages.default);
        } finally {
            setOnProgress(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} className='flex-1'>
            <ScrollView className={cn('mx-5', id && 'mt-8')} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View className='flex-row gap-x-2 mt-8 mb-6'>
                    {
                        id ?
                            <>
                                <NuText variant='extraBold' className='text-4xl'>Edit Event</NuText>
                                <AntDesign name="edit" size={26} color="black" />
                            </>
                            :
                            <>
                                <NuText variant='extraBold' className='text-4xl'>Create an Event</NuText>
                                <View><CreateIcon width={26} height={26} strokeColor='#000000' viewBox='0 0 22 22' /></View>
                            </>
                    }
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
                                    placeholderTextColor="#d4d4d4"
                                    className={cn(
                                        'h-[50px] bg-primary text-white text-xl rounded-xl px-4 leading-normal font-nunitoMedium',
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
                                        options={Object.fromEntries(
                                            Array.from({ length: 99 }, (_, i) => [`${i + 2}`, `${i + 2}`])
                                        )}
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
                                            <NuText variant='semiBold' className='text-xl text-white tracking-wider'>{value ? value.toLocaleDateString() : 'Select a date'}</NuText>
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
                        <View className='flex-row justify-between items-center px-2 mb-1'>
                            <NuText variant='bold' className='text-2xl'>Time</NuText>
                            {errors.time && <NuText variant='medium' className='text-lg ml-2 text-red-500'>Required*</NuText>}
                        </View>
                        <Controller
                            name="time"
                            control={control}
                            rules={{ required: true }}
                            defaultValue={new Date()}
                            render={({ field: { onChange, value } }) => (
                                <View>
                                    <TouchableOpacity onPress={() => setIsModalVisible({ ...isModalVisible, time: true })}>
                                        <View className='h-[50px] bg-primary rounded-xl px-4 flex-row justify-between items-center'>
                                            <NuText variant='semiBold' className='text-xl text-white tracking-wider'>
                                                {value ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
                                            </NuText>
                                            <CalendarIcon width={24} height={24} />
                                        </View>
                                    </TouchableOpacity>
                                    <TimePickerModal
                                        title="Select Time"
                                        time={value || new Date()}
                                        visible={isModalVisible.time}
                                        onChange={(event: any, selectedTime?: Date) => {
                                            if (selectedTime) onChange(selectedTime);
                                        }}
                                        onClose={() => setIsModalVisible({ ...isModalVisible, time: false })}
                                    />
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
                                        <Image
                                            source={cover}
                                            contentFit="cover"
                                            transition={250}
                                            placeholder={{ blurhash: imageBlurHash }}
                                            style={{ width: "100%", height: "100%" }}
                                        />
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
                    {
                        id ?
                            <TouchableOpacity onPress={handleDeleteEvent} disabled={onProgress} className='mb-16 h-28 bg-quaternary disabled:bg-quaternary/50 rounded-xl items-center justify-center'>
                                <NuText variant='bold' className='text-white text-3xl'>{!onProgress ? 'DELETE EVENT' : 'DELETING...'}</NuText>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={handleSubmit(onSubmitCreate)} disabled={onProgress} className='mb-16 h-28 bg-tertiary disabled:bg-tertiary/50 rounded-xl items-center justify-center'>
                                <NuText variant='bold' className='text-white text-3xl'>{!onProgress ? 'CREATE EVENT' : 'CREATING...'}</NuText>
                            </TouchableOpacity>
                    }
                </View>
            </ScrollView>
            {
                isUserEventOwner && (
                    <TouchableOpacity onPress={handleSubmit(onSubmitUpdate)} disabled={onProgress} className='fixed bottom-0 bg-secondary h-20 items-center justify-center pb-2 rounded-[14px]'>
                        <NuText variant='extraBold' className='text-2xl text-white'>{!onProgress ? 'SAVE CHANGES' : 'SAVING...'}</NuText>
                    </TouchableOpacity>
                )
            }
        </SafeAreaView>
    );
}
export default ManageEvent;