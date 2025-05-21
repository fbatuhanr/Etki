import useAxios from "@/src/hooks/common/useAxios";
import { Toast } from "toastify-react-native";
import { errorMessages, successMessages } from "@/src/constants/messages";
import { useState } from "react";

export const useFriend = () => {
  const axiosInstance = useAxios();
  const [onProgress, setOnProgress] = useState(false);

  const sendFriendRequest = async (toUserId: string) => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.post(`/friend/request/${toUserId}`);
      Toast.success(data.message || successMessages.friendRequestSent);
      return data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.friendRequestSent);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };
  const cancelFriendRequestByUser = async (toUserId: string) => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.delete(`/friend/cancel-by-user/${toUserId}`);
      Toast.success(data.message || successMessages.friendRequestCancelled);
      return data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.friendRequestCancelled);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };

  const acceptFriendRequestByUser = async (fromUserId: string) => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.post(`/friend/accept-by-user/${fromUserId}`);
      Toast.success(data.message || successMessages.friendRequestAccepted);
      return data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.friendRequestAccepted);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };

  const rejectFriendRequestByUser = async (fromUserId: string) => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.delete(`/friend/reject/${fromUserId}`);
      Toast.success(data.message || successMessages.friendRequestRejected);
      return data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.friendRequestRejected);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };


  const getIncomingRequests = async () => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.get(`/friend/requests`);
      return data.data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.default);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };
  const getSentRequests = async () => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.get(`/friend/sent-requests`);
      return data.data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.default);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };

  const getFriendsOfUser = async (userId: string) => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.get(`/friend/friends/${userId}`);
      return data.data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.default);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };

  const checkIsFriend = async (otherUserId: string): Promise<boolean> => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.get(`/friend/is-friend/${otherUserId}`);
      return data.isFriend;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.default);
      return false;
    } finally {
      setOnProgress(false);
    }
  };

  const checkHasPendingRequest = async (toUserId: string): Promise<boolean> => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.get(`/friend/has-request/${toUserId}`);
      return data.hasPendingRequest;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.default);
      return false;
    } finally {
      setOnProgress(false);
    }
  };


  const removeFriend = async (friendId: string) => {
    try {
      setOnProgress(true);
      const { data } = await axiosInstance.delete(`/friend/${friendId}`);
      Toast.success(data.message || successMessages.friendRemoved);
      return data;
    } catch (err: any) {
      Toast.error(err.response?.data?.message || errorMessages.friendRemoved);
      throw err;
    } finally {
      setOnProgress(false);
    }
  };

  return {
    onProgress,
    sendFriendRequest,
    cancelFriendRequestByUser,
    acceptFriendRequestByUser,
    rejectFriendRequestByUser,
    getIncomingRequests,
    getSentRequests,
    getFriendsOfUser,
    checkIsFriend,
    checkHasPendingRequest,
    removeFriend
  };
};
