import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import NuText from '../../components/NuText';
import NuLink from '../../components/NuLink';
import { Controller, useForm } from 'react-hook-form';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import COLORS from '../../constants/colors';
import { useState } from 'react';

type FormData = {
  username: string;
  password: string;
};
const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    }
  });
  const onSubmit = (data: FormData) => console.log(data);
  return (
    <View className='size-full justify-center gap-y-8 px-4'>
      <NuText variant='extraBold' className='text-5xl text-center pt-4'>LOGIN</NuText>
      <View className='w-full gap-y-2'>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Username'
              className='font-nunitoBold text-2xl bg-greayish rounded-2xl h-16 px-6'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="username"
        />
        <View className='relative'>
          <Controller
            control={control}
            rules={{
              required: true,
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
            name="password"
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
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <View className='bg-primary h-16 justify-center rounded-2xl'>
            <NuText variant='bold' className='text-center text-white text-2xl'>Submit</NuText>
          </View>
        </TouchableOpacity>
      </View>
      <View className='flex-row items-center gap-x-2 pl-2'>
        <NuText variant='regular' className='text-lg'>No account yet?</NuText>
        <NuLink href='/(tabs)/profile/signup' variant='medium' className='text-primary text-xl'>Sign up</NuLink>
      </View>
    </View>
  );
}
export default Login;