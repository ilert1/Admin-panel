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
            <DialogContent className="max-h-[200px] max-w-[251px] overflow-auto bg-muted sm:max-h-[140px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{translate("resources.currency.deleteDialogTitle")}</DialogTitle>
                </DialogHeader>

                <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                    <Button onClick={handleDelete} variant="default">
                        {translate("app.ui.actions.delete")}
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="bg-neutral-0 dark:bg-neutral-100">
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </DialogContent>
            <DialogDescription />
        </Dialog>
    );
};
