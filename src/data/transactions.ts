import { GetOneParams, GetOneResult } from "react-admin";
import { BaseDataProvider } from "./base";
import { API_URL, http } from "@/helpers";

export class TransactionsDataProvider extends BaseDataProvider {
    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        console.log(params);
        const { json } = await http(`${API_URL}/${resource}/gettrn`, {
            method: "POST",
            body: JSON.stringify({ id: params.id })
        });
        return { data: json };
    }
}
