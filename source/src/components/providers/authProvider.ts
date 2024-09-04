import { AuthProvider, fetchUtils } from "react-admin";
import { jwtDecode } from "jwt-decode";
import { isTokenStillFresh } from "@/helpers/jwt";

const keycloakUrl = "https://auth.api4ftx.cloud/realms/blowfish-develop/protocol/openid-connect/token";

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        try {
            const body = new URLSearchParams({
                client_id: "juggler-front-local",
                grant_type: "password",
                username: username,
                password: password
            });

            const { json } = await fetchUtils.fetchJson(keycloakUrl, {
                method: "POST",
                body: body.toString(),
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                })
            });
            const { access_token, refresh_token } = json;

            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);

            const decodedToken: any = jwtDecode(access_token);
            localStorage.setItem("user", JSON.stringify(decodedToken));
            //         if (response.ok) {
            //             const json = await response.json();
            //             localStorage.setItem("accessToken", json.access_token);
            //             localStorage.setItem("refreshToken", json.refresh_token);
            //             return Promise.resolve();
            //         } else {
            //             throw new Error("Login failed");
            //         }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        return Promise.resolve();
    },

    checkAuth: () => {
        return isTokenStillFresh(String(localStorage.getItem("accessToken"))) ? Promise.resolve() : Promise.reject();
    },

    checkError: error => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("accessToken");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user ? Promise.resolve(user.roles) : Promise.reject();
    },

    getIdentity: () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return Promise.resolve({
            id: user.sub,
            fullName: user.name
        });
    }
};

// import { AuthProvider } from "react-admin";

// export const authProvider: AuthProvider = {
//     login: async ({ username, password }) => {
//         const formData = new URLSearchParams();
//         formData.append("client_id", "juggler-front-local");
//         formData.append("grant_type", "password");
//         formData.append("username", username);
//         formData.append("password", password);

//         const response = await fetch(keycloakUrl, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded"
//             }
//         });

//         if (response.ok) {
//             const json = await response.json();
//             localStorage.setItem("accessToken", json.access_token);
//             localStorage.setItem("refreshToken", json.refresh_token);
//             return Promise.resolve();
//         } else {
//             throw new Error("Login failed");
//         }
//     },
//     logout: () => {
//         localStorage.removeItem("accessToken");
//         return Promise.resolve();
//     },
//     checkError: error => {
//         const status = error.status;
//         if (status === 401 || status === 403) {
//             localStorage.removeItem("accessToken");
//             return Promise.reject();
//         }
//         return Promise.resolve();
//     },
//     checkAuth: () => {
//         return localStorage.getItem("accessToken") ? Promise.resolve() : Promise.reject();
//     },
//     getPermissions: () => Promise.resolve()
// };
