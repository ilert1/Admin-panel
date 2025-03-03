import { GetListParams, GetListResult } from "react-admin";
import { fetchUtils } from "react-admin";

import { BaseDataProvider } from "./base";

const API_URL = import.meta.env.VITE_API_URL;

export class OperationsDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const paramsStr = new URLSearchParams({
            limit: params?.pagination.perPage.toString(),
            offset: ((params?.pagination.page - 1) * +params?.pagination.perPage).toString()
        }).toString();

        const url = `${API_URL}/${resource}?${paramsStr}&accountId=${params.filter.accountId}`;

        const { json } = await fetchUtils.fetchJson(url, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        if (!json?.success) {
            throw new Error(json.error);
        }

        return {
            data:
                json.data.map((elem: { transaction_id: string }) => {
                    return {
                        id: elem.transaction_id,
                        ...elem
                    };
                }) || [],
            total: json.total || 0
        };
    }
}
