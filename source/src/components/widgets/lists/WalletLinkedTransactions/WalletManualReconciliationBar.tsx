import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
import { LoadingBalance } from "@/components/ui/loading";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { WalletsDataProvider } from "@/data";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import { AccountsDataProvider } from "@/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";

function isValidTxIDFormat(txID: string) {
    const txIDRegex = /^[a-f0-9]{64}$/i;
    return txIDRegex.test(txID);
}

export const WalletManualReconciliationBar = () => {
    const translate = useTranslate();
    const refresh = useRefresh();

    const [manualClicked, setManualClicked] = useState(false);
    const [inputVal, setInputVal] = useState("");
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
            const amounts = data.data.amounts;

            if (!Array.isArray(amounts) || amounts.length === 0) {
                return [];
            }

            return amounts
                .map(amount => {
                    const currency = currencies?.find(currency => amount.currency === currency.code);

                    if (currency && !currency.is_coin) {
                        return {
                            id: amount.id,
                            balance: (+amount.value.quantity / +amount.value.accuracy).toFixed(currency?.accuracy || 2),
                            currency: amount.currency
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
                const currentBalance = merchantBalanceData?.find(balance => balance.id === merchantBalanceId);

                if (Number(currentBalance?.balance) < Number(merchantAmount)) {
                    appToast("error", translate("resources.wallet.linkedTransactions.notValidAmount"));
                    return;
                }

                await WalletsDataProvider.manualReconcillation(inputVal, {
                    fiat: true,
                    merchant_id: merchantId,
                    currency: currentBalance?.currency,
                    amount: merchantAmount
                });
            } else {
                await WalletsDataProvider.manualReconcillation(inputVal);
            }
            appToast("success", translate("resources.wallet.linkedTransactions.successFound"));
            refresh();
            setManualClicked(false);
        } catch (error) {
            if (error instanceof Error)
                appToast("error", error.message ?? translate("resources.wallet.linkedTransactions.notFound"));
        } finally {
            setIsLoading(false);
        }
    };

    const onOpenChange = () => {
        setInputVal("");
        setManualClicked(!manualClicked);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputVal(value);

        if (!isValidTxIDFormat(value)) {
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

    return (
        <div className="flex items-end justify-end">
            <Button
                onClick={() => setManualClicked(!manualClicked)}
                className="flex items-center justify-center gap-1 self-end font-normal">
                <span>{translate("resources.wallet.linkedTransactions.manual_reconciliation")}</span>
            </Button>

            <Dialog open={manualClicked} onOpenChange={onOpenChange}>
                <DialogContent
                    disableOutsideClick
                    className="h-auto max-h-80 w-[350px] overflow-hidden rounded-16 xl:max-h-none">
                    <DialogHeader>
                        <DialogTitle>
                            {translate("resources.wallet.linkedTransactions.manual_reconciliation")}
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription />
                    <div className="mb-4 flex flex-col gap-4">
                        <Input
                            id="inputManual"
                            value={inputVal}
                            error={isError}
                            errorMessage={translate("resources.wallet.manage.errors.invalidTransactionId")}
                            onChange={handleChange}
                            label={translate("resources.wallet.linkedTransactions.fields.transactionId")}
                        />

                        <label
                            onClick={() => setFiatShow(!fiatShow)}
                            className="flex cursor-pointer items-center gap-2 self-start [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                            <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-neutral-60 bg-white transition-all dark:bg-black">
                                {fiatShow && <div id="checked" className="h-2.5 w-2.5 rounded-full bg-green-50"></div>}
                            </div>
                            <span className="text-sm font-normal text-neutral-70 transition-all dark:text-neutral-40">
                                {translate("resources.wallet.linkedTransactions.fields.fiatSwitcher")}
                            </span>
                        </label>

                        {fiatShow && (
                            <div className="flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                                <div className="flex flex-1 flex-col gap-1 md:gap-1">
                                    <Label className="mb-0 md:text-nowrap" variant="note-1">
                                        {translate("resources.transactions.filter.filterByAccount")}
                                    </Label>

                                    <MerchantSelectFilter
                                        merchant={merchantId}
                                        onMerchantChanged={onMerchantChanged}
                                        resource="merchant"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col gap-1 md:gap-1">
                                    <Label className="mb-0 md:text-nowrap" variant="note-1">
                                        {translate("resources.wallet.linkedTransactions.fields.merchantBalance")}
                                    </Label>

                                    <Select onValueChange={val => setMerchantBalanceId(val)} value={merchantBalanceId}>
                                        <SelectTrigger
                                            disabled={
                                                !merchantId ||
                                                balanceFetching ||
                                                merchantBalanceData?.length === 0 ||
                                                isLoadingCurrencies
                                            }
                                            className="h-[38px] text-ellipsis">
                                            <SelectValue
                                                placeholder={translate(
                                                    "resources.wallet.linkedTransactions.fields.merchantBalance"
                                                )}
                                            />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {merchantBalanceData &&
                                                merchantBalanceData.map(item => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {`${item.balance} ${item.currency}`}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-1 flex-col gap-1 md:gap-1">
                                    <Input
                                        id="merchantAmount"
                                        disabled={
                                            !merchantId ||
                                            !merchantBalanceId ||
                                            balanceFetching ||
                                            merchantBalanceData?.length === 0 ||
                                            isLoadingCurrencies
                                        }
                                        value={merchantAmount}
                                        onChange={handleMerchantAmountChange}
                                        label={translate("resources.wallet.linkedTransactions.fields.merchantAmount")}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:self-end">
                            <Button
                                onClick={handleCheckClicked}
                                variant="default"
                                className="w-full sm:w-auto"
                                disabled={
                                    !inputVal.length ||
                                    isLoading ||
                                    isError ||
                                    (fiatShow && (!merchantId || !merchantBalanceId || !merchantAmount))
                                }>
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <LoadingBalance className="h-[15px] w-[15px] overflow-hidden" />
                                    </div>
                                ) : (
                                    translate("resources.wallet.linkedTransactions.check")
                                )}
                            </Button>

                            <Button
                                onClick={onOpenChange}
                                variant="outline_gray"
                                type="button"
                                className="w-full sm:w-auto">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
