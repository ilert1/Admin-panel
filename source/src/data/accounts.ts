import { addRefreshAuthToDataProvider, fetchUtils, UpdateParams } from "react-admin";
import { BF_MANAGER_URL, IBaseDataProvider } from "./base";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";
import { API_URL } from "@/data/base";

export class IAccountsDataProvider extends IBaseDataProvider {
    async update(resource: string, params: UpdateParams) {
        const data = params.data;

        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/account/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        console.log(json);

        if (!json.success) {
            throw new Error(json.error);
        }

        return json;
    }

    async fetchBalance(merchantId: string, signal?: AbortSignal | undefined | null) {
        console.log(merchantId);
        console.log(`${API_URL}/accounts/${merchantId}`);
        const url = `${API_URL}/accounts/${merchantId}`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal
        }).then(resp => resp.json());

        return res;
    }

    async createTransfer(data: { address: string; amount: number; accuracy: number }) {
        return fetch(`${BF_MANAGER_URL}/v1/withdraw/create`, {
            method: "POST",
            body: JSON.stringify({
                address: data.address,
                amount: {
                    currency: "USDT",
                    value: {
                        accuracy: data.accuracy,
                        quantity: Math.round(data.amount * data.accuracy)
                    }
                }
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });
    }

    async balanceCount(signal: AbortSignal | null | undefined) {
        const response = await fetch(`${API_URL}/accounts/balance/count`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal
        });

        return response;
    }

    async downloadBalanceReport(url: URL | string) {
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/octet-stream",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });
    }

    async downloadReport(url: URL | string) {
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/octet-stream",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });
    }
}

export const AccountsDataProvider = addRefreshAuthToDataProvider(new IAccountsDataProvider(), updateTokenHelper);
