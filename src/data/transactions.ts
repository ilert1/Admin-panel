import { API_URL, http } from "@/helpers";
import { BaseDataProvider } from "./base";
import { GetOneParams, GetOneResult } from "react-admin";

export class TransactionDataProvider extends BaseDataProvider {
    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await http(`${API_URL}/${resource}/${params.id}`);
        const destId = json?.data?.destination?.id;
        const sourceId = json?.data?.source?.id;
        const dest = await http(`https://juggler.bfgate.api4ftx.cloud/accounts/${destId}`);
        const source = await http(`https://juggler.bfgate.api4ftx.cloud/accounts/${sourceId}`);
        console.log({
            ...json.data,
            destination: { ...json.data.destination, meta: dest.json.data.meta },
            source: { ...json.data.source, meta: source.json.data.meta }
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
