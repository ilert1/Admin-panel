import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    UpdateParams
} from "react-admin";
import { fetchUtils } from "react-admin";

import { BaseDataProvider } from "./base";

const API_URL = import.meta.env.VITE_WALLET_URL;

export class WalletsDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const data: { [key: string]: string } = {
            limit: params.pagination ? params.pagination.perPage.toString() : "10",
            offset: params.pagination ? ((params.pagination.page - 1) * +params.pagination.perPage).toString() : "0"
        };

        if (resource !== "wallet" && resource !== "merchant/wallet") {
            Object.keys(params.filter).forEach(filterItem => {
                data[filterItem] = params.filter[filterItem];
            });
        }

        const paramsStr = new URLSearchParams(data).toString();
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}?${paramsStr}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        if (resource === "reconciliation") {
            return {
                data:
                    json?.data?.map((data: Wallets.WalletLinkedTransactions) => ({
                        ...data,
                        id: data.transaction_id
                    })) || [],
                total: json?.meta?.total || 0
            };
        }

        return {
            data: json?.data || [],
            total: json?.meta?.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const url = `${API_URL}/${resource}/${params.id}`;
        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        if (resource === "reconciliation") {
            return {
                data: {
                    ...json?.data,
                    id: json?.data?.transaction_id
                }
            };
        }

        return {
            data: {
                ...json?.data
            }
        };
    }

    async getWalletBalance(resource: string, id: string): Promise<Wallets.WalletBalance> {
        const { json } = await fetchUtils
            .fetchJson(`${API_URL}/${resource}/${id}/balance`, {
                method: "GET",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            })
            .catch(() => {
                return { json: { success: false } };
            });

        if (!json.success) {
            return {
                usdt_amount: 0,
                trx_amount: 0
            };
        }

        return json?.data;
    }

    async update(resource: string, params: UpdateParams) {
        delete params.data.generatedAt;
        delete params.data.loadedAt;

        const url = `${API_URL}/${resource}/${params.id}`;

        const { json } = await fetchUtils.fetchJson(url, {
            method: "PUT",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: json.data };
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult> {
        const url = `${API_URL}/${resource}`;

        try {
            const { json } = await fetchUtils.fetchJson(url, {
                method: "POST",
                body: JSON.stringify(params.data),
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                if (json.status === 500) {
                    throw new Error(JSON.stringify({ error_message: "Server error" }));
                }
                throw new Error(JSON.stringify(json.error));
            }

            return {
                data: json.data
            };
        } catch (error) {
            if (error instanceof Error) {
                if (error.message) {
                    throw new Error(JSON.stringify({ error_message: error.message }));
                }
            }

            throw new Error(JSON.stringify({ error_message: "Server error" }));
        }
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const url = `${API_URL}/${resource}/${params.id}`;

        const { json } = await fetchUtils.fetchJson(url, {
            method: "DELETE",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: { id: params.id } };
    }
}
