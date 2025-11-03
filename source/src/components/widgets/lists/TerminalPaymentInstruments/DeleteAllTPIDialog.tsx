import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalPaymentInstrumentsDataProvider } from "@/data/terminalPaymentInstruments";
import { useState } from "react";
import { useListContext, useRefresh, useTranslate } from "react-admin";

export interface DeleteAllTPIDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    terminalName: string;
    terminalIdClearCallback: () => void;
}
export const DeleteAllTPIDialog = ({
    open,
    onOpenChange,
    terminalName,
    terminalIdClearCallback
}: DeleteAllTPIDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const { data } = useListContext();

    const terminalPaymentInstrumentsDataProvider = new TerminalPaymentInstrumentsDataProvider();

    const [continueClicked, setContinueClicked] = useState(false);

    const handleDelete = async () => {
        if (!data) return;

        try {
            await terminalPaymentInstrumentsDataProvider.bulkDelete({
                terminal_payment_instrument_ids: data.map(item => item.id)
            });

            appToast(
                "success",
                translate("resources.paymentSettings.deletion.terminalPaymentInstrumentDeletedSuccessfully", {
                    terminal: terminalName
                })
            );

            terminalIdClearCallback();
            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[250px] max-w-[270px] overflow-auto bg-muted md:max-w-[350px]"
                onCloseAutoFocus={() => {
                    setContinueClicked(false);
                }}
                onEscapeKeyDown={() => {
                    setContinueClicked(false);
                }}>
                <DialogHeader>
                    <DialogTitle className="text-center !text-display-2 text-red-40 dark:text-red-40">
                        {translate("resources.paymentSettings.deletion.attention")}
                    </DialogTitle>
                    <DialogDescription className="text-center !text-title-1 text-red-400">
                        {!continueClicked
                            ? translate(
                                  "resources.paymentSettings.deletion.attentionDescriptionDeleteAllTerminalPaymentInstruments"
                              )
                            : translate(
                                  "resources.paymentSettings.deletion.consequencesDeleteAllTerminalPaymentInstruments",
                                  {
                                      terminal: terminalName
                                  }
                              )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-4">
                        {!continueClicked ? (
                            <>
                                <Button
                                    className="w-full sm:w-1/2"
                                    variant={"alert"}
                                    onClick={() => setContinueClicked(true)}>
                                    {translate("app.ui.actions.continue")}
                                </Button>
                                <Button className="w-full sm:w-1/2" onClick={() => onOpenChange(false)}>
                                    {translate("app.ui.actions.cancel")}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button className="w-full" onClick={handleDelete} variant={"alert"}>
                                    {translate("app.ui.actions.delete")}
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        onOpenChange(false);
                                        refresh();
                                    }}>
                                    {translate("app.ui.actions.cancel")}
                                </Button>
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
