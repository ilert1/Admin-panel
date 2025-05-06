import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthProvider, fetchUtils } from "react-admin";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";

import { QueryClient } from "@tanstack/react-query";

interface KeycloakJwtPayload extends JwtPayload {
    realm_access: {
        roles: string[];
    };
}

const keycloakLoginUrl = import.meta.env.VITE_KEYCLOAK_LOGIN_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

const clearUserData = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("testEnvShown");
};

export const authProvider: AuthProvider = {
    login: async ({ username, password, totpCode, totpRequestCode }) => {
        if (totpRequestCode) {
            try {
                const bodyObject = {
                    client_id: clientId,
                    grant_type: "authorization_code",
                    code: totpRequestCode,
                    redirect_uri: `${window.location.origin}${window.location.pathname}`
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
                localStorage.setItem("access-token", access_token);
                localStorage.setItem("refresh-token", refresh_token);

                const decodedToken: JWT.Payload = jwtDecode(access_token);
                localStorage.setItem("user", JSON.stringify(decodedToken));
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        }

        try {
            const bodyObject = {
                client_id: clientId,
                grant_type: "password",
                username,
                password
            };

            const body = new URLSearchParams(totpCode ? { ...bodyObject, totp: totpCode } : bodyObject);

            const response = await fetchUtils.fetchJson(keycloakLoginUrl, {
                method: "POST",
                body: body.toString(),
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                })
            });
            const { access_token, refresh_token } = response.json;
            localStorage.setItem("access-token", access_token);
            localStorage.setItem("refresh-token", refresh_token);

            const decodedToken: JWT.Payload = jwtDecode(access_token);
            localStorage.setItem("user", JSON.stringify(decodedToken));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem("refresh-token");
            if (!refreshToken) {
                clearUserData();
                return Promise.resolve();
            }
            const bodyObject = {
                client_id: clientId,
                token: refreshToken,
                token_type_hint: "refresh_token"
            };

            const body = new URLSearchParams(bodyObject);

            const kk = keycloakLoginUrl;
            const response = await fetchUtils.fetchJson(`${kk.slice(0, kk.lastIndexOf("token"))}revoke`, {
                method: "POST",
                body: body.toString(),
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                })
            });
        } catch (error) {
            clearUserData();
            return Promise.reject(error);
        } finally {
            clearUserData();
            return Promise.resolve();
        }
    },

    checkAuth: async () => {
        updateTokenHelper();
    },

    checkError: async error => {
        if (!error) return Promise.resolve();
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("access-token");
            try {
                // Пытаемся обновить токен и ждём результата
                // await updateToken();
                updateTokenHelper();
                return Promise.resolve(); // Токен обновлён, продолжаем работу
            } catch (updateError) {
                // Если обновление не удалось - очищаем всё
                localStorage.removeItem("refresh-token");
                localStorage.removeItem("user");
                return Promise.reject(updateError); // Вызываем logout
            }
        }
        return Promise.resolve(error);
    },

    getPermissions: () => {
        const token = localStorage.getItem("access-token");
        if (!token) return Promise.reject();

        const user = jwtDecode<KeycloakJwtPayload>(token);
        const roles = user.realm_access?.roles;

        if (!roles) return Promise.reject();

        if (roles.includes("admin")) {
            return Promise.resolve("admin");
        }
        if (roles.includes("merchant")) {
            return Promise.resolve("merchant");
        }

        return Promise.reject();
    },

    getIdentity: () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return Promise.resolve({
            id: user.sub,
            fullName: user.name
        });
    }
};
