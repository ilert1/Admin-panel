import { addRefreshAuthToDataProvider, fetchUtils, HttpError } from "react-admin";
import { IBaseDataProvider } from "./base";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";
import { BF_MANAGER_URL } from "@/data/base";

export class IPayoutDataProvider extends IBaseDataProvider {
    async fetchPayMethods(params: { currency: string; signal: AbortSignal | null | undefined }) {
        const { currency, signal } = params;

        const response = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/v1/payout/paymethods?currency=${currency}`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
            signal
        });

        return await response.json;
    }
    async createPayout(data: { payMethod: PayOut.PayMethod; [key: string]: string | PayOut.PayMethod }) {
        const { payMethod, ...rest } = data;

        const json = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/v1/payout/create`, {
            method: "POST",
            body: JSON.stringify({
                destination: {
                    amount: {
                        currency: payMethod.fiatCurrency,
                        value: {
                            quantity: +rest.value * 100,
                            accuracy: 100
                        }
                    },
                    requisites: [
                        {
                            bank_name: payMethod.bank,
                            ...Object.fromEntries(Object.entries(rest).filter(([key]) => key !== "value"))
                        }
                    ]
                },
                meta: {
                    payment_type: payMethod.paymentType
                }
            }),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.json.success) throw new HttpError(json.json.error, json.status);

        return json.json;
    }
}

export const PayoutDataProvider = addRefreshAuthToDataProvider(new IPayoutDataProvider(), updateTokenHelper);
