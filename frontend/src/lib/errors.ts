import { ApiError } from "../api/client";

export function getErrorMessage(
    error: unknown,
    fallback = "Произошла ошибка",
): string {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return fallback;
}
