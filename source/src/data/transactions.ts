import { addRefreshAuthToDataProvider, GetListParams, GetListResult, GetOneParams, GetOneResult } from "react-admin";
import { fetchUtils } from "react-admin";

import { IBaseDataProvider } from "./base";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";

const API_URL = import.meta.env.VITE_API_URL;
const MONEYGATE_URL = import.meta.env.VITE_MONEYGATE_URL;

export class ITransactionDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const data: { [key: string]: string } = {
            limit: params.pagination ? params.pagination.perPage.toString() : "10",
            offset: params.pagination ? ((params.pagination.page - 1) * +params.pagination.perPage).toString() : "0"
        };

        Object.keys(params.filter).forEach(filterItem => {
            if (filterItem !== "signal") {
                data[filterItem] = params.filter[filterItem];
            }
        });

        const paramsStr = new URLSearchParams(data).toString();
        const url = `${API_URL}/${resource}?${paramsStr}`;
        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
            signal: params.signal || params.filter?.signal
        });
        return {
            data: json.data || [],
            total: json?.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
            signal: params.signal || params.meta?.signal
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: {
                ...json.data
            }
        };
    }

    async switchDispute(record: Transaction.Transaction) {
        return fetch(`${API_URL}/trn/dispute`, {
            method: "POST",
            body: JSON.stringify({ id: record?.id, dispute: !record?.dispute }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(resp => resp.json());
    }

    async switchState(state: number, record: Transaction.Transaction) {
        return fetch(`${API_URL}/trn/man_set_state`, {
            method: "POST",
            body: JSON.stringify({ id: record?.id, state }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(resp => resp.json());
    }

    async commitTransaction(record: Transaction.Transaction) {
        return fetch(`${API_URL}/trn/commit`, {
            method: "POST",
            body: JSON.stringify({ id: record?.id }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(resp => resp.json());
    }

    async sendWebhookHandler(record: Transaction.Transaction) {
        return fetch(`${MONEYGATE_URL}/send-callback?id=${record?.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json());
    }

    async syncronize(txId: string) {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/transactions/restore`, {
            headers: new Headers({
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }),
            body: JSON.stringify({
                id: txId
            }),
            method: "POST"
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: {
                ...json.data
            }
        };
    }

    async getTransactionCallbackHistory(txId: string) {
        const { json } = await fetchUtils.fetchJson(`${MONEYGATE_URL}/callback_history/${txId}`, {
            headers: new Headers({
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }),
            method: "GET"
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: {
                ...json.data
            }
        };
    }
}

export const TransactionDataProvider = addRefreshAuthToDataProvider(new ITransactionDataProvider(), updateTokenHelper);
