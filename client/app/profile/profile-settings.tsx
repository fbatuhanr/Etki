import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import NuText from '@/src/components/NuText';
import COLORS from '@/src/constants/colors';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'toastify-react-native';
import useAxios from '@/src/hooks/common/useAxios';
import { defaultUserCover } from '@/src/data/defaultValues';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { useUser } from '@/src/hooks/user/useUser';
import { errorMessages, successMessages } from '@/src/constants/messages';
import { AxiosError } from 'axios';
import { ApiErrorProps } from '@/src/types/api-error';
import { deleteFromFirebase, uploadImageToFirebase } from '@/src/lib/firebaseOperations';
import { Image } from 'expo-image';
import { imageBlurHash } from '@/src/constants/images';
import { User } from '@/src/types/user';
import InfoModal from '@/src/components/modal/InfoModal';

type FormData = {
    name: string;
    surname: string;
    photo: ImagePicker.ImagePickerAsset | string | null;
    biography: string;
    isPublic: boolean;
};
const ProfileSettings = () => {

    const decodedToken = useDecodedToken();
    const axiosInstance = useAxios();

    const { getUserById } = useUser();
    const [user, setUser] = useState<User | null>(null);

    const [onProgress, setOnProgress] = useState(false);

    const [oldPhotoUrl, setOldPhotoUrl] = useState<string | null>(null);

    const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormData>({
        defaultValues: {
            name: '',
            surname: '',
            photo: null,
            biography: '',
            isPublic: true
        }
    });
    const formValues = watch();

    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserById(decodedToken.userId);
            setUser(response);
        };
        fetchUser();
    }, [decodedToken.userId]);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                surname: user.surname || '',
                photo: user.photo || null,
                biography: user.biography || '',
                isPublic: user.isPublic ?? true
            });
            setOldPhotoUrl(user.photo || null);
        }
    }, [user, reset]);

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

    const onSubmit = async (data: FormData) => {

        Toast.info("Profile is updating...");
        setOnProgress(true);
        try {
            const { photo, ...restData } = data;
            let photoUrl: string | boolean | undefined = undefined;
            if (photo) {
                if (typeof photo === "string") {
                    photoUrl = photo;
                }
                else {
                    photoUrl = await uploadImageToFirebase(photo, 'user-photos');
                }
            }
            if (oldPhotoUrl) {
                await deleteFromFirebase(oldPhotoUrl);
            }
            const payload = {
                ...restData,
                photo: photoUrl || '',
            };
            const response = await axiosInstance.put(`user/${decodedToken.userId}`, payload);
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
        <SafeAreaView edges={['top']} className='flex-1 pt-14'>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                className="flex-1"
                behavior="padding"
            >
                <ScrollView className='px-5'>
                    <View className='gap-y-4 mt-4'>
                        <View className='items-center gap-y-1'>
                            <View className='w-32 h-32 rounded-full overflow-hidden relative'>
                                <Image
                                    source={formValues?.photo || defaultUserCover}
                                    contentFit="cover"
                                    transition={250}
                                    placeholder={{ blurhash: imageBlurHash }}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </View>
                            {
                                formValues.photo &&
                                <TouchableOpacity onPress={() => setValue('photo', null)}>
                                    <NuText className='text-red-600'>tap here to remove</NuText>
                                </TouchableOpacity>
                            }
                        </View>
                        <View>
                            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Name</NuText>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        cursorColor={COLORS.white}
                                        selectionColor={COLORS.white}
                                        placeholderTextColor={COLORS.whietish}
                                        className='bg-primary font-nunitoBold text-white text-xl px-4 py-3 rounded-xl'
                                        placeholder="type here..."
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.name && <Text>This is required.</Text>}
                        </View>
                        <View>
                            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Surname</NuText>
                            <Controller
                                name="surname"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        cursorColor={COLORS.white}
                                        selectionColor={COLORS.white}
                                        placeholderTextColor={COLORS.whietish}
                                        className='bg-primary font-nunitoBold text-white text-xl px-4 py-3 rounded-xl'
                                        placeholder="type here..."
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.surname && <Text>This is required.</Text>}
                        </View>
                        <View>
                            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Photo</NuText>
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
                        <View>
                            <NuText variant='bold' className='text-2xl ml-2 mb-1'>Biography</NuText>
                            <Controller
                                name="biography"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        cursorColor={COLORS.white}
                                        selectionColor={COLORS.white}
                                        placeholderTextColor={COLORS.whietish}
                                        className='bg-primary font-nunitoBold text-white text-xl p-4 rounded-xl h-20'
                                        placeholder="type here..."
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        numberOfLines={2}
                                        multiline
                                    />
                                )}
                            />
                            {errors.biography && <Text>This is required.</Text>}
                        </View>
                        <View>
                            <Controller
                                name="isPublic"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TouchableOpacity
                                        className='mt-4 flex-row items-center gap-x-4'
                                        onPress={() => onChange(!value)}
                                    >
                                        <View className='size-10 rounded-2xl bg-primary items-center justify-center'>
                                            {value && <FontAwesome name="check" size={24} color={COLORS.white} />}
                                        </View>
                                        <View className='flex-row gap-x-2 items-center'>
                                            <NuText variant='semiBold' className='text-xl'>Public Account</NuText>
                                            <TouchableOpacity onPress={() => setShowInfo(true)} className='w-6 h-6 border-2 border-primary justify-center items-center rounded-full'>
                                                <Entypo name="info" size={13} color={COLORS.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                            {errors.isPublic && <Text className='ps-2 -mt-1.5 text-sm text-red-600'>{errors.isPublic.message}</Text>}
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)} disabled={onProgress}
                    className='h-24 bg-primary rounded-xl items-center justify-center'>
                    <NuText variant='bold' className='text-white text-3xl'>Save Changes</NuText>
                </TouchableOpacity>
                <InfoModal
                    visible={showInfo}
                    onClose={() => setShowInfo(false)}
                    title="Public / Private Account"
                    description="Everyone can see your event history. If you want to hide your event history, you can set your account to private. In this case, only your followers can see your event history."
                    buttonText="Got it!"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
export default ProfileSettings;