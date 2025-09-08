import { jwtDecode } from "jwt-decode";
import { fetchUtils } from "react-admin";
import { isTokenStillFresh } from "./jwt";

const keycloakLoginUrl = import.meta.env.VITE_KEYCLOAK_LOGIN_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

let refreshPromise: Promise<void> | null = null;

const updateToken = async (): Promise<void> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const refreshToken = localStorage.getItem("refresh-token");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const body = new URLSearchParams({
                client_id: clientId ?? "",
                grant_type: "refresh_token",
                refresh_token: refreshToken
            });

            const response = await fetchUtils.fetchJson(keycloakLoginUrl, {
                method: "POST",
                body: body.toString(),
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                })
            });

            const { access_token, refresh_token } = response.json;
            if (!access_token || !refresh_token) {
                throw new Error("Invalid token response");
            }

            localStorage.setItem("access-token", access_token);
            localStorage.setItem("refresh-token", refresh_token);
            localStorage.setItem("user", JSON.stringify(jwtDecode(access_token)));
        } catch (error) {
            localStorage.removeItem("access-token");
            localStorage.removeItem("refresh-token");
            localStorage.removeItem("user");
            throw error;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

export const updateTokenHelper = async () => {
    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");

    if (accessToken && isTokenStillFresh(accessToken)) {
        return Promise.resolve();
    }

    if (refreshToken && isTokenStillFresh(refreshToken)) {
        return updateToken().catch(error => {
            // console.error("Token update failed:", error);
            // Очищаем хранилище при неудачном обновлении
            localStorage.removeItem("access-token");
            localStorage.removeItem("refresh-token");
            localStorage.removeItem("user");
            return Promise.reject(error);
        });
    }

    return Promise.reject();
};
