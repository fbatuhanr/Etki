import { ApiErrorProps } from "../types/api-error";

export function isApiError(error: unknown): error is ApiErrorProps {
  return (error as ApiErrorProps).response?.data?.message !== undefined;
}