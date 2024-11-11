import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    fetchUtils,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    UpdateParams
} from "react-admin";
import { BaseDataProvider, BF_MANAGER_URL } from "./base";

export class UsersDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const data: any = {
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
        };

        Object.keys(params.filter).forEach(filterItem => {
            data[filterItem] = params.filter[filterItem];
        });

        const paramsStr = new URLSearchParams(data).toString();
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}?${paramsStr}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        return {
            data: json.data || [],
            total: json?.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const json = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });
        if (!json.json.success) {
            throw new Error(json.json);
        }

        return {
            data: json.json.data
        };
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult> {
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        return { data: json.data };
    }

    async update(resource: string, params: UpdateParams) {
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: json.data };
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}/${params.id}`, {
            method: "DELETE",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        console.log(json);
        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: { id: params.id } };
    }
}
