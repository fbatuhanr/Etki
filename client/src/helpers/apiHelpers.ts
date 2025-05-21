import { AxiosError } from "axios";
import { ApiErrorProps } from "../types/api-error";

export function isApiError(error: unknown): error is AxiosError<ApiErrorProps> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
};