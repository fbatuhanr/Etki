import { useState, useEffect } from 'react';
import axios from 'axios';
import useAxios from '@/src/hooks/useAxios';

export const useGet = <T>(endpoint: string) => {

    const axiosInstance = useAxios();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axiosInstance.get<T>(endpoint, {
                    signal: controller.signal,
                });
                setData(response.data);
            } catch (err: any) {
                if (!axios.isCancel(err)) {
                    setError(err.message || 'An error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [endpoint]);

    return { data, loading, error };
};
