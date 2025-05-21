import { useAppDispatch } from "@/src/hooks/common/useRedux";
import { setAccessToken, clearAccessToken } from "@/src/redux/features/authSlice";
import useAxios from "@/src/hooks/common/useAxios";
import { isApiError } from "@/src/helpers/apiHelpers";
import { errorMessages, successMessages } from "@/src/constants/messages";
import { Toast } from "toastify-react-native";

const useAuthentication = () => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxios();

  const loginCall = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axiosInstance.post("user/login", {
        username,
        password,
      });

      dispatch(setAccessToken(response.data.accessToken));
      Toast.success(response.data.message || successMessages.login);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.login;

      Toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signupCall = async (
    fullName: string,
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const [name, surname] = fullName.trim().split(/ (?!.* )/);
      const response = await axiosInstance.post("user/sign-up", {
        username,
        email,
        password,
        name,
        surname,
      });

      Toast.success(response.data.message || successMessages.signup);
    } catch (error: unknown) {
      const errorMessage =
        isApiError(error) && error.response?.data?.message
          ? error.response.data.message
          : errorMessages.signup;

      Toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logoutCall = async (): Promise<void> => {
    try {
      await axiosInstance.post("user/logout");
      dispatch(clearAccessToken());
      Toast.success(successMessages.logout);
    } catch (error: unknown) {
      // console.error("Logout Error:", error);
      Toast.error(errorMessages.logout);
    }
  };

  return { loginCall, signupCall, logoutCall };
};

export default useAuthentication;
