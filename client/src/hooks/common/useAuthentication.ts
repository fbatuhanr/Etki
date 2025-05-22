import { useAppDispatch } from "@/src/hooks/common/useRedux";
import { setAccessToken, clearAccessToken } from "@/src/redux/features/authSlice";
import useAxios from "@/src/hooks/common/useAxios";
import { isApiError } from "@/src/helpers/apiHelpers";
import { errorMessages, successMessages } from "@/src/constants/messages";
import { Toast } from "toastify-react-native";

const useAuthentication = () => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxios();

  const loginCall = async (username: string, password: string) => {
    const response = await axiosInstance.post("user/login", {
      username,
      password,
    });

    dispatch(setAccessToken(response.data.accessToken));
    return response.data.message;
  };

  const signupCall = async (
    fullName: string,
    username: string,
    email: string,
    password: string
  ): Promise<string> => {
    const [name, surname] = fullName.trim().split(/ (?!.* )/);
    const response = await axiosInstance.post("user/sign-up", {
      username,
      email,
      password,
      name,
      surname,
    });

    return response.data.message;
  };

  const logoutCall = async (): Promise<void> => {
    await axiosInstance.post("user/logout");
    dispatch(clearAccessToken());
  };

  return { loginCall, signupCall, logoutCall };
};

export default useAuthentication;
