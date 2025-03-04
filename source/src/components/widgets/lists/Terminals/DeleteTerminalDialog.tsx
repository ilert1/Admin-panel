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
import { useErrorToast } from "@/components/ui/toast/useErrorToast";
import { useSuccessToast } from "@/components/ui/toast/useSuccessToast";

interface DeleteProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    deleteId: string;
    provider: string;
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

    const errorToast = useErrorToast();
    const successToast = useSuccessToast();

    const handleDelete = async () => {
        await deleteOne(
            `${provider}/terminal`,
            { id: deleteId },
            {
                onSuccess: async () => {
                    refresh();
                    successToast(translate("app.ui.delete.deletedSuccessfully"));
                },
                onError: err => {
                    if (err instanceof HttpError) errorToast(err.message);
                }
            }
        );
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[251px] max-h-[200px] sm:max-h-[140px] bg-muted overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.terminals.deleteHeader")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-around w-full">
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
