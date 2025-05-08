import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input/input";
import { LoadingBalance } from "@/components/ui/loading";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { WalletsDataProvider } from "@/data";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

function isValidTxIDFormat(txID: string) {
    const txIDRegex = /^[a-f0-9]{64}$/i;
    return txIDRegex.test(txID);
}

export const WalletManualReconciliationBar = () => {
    const translate = useTranslate();
    const refresh = useRefresh();

    const [manualClicked, setManualClicked] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const appToast = useAppToast();

    const handleCheckCLicked = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await WalletsDataProvider.manualReconcillation(inputVal);
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

                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:self-end">
                            <Button
                                onClick={handleCheckCLicked}
                                variant="default"
                                className="w-full sm:w-auto"
                                disabled={!inputVal.length || isLoading || isError}>
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
