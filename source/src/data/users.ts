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
    UpdateParams,
    addRefreshAuthToDataProvider
} from "react-admin";

import { IBaseDataProvider, BF_MANAGER_URL } from "./base";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL;
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM;

class IUsersDataProvider extends IBaseDataProvider {
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
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}?${paramsStr}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
            signal: params.signal || params.filter?.signal
        });
        return {
            data:
                json.data.map((elem: { keycloak_id: string }) => {
                    return {
                        id: elem.keycloak_id,
                        ...elem
                    };
                }) || [],
            total: json?.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}/info/${params.id}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
            signal: params.signal || params.meta?.signal
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: {
                id: json.data.keycloak_id,
                ...json.data
            }
        };
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult> {
        const json = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.json.success) {
            throw new Error(json.json.error);
        }

        return { data: json.json.data };
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

    async updatePassword(resource: string, params: UpdateParams) {
        const json = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}/${params.id}/change-password`, {
            method: "POST",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        const { json: jsonData } = json;

        if (!jsonData.success) {
            throw new Error(jsonData.error);
        }

        return { status: json.status, success: jsonData.success };
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}/${params.id}`, {
            method: "DELETE",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: { id: params.id } };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getRoles(params: GetListParams) {
        const { json } = await fetchUtils.fetchJson(`${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        return json as KecloakRoles[];
    }
}

export const UsersDataProvider = addRefreshAuthToDataProvider(new IUsersDataProvider(), updateTokenHelper);
