import { fetchUtils } from "react-admin";

import { IBaseDataProvider } from "./base";

const API_URL = import.meta.env.VITE_WALLET_URL;

export class VaultDataProvider extends IBaseDataProvider {
    async getVaultState(resource: "vault", signal?: AbortSignal): Promise<Wallets.WalletStorage> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/state`, {
            method: "GET",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
            signal
        });

        return json?.data;
    }

    async initiatedState(
        resource: "vault"
    ): Promise<{ success: boolean; error: { error_message: string; error_type: string } }> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/init`, {
            method: "POST",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        return json;
    }

    async addPartialKey(
        resource: "vault",
        params: { key_part: string }
    ): Promise<{
        data: Wallets.WalletStorage | string;
        success: boolean;
        error: { error_message: string; error_type: string };
    }> {
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
