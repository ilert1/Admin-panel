import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { HttpError, useDelete, useRefresh, useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface DeleteProviderDialogProps {
    deleteId: string;
    provider: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const DeleteTerminalDialog = ({
    open,
    deleteId,
    provider,
    onOpenChange = () => {}
}: DeleteProviderDialogProps) => {
    const translate = useTranslate();
    const [deleteOne] = useDelete();
    const refresh = useRefresh();

    const appToast = useAppToast();

    const handleDelete = async () => {
        await deleteOne(
            `${provider}/terminal`,
            { id: deleteId },
            {
                onSuccess: async () => {
                    refresh();
                    appToast("success", translate("app.ui.delete.deletedSuccessfully"));
                },
                onError: err => {
                    if (err instanceof HttpError) appToast("error", err.message);
                }
            }
        );
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[200px] max-w-[251px] overflow-auto bg-muted sm:max-h-[140px]">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.terminals.deleteHeader")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                        <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>
                        <Button
                            className="bg-neutral-0 dark:bg-neutral-100"
                            variant={"outline"}
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
