import { ReactNode, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useGetList, useTranslate } from "react-admin";
import { BF_MANAGER_URL, API_URL } from "@/data/base";
import { PayOutForm } from "@/components/widgets/forms";
import { toast } from "sonner";
import { NavLink } from "react-router-dom";

export const PayOutPage = () => {
    const translate = useTranslate();

    const success = (message: ReactNode) => {
        toast.success(translate("app.widgets.forms.payout.successTitle"), {
            dismissible: true,
            description: message,
            duration: 5000
        });
    };

    const error = (message: string) => {
        toast.error(translate("app.widgets.forms.payout.errorTitle"), {
            dismissible: true,
            description: message,
            duration: 3000
        });
    };

    const { data: accounts } = useGetList("accounts");

    const currency = useMemo(() => accounts?.[0]?.amounts?.[0]?.shop_currency, [accounts]);

    const { data: currencies } = useQuery<{ data: Dictionaries.Currency[] }>("currencies", () =>
        fetch(`${API_URL}/dictionaries/curr`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const { isLoading: initialLoading, data: payMethods } = useQuery<PayOut.Response, unknown, PayOut.PayMethod[] | []>(
        ["paymethods", currency],
        () => {
            return fetch(`${BF_MANAGER_URL}/v1/payout/paymethods?currency=${currency}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }).then(response => response.json());
        },
        {
            select: data => data?.data || []
        }
    );

    const [localLoading, setLocalLoading] = useState(false);
    const isLoading = useMemo(() => initialLoading || localLoading, [initialLoading, localLoading]);

    const createPayOut = (data: { payMethod: PayOut.PayMethod; [key: string]: string | PayOut.PayMethod }) => {
        const { payMethod, ...rest } = data;
        setLocalLoading(true);

        fetch(`${BF_MANAGER_URL}/v1/payout/create`, {
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
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json.success) {
                    success(
                        <>
                            {translate("app.widgets.forms.payout.successDescription")}:{" "}
                            <NavLink to="/transactions" className="dark:text-green-40 text-green-50">
                                {translate("resources.transactions.name")}
                            </NavLink>
                        </>
                    );
                } else {
                    error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                error(e.message);
            })
            .finally(() => {
                setLocalLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center md:absolute md:top-0 md:bottom-20 md:left-0 md:right-0">
            <div className="p-[30px] rounded-16 bg-neutral-0 max-w-[700px] w-full md:mx-4">
                <h1 className="mb-6 text-xl text-center">{translate("app.widgets.forms.payout.title")}</h1>

                <PayOutForm
                    currencies={currencies?.data}
                    payMethods={payMethods}
                    loading={isLoading}
                    create={createPayOut}
                />
            </div>
        </div>
    );
};
