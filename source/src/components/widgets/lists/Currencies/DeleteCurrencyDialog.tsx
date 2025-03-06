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
            <DialogContent className="max-w-[251px] max-h-[200px] sm:max-h-[140px] bg-muted overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{translate("resources.currency.deleteDialogTitle")}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-around w-full">
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
