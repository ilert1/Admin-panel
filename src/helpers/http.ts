import { fetchUtils } from "react-admin";

export const API_URL = import.meta.env.VITE_API_URL;

console.log(import.meta.env);

export const http = async (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }
    options.headers.set("Authorization", localStorage.getItem("accessToken"));
    return await fetchUtils.fetchJson(url, options);
};
