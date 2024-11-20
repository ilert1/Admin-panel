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
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const user = localStorage.getItem("user");
        let role = "";
        if (user) {
            role = JSON.parse(user).realm_access.roles[2];
        }

        const paramsStr = new URLSearchParams({
            limit: params?.pagination.perPage.toString(),
            offset: ((params?.pagination.page - 1) * +params?.pagination.perPage).toString()
        }).toString();

        const url = `${API_URL}${role === "merchant" ? "/merchant" : ""}/${resource}`;
        console.log(url);
        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data:
                json.data.map((elem: { name: any }) => {
                    return {
                        id: elem.name,
                        ...elem
                    };
                }) || [],
            total: json?.meta.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const user = localStorage.getItem("user");
        let role = "";
        if (user) {
            role = JSON.parse(user).realm_access.roles[2];
        }
        const url = `${API_URL}${role === "merchant" ? "/merchant" : ""}/${resource}/${params.id}`;
        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });
        // TODO:  Не понял зачем эти 2 поля. Пока оставлю как комментарий, потом разберусь

        // const destId = json?.data?.destination?.id;
        // const sourceId = json?.data?.source?.id;

        // const dest = await fetchUtils.fetchJson(`${API_URL}/${resource}/${destId}`, {
        //     user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        // });

        // const source = await fetchUtils.fetchJson(`${API_URL}/${resource}/${sourceId}`, {
        //     user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        // });

        if (!json.success) {
            throw new Error(json.error);
        }

        return {
            data: {
                id: json.data.name,
                ...json.data
                // destination: { ...json.data.destination, meta: dest.json?.data?.meta || {} },
                // source: { ...json.data.source, meta: source.json?.data?.meta || {} }
            }
        };
    }

    async update(resource: string, params: UpdateParams) {
        delete params.data.generatedAt;
        delete params.data.loadedAt;

        const user = localStorage.getItem("user");
        let role = "";
        if (user) {
            role = JSON.parse(user).realm_access.roles[2];
        }
        const url = `${API_URL}${role === "merchant" ? "/merchant" : ""}/${resource}/${params.id}`;

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
        const user = localStorage.getItem("user");
        let role = "";
        if (user) {
            role = JSON.parse(user).realm_access.roles[2];
        }
        const url = `${API_URL}${role === "merchant" ? "/merchant" : ""}/${resource}`;

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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const user = localStorage.getItem("user");
        let role = "";
        if (user) {
            role = JSON.parse(user).realm_access.roles[2];
        }
        const url = `${API_URL}${role === "merchant" ? "/merchant" : ""}/${resource}/${params.id}`;

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
