import { BaseDataProvider } from "./base";
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

const API_URL = import.meta.env.VITE_WALLET_URL;

export class WalletsDataProvider extends BaseDataProvider {
    async getList(
        resource: "wallet" | "transaction" | "merchant/transaction" | "merchant/wallet",
        params: GetListParams
    ): Promise<GetListResult> {
        const data: { [key: string]: string } = {
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
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
        return {
            data: json.data || [],
            total: json?.meta?.total || 0
        };
    }

    async getOne(
        resource: "wallet" | "transaction" | "merchant/transaction" | "merchant/wallet",
        params: GetOneParams
    ): Promise<GetOneResult> {
        const url = `${API_URL}/${resource}/${params.id}`;
        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
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

    async update(resource: "wallet" | "merchant/wallet", params: UpdateParams) {
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

    async create(resource: "wallet" | "merchant/wallet", params: CreateParams): Promise<CreateResult> {
        const url = `${API_URL}/${resource}`;

        const { json } = await fetchUtils.fetchJson(url, {
            method: "POST",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: json.data
        };
    }

    async delete(resource: "wallet" | "merchant/wallet", params: DeleteParams): Promise<DeleteResult> {
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
