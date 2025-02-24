import { useMemo, useState } from "react";
import { useRefresh, useTranslate } from "react-admin";
import { BF_MANAGER_URL, API_URL } from "@/data/base";
import { CryptoTransferForm } from "@/components/widgets/forms";
import { parseJWT } from "@/helpers/jwt";
import { useQuery } from "react-query";
import { TextField } from "@/components/ui/text-field";

interface CryptoTransferProps {
    cryptoTransferState: "process" | "success" | "error";
    setCryptoTransferState: (state: "process" | "success" | "error") => void;
    repeatData: { address: string; amount: number } | undefined;
}
export const CryptoTransfer = ({ repeatData, cryptoTransferState, setCryptoTransferState }: CryptoTransferProps) => {
    const translate = useTranslate();

    const refresh = useRefresh();

    const [message, setMessage] = useState("");

    const merchantId = useMemo(() => {
        const token = localStorage.getItem("access-token");
        if (token) {
            return parseJWT(token)?.merchant_id;
        } else {
            return null;
        }
    }, []);

    const { isLoading: balanceLoading, data: balance } = useQuery(
        "accounts",
        () =>
            fetch(`${API_URL}/accounts/${merchantId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }).then(response => response.json()),
        {
            select(data) {
                const amounts = data.data.amounts;

                if (!Array.isArray(amounts) || amounts.length === 0) {
                    return 0;
                }

                const usdtObject = amounts.find((el: any) => el.currency === "USDT");
                if (usdtObject) {
                    return +usdtObject.value.quantity / +usdtObject.value.accuracy;
                }

                return 0;
            }
        }
    );

    const [localLoading, setLocalLoading] = useState(false);
    const isLoading = useMemo(() => balanceLoading || localLoading, [balanceLoading, localLoading]);

    const createTransfer = (data: { address: string; amount: number; accuracy: number }) => {
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
                    setMessage(translate("app.widgets.forms.cryptoTransfer.transferSuccess"));
                    setCryptoTransferState("success");
                } else {
                    setMessage(json.error ?? translate("resources.withdraw.errors.serverError"));
                    setCryptoTransferState("error");
                }
            })
            .catch(() => {
                setCryptoTransferState("error");
            })
            .finally(() => {
                setLocalLoading(false);
                refresh();
            });
    };

    return (
        <div className="flex flex-col gap-4">
            <TextField className="!text-display-4" text={translate("resources.withdraw.cryptoTransferTitle")} />
            <CryptoTransferForm
                loading={isLoading}
                create={createTransfer}
                balance={balance || 0}
                transferState={cryptoTransferState}
                setTransferState={setCryptoTransferState}
                showMessage={message}
                repeatData={repeatData}
            />
        </div>
    );
};
