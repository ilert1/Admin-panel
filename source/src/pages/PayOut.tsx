import { useMemo, useState } from "react";
import { HttpError, useDataProvider, useTranslate } from "react-admin";
import { PayOutForm } from "@/components/widgets/forms";

import { NavLink } from "react-router-dom";
import { useFetchCurrencies } from "@/hooks/useFetchCurrencies";
import { PayOutTgBanner } from "@/components/widgets/forms/PayOutTgBanner";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { LoadingBlock } from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { PayoutDataProvider } from "@/data";

export const PayOutPage = () => {
    const translate = useTranslate();

    const [payoutTgUrl, setPayoutTgUrl] = useState("");

    const appToast = useAppToast();
    const dataProvider = useDataProvider();

    const { data: accounts, isLoading: isAccountsLoading } = useQuery({
        queryKey: ["accounts", "getList", "PayOutPage"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList<Account>("accounts", {
                pagination: { perPage: 1, page: 1 },
                filter: { sort: "name", asc: "ASC" },
                signal
            }),
        select: data => data?.data
    });

    const currency = useMemo(() => accounts?.[0]?.amounts?.[0]?.shop_currency, [accounts]);
    const { data: currencies } = useFetchCurrencies();

    const {
        isLoading: initialLoading,
        isFetching,
        data: payMethods,
        refetch: refetchPayMethods
    } = useQuery<PayOut.Response, unknown, PayOut.PayMethod[] | []>({
        queryKey: ["paymethods", "PayOutPage", currency],
        queryFn: async ({ signal }) => {
            if (currency) {
                try {
                    return await PayoutDataProvider.fetchPayMethods({ currency, signal });
                } catch (error) {
                    if (error instanceof Error) {
                        appToast("error", error.message);
                    }
                }
            }
        },
        enabled: !!currency,
        select: data => data?.data,
        refetchOnWindowFocus: false
    });

    const [localLoading, setLocalLoading] = useState(false);

    const createPayOut = async (data: { payMethod: PayOut.PayMethod; [key: string]: string | PayOut.PayMethod }) => {
        setLocalLoading(true);
        try {
            const res = await PayoutDataProvider.createPayout(data);

            if (res.data?.meta?.payment_url) {
                setPayoutTgUrl(res.data?.meta?.payment_url);
            } else {
                appToast(
                    "success",
                    <>
                        {translate("app.widgets.forms.payout.successDescription")}:{" "}
                        <NavLink to="/transactions" className="text-green-50 dark:text-green-40">
                            {translate("resources.transactions.name")}
                        </NavLink>
                    </>
                );
            }
            return true;
        } catch (err) {
            if (err instanceof HttpError) {
                if (err.status === 401) appToast("error", "Unauthorized");
                else {
                    appToast("error", err.message);
                    refetchPayMethods();
                }
            }
            return false;
        } finally {
            setLocalLoading(false);
        }
    };

    const isLoading = useMemo(
        () => isAccountsLoading || initialLoading || localLoading || isFetching || !payMethods,
        [initialLoading, isAccountsLoading, isFetching, localLoading, payMethods]
    );

    return (
        <div className="flex items-center justify-center md:absolute md:bottom-20 md:left-0 md:right-0 md:top-0">
            {payoutTgUrl ? (
                <PayOutTgBanner url={payoutTgUrl} onClose={() => setPayoutTgUrl("")} />
            ) : (
                <div className="w-full max-w-[700px] rounded-16 bg-neutral-0 p-[30px] dark:bg-neutral-100 md:mx-4">
                    <h1 className="mb-6 text-center text-xl text-neutral-80 dark:text-neutral-30">
                        {translate("app.widgets.forms.payout.title")}
                    </h1>

                    {isLoading ? (
                        <div className="h-28">
                            <LoadingBlock />
                        </div>
                    ) : (
                        <>
                            {currency ? (
                                <PayOutForm
                                    currencies={currencies?.data}
                                    payMethods={payMethods}
                                    loading={isLoading}
                                    create={createPayOut}
                                />
                            ) : (
                                <p className="text-center text-lg text-red-40">
                                    {translate("app.widgets.forms.payout.loadingError")}
                                </p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
