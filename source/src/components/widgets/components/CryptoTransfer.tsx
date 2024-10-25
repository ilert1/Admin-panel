import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { BF_MANAGER_URL, API_URL } from "@/data/base";
import { CryptoTransferForm } from "@/components/widgets/forms";
import { parseJWT } from "@/helpers/jwt";
import { useQuery } from "react-query";

export const CryptoTransfer = () => {
    const translate = useTranslate();
    const [transferState, setTransferState] = useState<"process" | "success" | "error">("process");

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
                return +value.quantity / +value.accuracy;
            }
        }
    );

    const [localLoading, setLocalLoading] = useState(false);
    const isLoading = useMemo(() => balanceLoading || localLoading, [balanceLoading, localLoading]);

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
                    setTransferState("success");
                } else {
                    setTransferState("error");
                }
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
            />
        </div>
    );
};
