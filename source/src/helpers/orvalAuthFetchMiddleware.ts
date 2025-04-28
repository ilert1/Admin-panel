import { jwtDecode } from "jwt-decode";
import { fetchUtils } from "react-admin";
import { isTokenStillFresh } from "./jwt";

const keycloakLoginUrl = process.env.VITE_KEYCLOAK_LOGIN_URL;
const clientId = process.env.VITE_KEYCLOAK_CLIENT_ID;

async function refreshTokens(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    const bodyObject = {
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const body = new URLSearchParams(bodyObject);

    try {
        const response = await fetchUtils.fetchJson(keycloakLoginUrl, {
            method: "POST",
            body: body.toString(),
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            })
        });

        if (!response.json.success) throw new Error("Failed to refresh token");

        const { access_token, refresh_token } = response.json;

        if (!access_token || !refresh_token) {
            throw new Error("Invalid token response");
        }

        localStorage.setItem("access-token", access_token);
        localStorage.setItem("refresh-token", refresh_token);

        const decodedToken = jwtDecode(access_token);
        localStorage.setItem("user", JSON.stringify(decodedToken));

        return true;
    } catch (error) {
        console.error("Token update error:", error);
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("user");

        return false;
    }
}

async function ensureValidToken(): Promise<string | null> {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) return null;

    if (!isTokenStillFresh(accessToken)) {
        const refreshSuccessful = await refreshTokens();
        if (refreshSuccessful) {
            return localStorage.getItem("access_token");
        }
        return null;
    }

    return accessToken;
}

export async function authFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const token = await ensureValidToken();

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
