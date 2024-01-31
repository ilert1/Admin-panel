import { GetOneParams, GetOneResult } from "react-admin";
import { BaseDataProvider } from "./base";
import { API_URL, http } from "@/helpers";

export class AccountsDataProvider extends BaseDataProvider {
    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        console.log(params);
        const { json } = await http(`${API_URL}/${resource}/account?id=${params.id}`);
        return { data: json.data };
    }
}
