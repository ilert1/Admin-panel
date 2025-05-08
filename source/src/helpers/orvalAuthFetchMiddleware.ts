import { updateTokenHelper } from "./updateTokenHelper";

export async function authFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    await updateTokenHelper();

    const token = localStorage.getItem("access-token");

    const headers = new Headers(init?.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...init,
        headers
    };

    const response = await fetch(input, config);

    const responseHeaders = response.headers;

    if (!response.ok) {
        try {
            const errorData = await response.json();
            const errorResponse = {
                data: errorData,
                status: response.status,
                headers: responseHeaders
            };

            throw errorResponse;
        } catch (jsonError) {
            const errorResponse = {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders
            };
            throw errorResponse;
        }
    }

    const data = await response.json();

    const successResponse = {
        data,
        status: response.status,
        headers: responseHeaders
    };

    return successResponse as T;
}
