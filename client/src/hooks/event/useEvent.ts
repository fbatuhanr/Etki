import { useState } from "react";
import useAxios from "@/src/hooks/common/useAxios";
import { Event } from "@/src/types/event";
import { AxiosError } from "axios";
import { ApiErrorProps } from "@/src/types/api-error";
import { errorMessages, successMessages } from "@/src/constants/messages";
import { Toast } from "toastify-react-native";

export const useEvent = () => {
  const axiosInstance = useAxios();

  const getAllEvents = async () => {
    try {
      const { data: responseData } = await axiosInstance.get("/event");
      return responseData.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default)
    }
  };

  const getEventById = async (id: string) => {
    try {
      const { data: responseData } = await axiosInstance.get(`/event/${id}`);
      return responseData.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default)
    }
  };

  const getCreatedEvents = async (userId: string) => {
    try {
      const { data: responseData } = await axiosInstance.get(`/event/created/${userId}`);
      return responseData.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default)
    }
  };

  const getJoinedEvents = async (userId: string) => {
    try {
      const { data: responseData } = await axiosInstance.get(`/event/joined/${userId}`);
      return responseData.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default)
    }
  };

  const getFavoritedEvents = async (userId: string) => {
    try {
      const { data: responseData } = await axiosInstance.get(`/event/favorites/${userId}`);
      return responseData.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default)
    }
  };

  const filterEvents = async (params: Record<string, any>) => {
    try {
      const { data: responseData } = await axiosInstance.get("/event/filter", { params });
      return responseData.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default)
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      const { data: responseData } = await axiosInstance.post("/event", eventData);
      return responseData.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      throw new Error(axiosError.response?.data?.message || errorMessages.default)
    }
  };

  const removeParticipantFromEvent = async (eventId: string, userId: string) => {
    try {
      await axiosInstance.delete(`/event/${eventId}/attendance/${userId}`);
      Toast.success("User removed.");
      return true;
    } catch (err) {
      console.error("Remove error", err);
      Toast.error("Could not remove user.");
      return false;
    }
  };

  const attendEvent = async (eventId: string) => {
    try {
      Toast.info("Joining event...");
      const { data: responseData } = await axiosInstance.post(`/event/${eventId}/attend`);
      Toast.success(responseData.message || successMessages.attended);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      const message = axiosError.response?.data?.message || errorMessages.attended;
      Toast.error(message);
    }
  }

  const leaveEvent = async (eventId: string) => {
    try {
      Toast.info("Leaving event...");
      const { data: responseData } = await axiosInstance.post(`/event/${eventId}/leave`);
      Toast.success(responseData.message || successMessages.unAttended);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorProps>;
      const message = axiosError.response?.data?.message || errorMessages.unAttended;
      Toast.error(message);
    }
  }

  return {
    getAllEvents,
    getEventById,
    getCreatedEvents,
    getJoinedEvents,
    getFavoritedEvents,
    filterEvents,
    createEvent,
    removeParticipantFromEvent,
    attendEvent,
    leaveEvent
  };
};
