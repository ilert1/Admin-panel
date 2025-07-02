import { useAppToast } from "@/components/ui/toast/useAppToast";
import { AccountsDataProvider, WalletsDataProvider } from "@/data";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

function isValidTxIDFormat(txID: string) {
    const txIDRegex = /^[a-f0-9]{64}$/i;
    return txIDRegex.test(txID);
}

export const useWalletManualReconciliation = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const translate = useTranslate();
    const refresh = useRefresh();

    const [transactionId, setTransactionId] = useState("");
    const [fiatShow, setFiatShow] = useState(false);
    const [merchantId, setMerchantId] = useState("");
    const [merchantBalanceId, setMerchantBalanceId] = useState("");
    const [merchantAmount, setMerchantAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const appToast = useAppToast();

    const { currencies, isLoadingCurrencies } = useGetCurrencies();

    const { isFetching: balanceFetching, data: merchantBalanceData } = useQuery({
        queryKey: ["accounts", "reconciliation", merchantId],
        queryFn: async ({ signal }) => {
            if (merchantId) return await AccountsDataProvider.fetchBalance(merchantId, signal);
        },
        select(data) {
            const amounts = data?.data?.amounts;

            if (!Array.isArray(amounts) || amounts?.length === 0) {
                return [];
            }

            return amounts
                .map(amount => {
                    const currency = currencies?.find(currency => amount?.currency === currency?.code);

                    if (currency && !currency?.is_coin) {
                        return {
                            id: amount?.id,
                            balance: (+amount?.value?.quantity / +amount?.value?.accuracy).toFixed(
                                currency?.accuracy || 2
                            ),
                            currency: amount?.currency
                        };
                    }
                })
                .filter(notUndefined => notUndefined !== undefined);
        },
        enabled: fiatShow && !!merchantId && !!currencies
    });

    const handleCheckClicked = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            if (fiatShow) {
                const currentBalance = merchantBalanceData?.find(balance => balance?.id === merchantBalanceId);

                if (Number(currentBalance?.balance) < Number(merchantAmount)) {
                    appToast("error", translate("resources.wallet.linkedTransactions.notValidAmount"));
                    return;
                }

                await WalletsDataProvider.manualReconciliation(transactionId, {
                    fiat: true,
                    merchant_id: merchantId,
                    currency: currentBalance?.currency,
                    amount: merchantAmount
                });
            } else {
                await WalletsDataProvider.manualReconciliation(transactionId, {
                    fiat: false
                });
            }
            appToast("success", translate("resources.wallet.linkedTransactions.successFound"));
            refresh();
            onOpenChangeHandler(false);
        } catch (error) {
            if (error instanceof Error)
                appToast("error", error?.message ?? translate("resources.wallet.linkedTransactions.notFound"));
        } finally {
            setIsLoading(false);
        }
    };

    const onOpenChangeHandler = (open: boolean) => {
        setTransactionId("");
        setMerchantId("");
        setMerchantBalanceId("");
        setMerchantAmount("");
        setIsError(false);
        onOpenChange(open);
    };

    const onFiatShowChanged = (state: boolean) => {
        if (!state) {
            setMerchantId("");
            setMerchantBalanceId("");
            setMerchantAmount("");
        }

        setFiatShow(state);
    };

    const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTransactionId(value);

        if (!isValidTxIDFormat(value) && value.length > 0) {
            setIsError(true);
        } else {
            setIsError(false);
        }
    };

    const handleMerchantAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/, "");
        setMerchantAmount(value);
    };

    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        setMerchantBalanceId("");
    };

    return {
        translate,
        fiatShow,
        onFiatShowChanged,
        merchantId,
        onMerchantChanged,
        merchantBalanceId,
        setMerchantBalanceId,
        merchantBalanceData,
        merchantAmount,
        handleMerchantAmountChange,
        transactionId,
        handleTransactionIdChange,
        handleCheckClicked,
        isError,
        isLoading,
        onOpenChangeHandler,
        balanceFetching,
        isLoadingCurrencies
    };
};
