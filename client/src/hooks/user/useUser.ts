import { useState } from 'react';
import { useGet } from '../common/useGet';
import useAxios from '../useAxios';
import { errorMessages } from '@/src/constants/messages';

export const useUser = () => {
  const axiosInstance = useAxios();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getUserById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`user/${id}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.message || errorMessages.default);
    } finally {
      setLoading(false);
    }
  };

  return {
    getUserById,
    data,
    loading,
    error,
  };
};