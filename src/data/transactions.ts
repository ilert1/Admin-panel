import { BaseDataProvider } from "./base";
import { GetOneParams, GetOneResult } from "react-admin";
import { fetchUtils } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL;

export class TransactionDataProvider extends BaseDataProvider {
    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });
        const destId = json?.data?.destination?.id;
        const sourceId = json?.data?.source?.id;
        const dest = await fetchUtils.fetchJson(`${API_URL}/accounts/${destId}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });
        const source = await fetchUtils.fetchJson(`${API_URL}/accounts/${sourceId}`, {
            user: { authenticated: true, token: localStorage.getItem("access-token") as string }
        });
        return {
            data: {
                ...json.data,
                destination: { ...json.data.destination, meta: dest.json.data.meta },
                source: { ...json.data.source, meta: source.json.data.meta }
            }
        };
    }
}
