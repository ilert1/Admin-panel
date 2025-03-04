import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { fetchUtils, HttpError, useGetList, useTranslate } from "react-admin";
import { BF_MANAGER_URL } from "@/data/base";
import { PayOutForm } from "@/components/widgets/forms";

import { NavLink } from "react-router-dom";
import { useFetchCurrencies } from "@/hooks/useFetchCurrencies";
import { PayOutTgBanner } from "@/components/widgets/forms/PayOutTgBanner";
import { useErrorToast } from "@/components/ui/toast/useErrorToast";
import { useSuccessToast } from "@/components/ui/toast/useSuccessToast";

export const PayOutPage = () => {
    const translate = useTranslate();

    const [payoutTgUrl, setPayoutTgUrl] = useState("");

    const errorToast = useErrorToast();
    const successToast = useSuccessToast();

    const { data: accounts } = useGetList("accounts");

    const currency = useMemo(() => accounts?.[0]?.amounts?.[0]?.shop_currency, [accounts]);
    const { data: currencies } = useFetchCurrencies();

    const {
        isLoading: initialLoading,
        isFetching,
        data: payMethods,
        refetch: refetchPayMethods
    } = useQuery<PayOut.Response, unknown, PayOut.PayMethod[] | []>(
        ["paymethods", currency],
        async () => {
            if (currency) {
                const response = await fetch(`${BF_MANAGER_URL}/v1/payout/paymethods?currency=${currency}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                });
                return await response.json();
            }
        },
        {
            select: data => data?.data,
            refetchOnWindowFocus: false
        }
    );

    const [localLoading, setLocalLoading] = useState(false);

    const createPayOut = async (data: { payMethod: PayOut.PayMethod; [key: string]: string | PayOut.PayMethod }) => {
        try {
            const { payMethod, ...rest } = data;
            setLocalLoading(true);

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

            const jsonData = json.json;

            if (!jsonData.success) throw new HttpError(jsonData.error, json.status);

            if (jsonData.data?.meta?.payment_url) {
                setPayoutTgUrl(jsonData.data?.meta?.payment_url);
            } else {
                successToast(
                    <>
                        {translate("app.widgets.forms.payout.successDescription")}:{" "}
                        <NavLink to="/transactions" className="dark:text-green-40 text-green-50">
                            {translate("resources.transactions.name")}
                        </NavLink>
                    </>
                );
            }
            return true;
        } catch (err) {
            if (err instanceof HttpError) {
                if (err.status === 401) errorToast("Unauthorized");
                else {
                    errorToast(err.message);
                    refetchPayMethods();
                }
            }
            return false;
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center md:absolute md:top-0 md:bottom-20 md:left-0 md:right-0">
            {payoutTgUrl ? (
                <PayOutTgBanner url={payoutTgUrl} onClose={() => setPayoutTgUrl("")} />
            ) : (
                <div className="p-[30px] rounded-16 bg-neutral-0 dark:bg-neutral-100 max-w-[700px] w-full md:mx-4">
                    <h1 className="mb-6 text-xl text-center text-neutral-80 dark:text-neutral-30">
                        {translate("app.widgets.forms.payout.title")}
                    </h1>
                    <PayOutForm
                        currencies={currencies?.data}
                        payMethods={payMethods}
                        loading={initialLoading || localLoading || isFetching}
                        create={createPayOut}
                    />
                </div>
            )}
        </div>
    );
};
