import { BaseDataProvider } from "./base";
import { GetListParams, GetListResult, GetOneParams, GetOneResult } from "react-admin";
import { fetchUtils } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL;

export class TransactionDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const data: any = {
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
        };

        Object.keys(params.filter).forEach(filterItem => {
            data[filterItem] = params.filter[filterItem];
        });

        const paramsStr = new URLSearchParams(data).toString();
        const url = `${API_URL}/${resource}?${paramsStr}`;
        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        // console.log(json);
        return {
            data: json.data || [],
            total: json?.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });
        return {
            data: {
                ...json.data
            }
        };
    }
}
