import { AuthProvider, fetchUtils } from "react-admin";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { isTokenStillFresh } from "@/helpers/jwt";

interface KeycloakJwtPayload extends JwtPayload {
    realm_access: {
        roles: string[];
    };
}

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_LOGIN_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        try {
            const body = new URLSearchParams({
                client_id: clientId,
                grant_type: "password",
                username: username,
                password: password
            });

            const response = await fetchUtils.fetchJson(keycloakUrl, {
                method: "POST",
                body: body.toString(),
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                })
            });
            const { access_token, refresh_token } = response.json;
            localStorage.setItem("access-token", access_token);
            localStorage.setItem("refresh-token", refresh_token);

            const decodedToken: any = jwtDecode(access_token);
            localStorage.setItem("user", JSON.stringify(decodedToken));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },

    logout: () => {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("user");
        return Promise.resolve();
    },

    checkAuth: () => {
        return isTokenStillFresh(String(localStorage.getItem("access-token"))) ? Promise.resolve() : Promise.reject();
    },

    checkError: error => {
        if (!error) return Promise.resolve();
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("access-token");
            return Promise.reject();
        }
        return Promise.resolve();
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
