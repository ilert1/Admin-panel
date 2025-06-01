import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDelete, useRefresh, useTranslate } from "react-admin";
import { useState } from "react";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface DeleteCurrencyDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}

export const DeleteCurrencyDialog = ({ open, id, onOpenChange }: DeleteCurrencyDialogProps) => {
    const translate = useTranslate();
    const [deleteOne] = useDelete();
    const refresh = useRefresh();
    const [deleteClicked, setDeleteClicked] = useState(false);
    const [continueClicked, setContinueClicked] = useState(false);

    const appToast = useAppToast();

    const handleDelete = async () => {
        if (deleteClicked) return;
        setDeleteClicked(true);

        await deleteOne(
            "currency",
            { id },
            {
                onSuccess: () => {
                    appToast("success", translate("app.ui.delete.deletedSuccessfully"));
                    onOpenChange(false);

                    refresh();
                    setDeleteClicked(false);
                },
                onError: () => {
                    appToast("error", translate("resources.currency.errors.alreadyInUse"));
                }
            }
        );
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
                        {translate("resources.paymentTools.deletion.attention")}
                    </DialogTitle>
                    <DialogDescription className="text-center !text-title-1 text-red-400">
                        {!continueClicked
                            ? translate("resources.paymentTools.deletion.attentionDescriptionCurrency")
                            : translate("resources.paymentTools.deletion.consequencesCurrency")}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-4">
                    {!continueClicked ? (
                        <Button className="w-full sm:w-1/2" variant={"alert"} onClick={() => setContinueClicked(true)}>
                            {translate("app.ui.actions.continue")}
                        </Button>
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
            </DialogContent>
            <DialogDescription />
        </Dialog>
    );
};
