import { BaseDataProvider } from "./base";
import { fetchUtils } from "react-admin";

const API_URL = import.meta.env.VITE_WALLET_URL;

export class VaultDataProvider extends BaseDataProvider {
    async getVaultState(resource: "vault"): Promise<WalletStorage> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/state`, {
            method: "GET",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        return json?.data;
    }

    async addPartialKey(
        resource: "vault",
        params: { key_part: string }
    ): Promise<{ data: WalletStorage; success: boolean; error: string }> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/partial`, {
            method: "POST",
            body: JSON.stringify(params),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        return json;
    }

    async cancelUnsealing(resource: "vault"): Promise<{ success: boolean; error: string }> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/seal`, {
            method: "POST",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        return json;
    }
}
