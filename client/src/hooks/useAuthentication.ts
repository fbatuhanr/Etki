import { useAppDispatch } from "@/src/hooks/useRedux";
import { setAccessToken, clearAccessToken } from "@/src/redux/features/authSlice";
import useAxios from "@/src/hooks/useAxios";
import { isApiError } from "@/src/helpers/apiHelpers";
import { errorMessages } from "../constants/messages";

const useAuthentication = () => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxios();

  const loginCall = async ( username: string, password: string): Promise<string> => {
    try {
      const response = await axiosInstance.post("user/login", {
        username,
        password,
      });

      dispatch(setAccessToken(response.data.accessToken));
      return response.data.message;
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      throw errorMessage;
    }
  };

  const signupCall = async ( fullName: string, username: string, email: string, password: string ): Promise<string> => {
    try {
      const [name, surname] = fullName.trim().split(/ (?!.* )/);
      const response = await axiosInstance.post("user/sign-up", {
        username,
        email,
        password,
        name,
        surname,
      });
      return response.data.message;
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.default;

      throw errorMessage;
    }
  };

  const logoutCall = async () => {
    try {
      await axiosInstance.post("user/logout");
      dispatch(clearAccessToken());
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return { loginCall, signupCall, logoutCall };
};

export default useAuthentication;