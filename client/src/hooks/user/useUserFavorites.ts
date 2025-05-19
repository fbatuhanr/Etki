import useAxios from '../common/useAxios';

export const useUserFavorites = () => {
    const axiosInstance = useAxios();

    const checkEventIfFavorited = async (eventId: string) => {
        try {
            const { data: responseData } = await axiosInstance.get(`/user/${eventId}/is-favorited`);
            console.log("checkEventIfFavorited", responseData);
            return responseData.isFavorited;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };
    const addEventToFavorites = async (eventId: string) => {
        try {
            console.log("addEventToFavorites", eventId);
            const { data: responseData } = await axiosInstance.post(`/user/${eventId}/favorite`);
            console.log("addEventToFavorites response", responseData);
            return responseData;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };
    const removeEventFromFavorites = async (eventId: string) => {
        try {
            const { data: responseData } = await axiosInstance.delete(`/user/${eventId}/favorite`);
            return responseData;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    return {
        checkEventIfFavorited,
        addEventToFavorites,
        removeEventFromFavorites,
    }
};