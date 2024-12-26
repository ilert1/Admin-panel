import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingBalance } from "@/components/ui/loading";
import { useState } from "react";
import { fetchUtils, useRefresh, useTranslate } from "react-admin";
import { toast } from "sonner";

const WALLET_URL = import.meta.env.VITE_WALLET_URL;

export const WalletManualReconciliationBar = () => {
    const translate = useTranslate();
    const refresh = useRefresh();

    const [manualClicked, setManualClicked] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckCLicked = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const { json } = await fetchUtils.fetchJson(`${WALLET_URL}/reconciliation/${inputVal}`, {
                method: "POST",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                toast.error("Error", {
                    description: json.error.error_message ?? translate("resources.wallet.linkedTransactions.notFound"),
                    dismissible: true,
                    duration: 3000
                });
            } else {
                toast.error("Success", {
                    description: translate("resources.wallet.linkedTransactions.successFound"),
                    dismissible: true,
                    duration: 3000
                });
                refresh();
                setManualClicked(false);
            }
        } catch (error) {
            toast.error("Error", {
                description: translate("resources.wallet.linkedTransactions.notFound"),
                dismissible: true,
                duration: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onOpenChange = () => {
        setInputVal("");
        setManualClicked(!manualClicked);
    };

    return (
        <div className="flex justify-end items-end mb-6">
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
                        <div>
                            <Label htmlFor="inputManual">
                                {translate("resources.wallet.linkedTransactions.fields.transactionId")}
                            </Label>

                            <Input
                                id="inputManual"
                                value={inputVal}
                                onChange={e => setInputVal(e.target.value)}
                                className="shadow-1"
                            />
                        </div>

                        <div className="flex flex-col sm:self-end sm:flex-row items-center gap-4">
                            <Button
                                onClick={handleCheckCLicked}
                                variant="default"
                                className="w-full sm:w-auto"
                                disabled={!inputVal.length || isLoading}>
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
                                variant="deleteGray"
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
