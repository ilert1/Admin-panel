import { addRefreshAuthToDataProvider, fetchUtils } from "react-admin";
import { IBaseDataProvider } from "./base";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";
import { API_URL } from "@/data/base";

export class IAccountsDataProvider extends IBaseDataProvider {
    async fetchBalance(merchantId: string, signal?: AbortSignal | undefined | null) {
        console.log(merchantId);
        console.log(`${API_URL}/accounts/${merchantId}`);
        const url = `${API_URL}/accounts/${merchantId}`;

        const res = await fetchUtils.fetchJson(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal
        });

        console.log(res.json);

        return res.json;
    }
}

export const AccountsDataProvider = addRefreshAuthToDataProvider(new IAccountsDataProvider(), updateTokenHelper);
