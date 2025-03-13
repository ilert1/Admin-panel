import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input/input";
import { LoadingBalance } from "@/components/ui/loading";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useState } from "react";
import { fetchUtils, useRefresh, useTranslate } from "react-admin";

const WALLET_URL = import.meta.env.VITE_WALLET_URL;

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
            const { json } = await fetchUtils.fetchJson(`${WALLET_URL}/reconciliation/${inputVal}`, {
                method: "POST",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                appToast(
                    "error",
                    json.error.error_message ?? translate("resources.wallet.linkedTransactions.notFound")
                );
            } else {
                appToast("success", translate("resources.wallet.linkedTransactions.successFound"));
                refresh();
                setManualClicked(false);
            }
        } catch (error) {
            appToast("error", translate("resources.wallet.linkedTransactions.notFound"));
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
        <div className="flex justify-end items-end">
            <Button
                onClick={() => setManualClicked(!manualClicked)}
                className="flex items-center justify-center gap-1 font-normal self-end">
                <span>{translate("resources.wallet.linkedTransactions.manual_reconciliation")}</span>
            </Button>

            <Dialog open={manualClicked} onOpenChange={onOpenChange}>
                <DialogContent
                    disableOutsideClick
                    className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[300px] mx-2 !overflow-y-auto rounded-[0] md:rounded-[16px]">
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

                        <div className="flex flex-col sm:self-end sm:flex-row items-center gap-4">
                            <Button
                                onClick={handleCheckCLicked}
                                variant="default"
                                className="w-full sm:w-auto"
                                disabled={!inputVal.length || isLoading || isError}>
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <LoadingBalance className="w-[15px] h-[15px] overflow-hidden" />
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
