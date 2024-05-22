import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { BF_MANAGER_URL } from "@/data/base";
import { PayOutCryptoForm } from "@/components/widgets/forms";
import { toast } from "sonner";

export const PayOutCryptoPage = () => {
    const translate = useTranslate();
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

    const [localLoading, setLocalLoading] = useState(false);
    const isLoading = useMemo(() => localLoading, [localLoading]);

    const createPayOut = (data: any) => {
        setLocalLoading(true);
        fetch(`${BF_MANAGER_URL}/v1/withdraw/create`, {
            method: "POST",
            body: JSON.stringify({
                address: data.address,
                amount: {
                    currency: "USDT",
                    value: {
                        accuracy: data.accuracy,
                        quantity: +data.amount * data.accuracy
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
                setLocalLoading(false);
            });
    };

    return (
        <div>
            <PayOutCryptoForm loading={isLoading} create={createPayOut} />
        </div>
    );
};
