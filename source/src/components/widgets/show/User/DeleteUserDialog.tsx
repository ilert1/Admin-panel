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

export interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange: (state: boolean) => void;
}
export const DeleteUserDialog = ({ open, id, onOpenChange, onQuickShowOpenChange }: DeleteUserDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteOne] = useDelete();

    const appToast = useAppToast();

    const handleDelete = () => {
        const deleteElem = async () => {
            try {
                await deleteOne("users", {
                    id
                });
                appToast("success", translate("resources.users.deleteMessages.deleteSuccess"));
                onOpenChange(false);
                refresh();
                onQuickShowOpenChange(false);
            } catch (error) {
                appToast("error", translate("resources.users.deleteMessages.deleteError"));
            }
        };
        deleteElem();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[253px] px-[24px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.users.deleteThisUser")}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-around gap-[35px] w-full">
                        <Button onClick={() => handleDelete()}>{translate("app.ui.actions.delete")}</Button>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="!ml-0 px-3 bg-neutral-0 dark:bg-neutral-100">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
