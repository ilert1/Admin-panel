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
import { useState } from "react";
import { useDelete, useRefresh, useTranslate } from "react-admin";

interface DeletePaymentTypeDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    deleteId?: string;
}
export const DeletePaymentTypeDialog = (props: DeletePaymentTypeDialogProps) => {
    const translate = useTranslate();
    const [continueClicked, setContinueClicked] = useState(false);
    const { open, deleteId, onOpenChange = () => {} } = props;
    const [deleteOne] = useDelete();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const handleDelete = async () => {
        await deleteOne(
            "payment_type",
            { id: deleteId },
            {
                onSuccess: async () => {
                    appToast("success", translate("app.ui.delete.deletedSuccessfully"));
                },
                onError: error => {
                    if (error instanceof Error) appToast("error", error.message);
                }
            }
        );
        onOpenChange(false);
        refresh();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[200px] max-w-[400px] overflow-auto bg-muted sm:max-h-[300px]"
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
                            ? translate("resources.paymentSettings.deletion.attentionDescriptionPaymentType")
                            : translate("resources.paymentSettings.deletion.consequencesPaymentType")}
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
