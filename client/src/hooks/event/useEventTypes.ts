import { useState } from "react";
import useAxios from "../common/useAxios";
import { EventType } from "@/src/types/event-type";

export const useEventTypes = () => {
    const axiosInstance = useAxios();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getEventTypes = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: responseData } = await axiosInstance.get("event-type");
            setEventTypes(responseData.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch event types");
        } finally {
            setLoading(false);
        }
    };

    return { eventTypes, getEventTypes, loading, error };
};
