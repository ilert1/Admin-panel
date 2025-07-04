import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
import { LoadingBalance } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWalletManualReconciliation } from "./useWalletManualReconciliation";
import { MerchantSelect } from "@/components/widgets/components/Selects/MerchantSelect";

interface IWalletManualReconciliationBar {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const WalletManualReconciliationDialog = ({ open, onOpenChange }: IWalletManualReconciliationBar) => {
    const {
        translate,
        fiatShow,
        onFiatShowChanged,
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
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
    } = useWalletManualReconciliation({ onOpenChange });

    return (
        <Dialog open={open} onOpenChange={onOpenChangeHandler}>
            <DialogContent
                disableOutsideClick
                className="h-auto max-h-80 w-[350px] overflow-hidden rounded-16 xl:max-h-none">
                <DialogHeader>
                    <DialogTitle>{translate("resources.wallet.linkedTransactions.manual_reconciliation")}</DialogTitle>
                </DialogHeader>

                <DialogDescription />
                <div className="mb-4 flex flex-col gap-4">
                    <Input
                        id="inputManual"
                        value={transactionId}
                        error={isError}
                        errorMessage={translate("resources.wallet.manage.errors.invalidTransactionId")}
                        onChange={handleTransactionIdChange}
                        label={translate("resources.wallet.linkedTransactions.fields.transactionId")}
                    />

                    <label
                        onClick={() => {
                            if (!isLoading) onFiatShowChanged(!fiatShow);
                        }}
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
                            <div className="flex flex-1 flex-col gap-1 md:min-w-72 md:gap-1">
                                <Label className="mb-0 md:text-nowrap" variant="note-1">
                                    {translate("resources.transactions.filter.filterByAccount")}
                                </Label>

                                <MerchantSelect
                                    merchants={merchantData || []}
                                    value={merchantValue}
                                    onChange={setMerchantValue}
                                    setIdValue={onMerchantChanged}
                                    disabled={merchantsLoadingProcess}
                                    isLoading={merchantsLoadingProcess}
                                    style="Black"
                                    modal
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
                                !transactionId.length ||
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
                            onClick={() => onOpenChangeHandler(false)}
                            variant="outline_gray"
                            type="button"
                            className="w-full sm:w-auto">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
