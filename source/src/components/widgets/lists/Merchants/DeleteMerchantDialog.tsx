import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDelete, useRefresh, useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";
interface DeleteMerchantDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
    onCloseSheet?: (state: boolean) => void;
}

export const DeleteMerchantDialog = ({ id, open, onOpenChange, onCloseSheet }: DeleteMerchantDialogProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();
    const appToast = useAppToast();

    const handleDelete = async () => {
        await deleteOne(
            "merchant",
            { id },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    onCloseSheet ? onCloseSheet(false) : "";
                    appToast("success", translate("app.ui.delete.deletedSuccessfully"));
                },
                onError: error => {
                    onOpenChange(false);
                    if (error instanceof Error) appToast("error", error.message);
                    onCloseSheet ? onCloseSheet(false) : "";
                }
            }
        );
        refresh();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[200px] max-w-[251px] overflow-auto bg-muted sm:max-h-[140px]">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.merchant.delete")}</DialogTitle>

                    <DialogDescription />
                </DialogHeader>

                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                        <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>

                        <Button
                            variant={"outline"}
                            className="bg-neutral-0 dark:bg-neutral-100"
                            onClick={() => {
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
