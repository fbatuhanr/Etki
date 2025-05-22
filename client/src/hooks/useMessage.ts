import { useState } from "react";
import { Message, MessageCount, MessageCountsMap } from "@/src/types/message";
import useAxios from "./common/useAxios";

export function useMessage() {
    const axiosInstance = useAxios();

    const getMessages = async (eventId: string) => {
        try {
            const { data } = await axiosInstance.get(`/message/${eventId}`);
            const messages: Message[] = data.data;

            return messages;
        } catch (err) {
            // console.error("useMessage error", err);
            return [];
        }
    };

    const getMessageCountsByEventIds = async (eventIds: string[]): Promise<MessageCountsMap> => {
        try {
            const { data } = await axiosInstance.post("/message/counts", { eventIds });
            const map = Object.fromEntries(
                data.data.map((m: MessageCount) => [m.eventId, m.count])
            );
            return map;
        } catch (err) {
            return {};
        }
    };

    return { getMessages, getMessageCountsByEventIds };
}
