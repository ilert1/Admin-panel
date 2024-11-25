import {
    CreateParams,
    CreateResult,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    UpdateManyResult,
    UpdateParams,
    GetManyReferenceParams
} from "react-admin";
import { fetchUtils } from "react-admin";

export const API_URL = import.meta.env.VITE_API_URL;
export const BF_MANAGER_URL = import.meta.env.VITE_BF_MANAGER_URL;

export class BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const data: any = {
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
        };

        Object.keys(params.filter).forEach(filterItem => {
            data[filterItem] = params.filter[filterItem];
        });
        const paramsStr = new URLSearchParams(data).toString();

        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}?${paramsStr}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        return {
            data: json.data || [],
            total: json?.total || 0
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
            data: json.data,
            total: json?.meta?.total || json.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        return { data: json.data };
    }

    async update(resource: string, params: UpdateParams) {
        delete params.data.generatedAt;
        delete params.data.loadedAt;
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
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
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        return { data: json };
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

    async getMany(): Promise<GetManyResult> {
        throw new Error("Method not implemented");
    }
    async getManyReference(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}/history`, {
            method: "GET",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        return { data: json?.data || [], total: json?.data?.length || 0 };
    }

    async updateMany(): Promise<UpdateManyResult> {
        throw new Error("Method not implemented");
    }

    async deleteMany(): Promise<DeleteManyResult> {
        throw new Error("Method not implemented");
    }

    async getDictionaries(): Promise<any> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/dictionaries`, {
            method: "GET",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        return json?.data;
    }
}
