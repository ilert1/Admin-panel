import { addRefreshAuthToDataProvider } from "react-admin";
import { IBaseDataProvider } from "./base";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";

export class IWithdrawDataProvider extends IBaseDataProvider {
    async downloadReport(url: URL | string) {
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/octet-stream",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });
    }
}

export const WithdrawDataProvider = addRefreshAuthToDataProvider(new IWithdrawDataProvider(), updateTokenHelper);
