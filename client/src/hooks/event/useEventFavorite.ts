import { useEffect, useState } from "react";
import useAxios from "../common/useAxios";
import { useDecodedToken } from "../common/useDecodedToken";
import { Toast } from "toastify-react-native";
import { router } from "expo-router";
import { errorMessages, successMessages } from "@/src/constants/messages";

export function useEventFavorite(eventId?: string) {
  const axiosInstance = useAxios();
  const decodedToken = useDecodedToken();

  const [isFavorited, setIsFavorited] = useState(false);
  const [onProgress, setOnProgress] = useState(false);

  const checkIsFavorited = async () => {
    if (!eventId) return;
    try {
      const { data } = await axiosInstance.get(`/event/${eventId}/is-favorited`);
      setIsFavorited(data.isFavorited);
    } catch { };
  };

  useEffect(() => {
    checkIsFavorited();
  }, [eventId]);

  const handleFavorite = async () => {
    if (!eventId) return;

    if (!decodedToken.userId) {
      Toast.error("You need to be logged in to favorite an event.");
      router.push('/(tabs)/profile/login');
      return;
    }

    try {
      setOnProgress(true);
      if (isFavorited) {
        const { data } = await axiosInstance.delete(`/event/${eventId}/favorite`);
        Toast.success(data.message || successMessages.favoriteRemoved);
        setIsFavorited(false);
      } else {
        const { data } = await axiosInstance.post(`/event/${eventId}/favorite`);
        Toast.success(data.message || successMessages.favoriteAdded);
        setIsFavorited(true);
      }
    } catch (err: any) {
      Toast.error(err.message || errorMessages.default);
    } finally {
      setOnProgress(false);
    }
  };

  return {
    isFavorited,
    onProgress,
    handleFavorite,
  };
}
