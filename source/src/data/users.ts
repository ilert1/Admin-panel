import {
    CreateParams,
    CreateResult,
    fetchUtils,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult
} from "react-admin";
import { BaseDataProvider, BF_MANAGER_URL } from "./base";

export class UsersDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const data: any = {
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
        };
        if (params.filter.id) {
            data["id"] = params.filter.id;
        }
        if (params.filter.user) {
            data["userId"] = params.filter.user;
        }
        if (params.filter.isActive) {
            data["active"] = params.filter.isActive;
        }
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
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });

        return {
            data: json.data
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
}
