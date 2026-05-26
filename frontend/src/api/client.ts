const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

export class ApiError extends Error {
    readonly status: number;
    readonly details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

export async function apiFetch<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const hasBody = options?.body != null;
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(hasBody ? { "Content-Type": "application/json" } : {}),
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        const body = err as { error?: string };
        throw new ApiError(
            body.error ?? res.statusText,
            res.status,
            err,
        );
    }

    if (res.status === 204) return undefined as T;

    const text = await res.text();
    if (!text) return undefined as T;

    return JSON.parse(text) as T;
}
