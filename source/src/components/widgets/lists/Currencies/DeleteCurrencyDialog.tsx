import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDelete, useRefresh, useTranslate } from "react-admin";

interface DeleteCurrencyDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}

export const DeleteCurrencyDialog = ({ open, id, onOpenChange }: DeleteCurrencyDialogProps) => {
    const translate = useTranslate();
    const [deleteOne] = useDelete();
    const refresh = useRefresh();

    const handleDelete = async () => {
        await deleteOne(
            "currency",
            { id },
            {
                onSuccess: () => {
                    toast.success("Success", {
                        description: translate("app.ui.delete.deletedSuccessfully"),
                        dismissible: true,
                        duration: 3000
                    });

                    onOpenChange(false);
                    refresh();
                },
                onError: () => {
                    toast.error("Error", {
                        description: translate("resources.currency.errors.alreadyInUse"),
                        dismissible: true,
                        duration: 3000
                    });
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
                        variant="secondary"
                        className="border border-green-50 rounded-4 hover:border-green-40">
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </DialogContent>
            <DialogDescription />
        </Dialog>
    );
};
