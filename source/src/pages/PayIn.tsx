import { useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { usePermissions, useRedirect, useRefresh, useTranslate } from "react-admin";
import { API_URL, BF_MANAGER_URL } from "@/data/base";
import { PayInForm } from "@/components/widgets/forms";
import { EventBus, EVENT_PAYIN } from "@/helpers/event-bus";
import { toast } from "sonner";

export const PayInPage = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const redirect = useRedirect();
    const refresh = useRefresh();

    const success = (message: string) => {
        toast.success(translate("resources.transactions.show.success"), {
            dismissible: true,
            description: message,
            duration: 3000
        });
    };

    const error = (message: string) => {
        toast.error(translate("resources.transactions.show.error"), {
            dismissible: true,
            description: message,
            duration: 3000
        });
    };

    const { data: accounts } = useQuery("accounts", () =>
        fetch(`${API_URL}/accounts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const { data: currencies } = useQuery("currencies", () =>
        fetch(`${API_URL}/dictionaries/curr`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    useEffect(() => {
        if (!adminOnly) {
            redirect("/");
        }
    }, [adminOnly]); //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        EventBus.getInstance().registerUnique(
            EVENT_PAYIN,
            (data: {
                source: string;
                sourceValue: string;
                sourceCurrency: string;
                dest: string;
                destValue: string;
                destCurrency: string;
            }) => {
                fetch(`${BF_MANAGER_URL}/v1/payin/create`, {
                    method: "POST",
                    body: JSON.stringify({
                        source: {
                            id: data.source,
                            amount: {
                                currency: data.sourceCurrency,
                                value: {
                                    quantity: +data.sourceValue * 100,
                                    accuracy: 100
                                }
                            }
                        },
                        destination: {
                            id: data.dest,
                            amount: {
                                currency: data.destCurrency,
                                value: {
                                    quantity: +data.destValue * 100,
                                    accuracy: 100
                                }
                            }
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
                            success(translate("resources.transactions.show.success"));
                        } else {
                            error(json.error || "Unknown error");
                        }
                    })
                    .catch(e => {
                        error(e.message);
                    })
                    .finally(() => {
                        refresh();
                    });
            }
        );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <PayInForm accounts={accounts?.data || []} currencies={currencies?.data || []} />
        </div>
    );
};
