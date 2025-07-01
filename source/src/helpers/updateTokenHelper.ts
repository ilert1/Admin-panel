import { jwtDecode } from "jwt-decode";
import { fetchUtils } from "react-admin";
import { isTokenStillFresh } from "./jwt";

const keycloakLoginUrl = import.meta.env.VITE_KEYCLOAK_LOGIN_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

const updateToken = async () => {
    const refreshToken = localStorage.getItem("refresh-token");

    if (!refreshToken) {
        return Promise.reject("No refresh token available");
    }

    try {
        const bodyObject = {
            client_id: clientId ?? "",
            grant_type: "refresh_token",
            refresh_token: refreshToken
        };

        const body = new URLSearchParams(bodyObject);

        const response = await fetchUtils.fetchJson(keycloakLoginUrl, {
            method: "POST",
            body: body.toString(),
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            })
        });

        const { access_token, refresh_token } = response.json;

        if (!access_token || !refresh_token) {
            // throw new Error("Invalid token response");
            return Promise.reject("Invalid token response");
        }

        localStorage.setItem("access-token", access_token);
        localStorage.setItem("refresh-token", refresh_token);

        const decodedToken = jwtDecode(access_token);
        localStorage.setItem("user", JSON.stringify(decodedToken));

        return Promise.resolve();
    } catch (error) {
        // console.error("Token update error:", error);
        // Очищаем невалидные токены при ошибке
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("user");
        // return Promise.reject(error);
    }
};

export const updateTokenHelper = async () => {
    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");

    if (accessToken && isTokenStillFresh(accessToken)) {
        return Promise.resolve();
    }

    if (refreshToken && isTokenStillFresh(refreshToken)) {
        return updateToken().catch(error => {
            console.error("Token update failed:", error);
            // Очищаем хранилище при неудачном обновлении
            localStorage.removeItem("access-token");
            localStorage.removeItem("refresh-token");
            localStorage.removeItem("user");
            return Promise.reject(error);
        });
    }

    return Promise.reject();
};
