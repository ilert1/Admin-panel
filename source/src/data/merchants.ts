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

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export class MerchantsDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        // console.log("Getting list");

        const paramsStr = new URLSearchParams({
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
        }).toString();

        const url = `${API_URL}/${resource}?${paramsStr}`;

        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: json.data || [],
            total: json?.meta.total || 0
        };
    }

    async getListWithoutPagination(resource: string) {
        const url = `${API_URL}/${resource}`;
        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: json.data || [],
            total: json?.meta.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        // console.log("Getting one");
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
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

    async create(resource: string, params: CreateParams): Promise<CreateResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
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

    async update(resource: string, params: UpdateParams) {
        delete params.data.generatedAt;
        delete params.data.loadedAt;

        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: {
                id: json.data.name,
                ...json.data
            }
        };
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            method: "DELETE",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: { id: params.id } };
    }
}
