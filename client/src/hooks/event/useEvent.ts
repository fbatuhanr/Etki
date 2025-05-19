import { useState } from "react";
import useAxios from "@/src/hooks/common/useAxios";
import { Event } from "@/src/types/event";
import { AxiosError } from "axios";
import { ApiErrorProps } from "@/src/types/api-error";
import { errorMessages } from "@/src/constants/messages";

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
      throw new Error(axiosError.response?.data?.message || errorMessages.eventNotFound)
    }
  };

  const getCreatedEvents = async (userId: string) => {
    try {
      const { data: responseData } = await axiosInstance.get(`/event/created/${userId}`);
      return responseData.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const getJoinedEvents = async (userId: string) => {
    try {
      const { data: responseData } = await axiosInstance.get(`/event/joined/${userId}`);
      return responseData.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const filterEvents = async (params: Record<string, any>) => {
    try {
      const { data: responseData } = await axiosInstance.get("/event/filter", { params });
      return responseData.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      const { data: responseData } = await axiosInstance.post("/event", eventData);
      return responseData.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    getAllEvents,
    getEventById,
    getCreatedEvents,
    getJoinedEvents,
    filterEvents,
    createEvent
  };
};
