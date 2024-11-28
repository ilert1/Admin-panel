import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { BF_MANAGER_URL, API_URL } from "@/data/base";
import { CryptoTransferForm } from "@/components/widgets/forms";
import { parseJWT } from "@/helpers/jwt";
import { useQuery } from "react-query";

export const CryptoTransfer = () => {
    const translate = useTranslate();
    const [transferState, setTransferState] = useState<"process" | "success" | "error">("process");

    const [message, setMessage] = useState("");
    const merchantId = useMemo(() => {
        const token = localStorage.getItem("access-token");
        if (token) {
            return parseJWT(token)?.merchant_id;
        } else {
            return null;
        }
    }, []);

    const {
        isLoading: balanceLoading,
        data: balance,
        refetch
    } = useQuery(
        "accounts",
        () =>
            fetch(`${API_URL}/accounts/${merchantId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }).then(response => response.json()),
        {
            select(data) {
                const value = data?.data?.amounts?.[0]?.value;
                if (!value) return 0;
                return +value.quantity / +value.accuracy;
            }
        }
    );

    const [localLoading, setLocalLoading] = useState(false);
    const isLoading = useMemo(() => balanceLoading || localLoading, [balanceLoading, localLoading]);

    // Может понадобится потом, пока оставлю
    // const errorMessagesMap: Record<string, string> = {
    //     low_amount: translate("resources.withdraw.errors.lowAmountError"),
    //     default: translate("resources.withdraw.errors.serverError")
    // };

    const getMessage = (json: any) => {
        if (json.success) {
            return translate("app.widgets.forms.cryptoTransfer.transferSuccess");
        }
        if (json.error) {
            return json.error;
        }
        return translate("resources.withdraw.errors.serverError");
    };

    const createTransfer = (data: any) => {
        setLocalLoading(true);
        fetch(`${BF_MANAGER_URL}/v1/withdraw/create`, {
            method: "POST",
            body: JSON.stringify({
                address: data.address,
                amount: {
                    currency: "USDT",
                    value: {
                        accuracy: data.accuracy,
                        quantity: Math.round(data.amount * data.accuracy)
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
                    setMessage(getMessage(json));
                    setTransferState("success");
                } else {
                    setMessage(getMessage(json));
                    setTransferState("error");
                }
            })
            .catch(() => {
                setTransferState("error");
            })
            .finally(() => {
                setLocalLoading(false);
                refetch();
            });
    };

    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-display-4 text-neutral-100">{translate("resources.withdraw.cryptoTransferTitle")}</h4>
            <CryptoTransferForm
                loading={isLoading}
                create={createTransfer}
                balance={balance || 0}
                transferState={transferState}
                setTransferState={setTransferState}
                showMessage={message}
            />
        </div>
    );
};
