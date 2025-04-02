import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import NuText from '../../components/NuText';
import NuLink from '../../components/NuLink';
import { Controller, useForm } from 'react-hook-form';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import COLORS from '../../constants/colors';
import { useState } from 'react';

type FormData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  passwordAgain: string;
  agreedConditions: boolean;
};
const Signup = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      passwordAgain: '',
      agreedConditions: false
    }
  });
  const formValues = watch();
  const onSubmit = (data: FormData) => {
    console.log(data);
  }

  const textInputClasses = 'font-nunitoBold text-2xl bg-greayish rounded-2xl h-16 px-6';
  return (
    <View className='size-full justify-center gap-y-8 px-4'>
      <NuText variant='extraBold' className='text-5xl text-center pt-4'>SIGN UP</NuText>
      <View className='w-full gap-y-2'>
        <Controller
          name="fullName"
          control={control}
          rules={{ required: 'Full name is required!' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Full Name'
              className={`${textInputClasses}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.fullName && <Text className='ps-2 -mt-1.5 text-sm text-red-600'>{errors.fullName.message}</Text>}
        <Controller
          name="username"
          control={control}
          rules={{ required: 'Username is required!' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Username'
              className={`${textInputClasses}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize='none'
            />
          )}
        />
        {errors.username && <Text className='ps-2 -mt-1.5 text-sm text-red-600'>{errors.username.message}</Text>}
        <Controller
          name="email"
          control={control}
          rules={{ required: 'Email is required!' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Email'
              className={`${textInputClasses}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize='none'
            />
          )}
        />
        {errors.email && <Text className='ps-2 -mt-1.5 text-sm text-red-600'>{errors.email.message}</Text>}
        <View className='relative'>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required!',
              minLength: { value: 6, message: 'At least 6 characters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder='Password'
                className='font-nunitoBold text-2xl bg-greayish rounded-2xl h-16 pl-6 pr-14'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!isPasswordVisible}
              />
            )}
          />
          <TouchableOpacity
            className='absolute top-0 right-0 bottom-0 justify-center px-4'
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesome name={isPasswordVisible ? "eye-slash" : "eye"} size={24} color={COLORS.blackish} />
          </TouchableOpacity>
        </View>
        {errors.password && <Text className='ps-2 -mt-1.5 text-sm text-red-600'>{errors.password.message}</Text>}

        <Controller
          name="passwordAgain"
          control={control}
          rules={{
            required: 'Please confirm your password',
            validate: value =>
              value === formValues.password || 'Passwords do not match!',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Password Again'
              className={`${textInputClasses}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={!isPasswordVisible}
            />
          )}
        />
        {errors.passwordAgain && <Text className='ps-2 -mt-1.5 text-sm text-red-600'>{errors.passwordAgain.message}</Text>}

        <Controller
          name="agreedConditions"
          control={control}
          rules={{ required: 'You must accept the terms and conditions!' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TouchableOpacity
              className='mt-4 flex-row items-center gap-x-4'
              onPress={() => onChange(!value)}
            >
              <View className='size-10 rounded-2xl bg-greayish items-center justify-center'>
                {value && <FontAwesome name="check" size={24} color={COLORS.blackish} />}
              </View>
              <View className='flex-row gap-x-1'>
                <NuText variant='semiBold' className='text-xl'>I agree</NuText>
                <TouchableOpacity onPress={() => console.log('terms and conditions')}>
                  <NuText variant='semiBold' className='text-primary text-xl'>terms & conditions</NuText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
        {errors.agreedConditions && <Text className='ps-2 -mt-1.5 text-sm text-red-600'>{errors.agreedConditions.message}</Text>}

        <TouchableOpacity
          className='mt-2 bg-primary disabled:opacity-60 h-16 justify-center rounded-2xl'
          onPress={handleSubmit(onSubmit)}>
          <NuText variant='bold' className='text-center text-white text-2xl'>Submit</NuText>
        </TouchableOpacity>
      </View>
      <View className='flex-row items-center gap-x-2 pl-2'>
        <NuText variant='regular' className='text-lg'>Already have an account?</NuText>
        <NuLink href='/(tabs)/profile/login' variant='medium' className='text-primary text-xl'>Login</NuLink>
      </View>
    </View>
  );
}
export default Signup;