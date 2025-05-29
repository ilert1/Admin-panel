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
import { useDelete, useRefresh, useTranslate } from "react-admin";

interface DeletePaymentInstrumentDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    deleteId?: string;
}
export const DeletePaymentInstrumentDialog = (props: DeletePaymentInstrumentDialogProps) => {
    const translate = useTranslate();
    const { open, deleteId, onOpenChange = () => {} } = props;
    const [deleteOne] = useDelete();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const handleDelete = async () => {
        await deleteOne(
            "systemPaymentInstruments",
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
            <DialogContent className="max-h-[220px] max-w-[270px] overflow-auto bg-muted sm:max-h-[180px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.paymentTools.systemPaymentInstruments.deletePaymentInstrumentQuestion")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                        <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>
                        <Button
                            variant={"outline"}
                            className="bg-neutral-0 dark:bg-neutral-100"
                            onClick={() => {
                                onOpenChange(false);
                                refresh();
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
