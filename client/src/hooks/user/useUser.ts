import { useState } from 'react';
import { useGet } from '../common/useGet';
import useAxios from '../common/useAxios';
import { errorMessages } from '@/src/constants/messages';
import { AxiosError } from 'axios';
import { ApiErrorProps } from '@/src/types/api-error';

export const useUser = () => {
  const axiosInstance = useAxios();

  const getUserById = async (id: string) => {
    try {
      const { data } = await axiosInstance.get(`user/${id}`);
      return data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.userNotFound)
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const { data } = await axiosInstance.get("/user/search", {
        params: { q: query }
      });
      return data.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default);
    }
  };

  return {
    getUserById,
    searchUsers
  };
};