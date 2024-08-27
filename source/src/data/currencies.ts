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

export class CurrenciesDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const paramsStr = new URLSearchParams({
            limit: params?.pagination.perPage.toString(),
            offset: ((params?.pagination.page - 1) * +params?.pagination.perPage).toString()
        }).toString();

        const url = `${API_URL}/${resource}/?${paramsStr}`;
        console.log(url);
        const { json } = await fetchUtils.fetchJson(url, {
            method: "GET",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        if (!json?.success) {
            throw new Error(json.error);
        }

        return {
            data:
                json.data.map((elem: { code: any }) => {
                    return {
                        id: elem.code,
                        ...elem
                    };
                }) || [],
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
            data:
                json.data.map((elem: { code: any }) => {
                    return {
                        id: elem.code,
                        ...elem
                    };
                }) || [],
            total: json?.meta.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });
        const destId = json?.data?.destination?.id;
        const sourceId = json?.data?.source?.id;

        const dest = await fetchUtils.fetchJson(`${API_URL}/${resource}/${destId}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        const source = await fetchUtils.fetchJson(`${API_URL}/${resource}/${sourceId}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: {
                id: json.data.code,
                ...json.data,
                destination: { ...json.data.destination, meta: dest.json?.data?.meta || {} },
                source: { ...json.data.source, meta: source.json?.data?.meta || {} }
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
                id: json.data.code,
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
