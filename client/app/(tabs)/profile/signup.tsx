import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import NuText from '../../components/NuText';
import NuLink from '../../components/NuLink';
import { Controller, useForm } from 'react-hook-form';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import COLORS from '../../constants/colors';
import { useState } from 'react';

type FormData = {
    name: string;
    surname: string;
    password: string;
    passwordAgain: string;
    email: string;
    agreedConditions: boolean;
};
const Signup = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      surname: '',
      password: '',
      passwordAgain: '',
      email: '',
      agreedConditions: false
    }
  });
  const onSubmit = (data: FormData) => console.log(data);

  const textInputClasses = 'font-nunitoBold text-2xl bg-greayish rounded-2xl h-16 px-6';
  return (
    <View className='size-full justify-center gap-y-8 px-4'>
      <NuText variant='extraBold' className='text-5xl text-center pt-4'>SIGN UP</NuText>
      <View className='w-full gap-y-2'>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Name'
              className={`${textInputClasses}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          name="surname"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Surname'
              className={`${textInputClasses}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Email'
              className={`${textInputClasses}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <View className='relative'>
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
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
            {isPasswordVisible ?
              <FontAwesome name="eye-slash" size={24} color={COLORS.blackish} /> :
              <FontAwesome name="eye" size={24} color={COLORS.blackish} />
            }
          </TouchableOpacity>
        </View>
        <Controller
          name="passwordAgain"
          control={control}
          rules={{ required: true }}
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
        <Controller
            name="agreedConditions"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
                <TouchableOpacity 
                    className='mt-4 flex-row items-center gap-x-4'
                    onPress={() => onChange(!value)}
                >
                    <View className='size-10 rounded-2xl bg-greayish items-center justify-center'>
                        {value &&  <FontAwesome name="check" size={24} color={COLORS.blackish} />}
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
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <View className='bg-primary h-16 justify-center rounded-2xl'>
            <NuText variant='bold' className='text-center text-white text-2xl'>Submit</NuText>
          </View>
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