import { fetchUtils, GetListParams, GetListResult } from "react-admin";
import { BaseDataProvider, BF_MANAGER_URL } from "./base";

export class UsersDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const paramsStr = new URLSearchParams({
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
        }).toString();
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/${resource}?${paramsStr}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        return {
            data: json.data || [],
            total: json?.total || 0
        };
    }
}
