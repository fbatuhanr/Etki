import { useAppSelector } from "@/src/hooks/common/useRedux";
import { jwtDecode } from "jwt-decode";
import { defaultDecodedToken } from "@/src/data/defaultValues";

export interface DecodedTokenProps {
    userId: string;
    username: string;
    exp?: number;
    iat?: number;
}
export const useDecodedToken = () => {
  const auth = useAppSelector((state) => state.auth);

  try {
    return auth?.accessToken
      ? jwtDecode<DecodedTokenProps>(auth.accessToken)
      : defaultDecodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return defaultDecodedToken;
  }
};