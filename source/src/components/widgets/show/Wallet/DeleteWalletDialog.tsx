import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDelete, usePermissions, useRefresh, useTranslate } from "react-admin";

export interface DeleteWalletDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange: (state: boolean) => void;
}
export const DeleteWalletDialog = (props: DeleteWalletDialogProps) => {
    const { open, id, onOpenChange, onQuickShowOpenChange } = props;
    const { permissions } = usePermissions();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteOne] = useDelete();

    const deleteElem = async () => {
        try {
            await deleteOne(permissions === "admin" ? "wallet" : "merchant/wallet", {
                id
            });
            refresh();
            onQuickShowOpenChange(false);
        } catch (error) {
            // Заглушка
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[270px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.wallet.manage.deleteWallet")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full justify-around">
                        <Button onClick={deleteElem}>{translate("app.ui.actions.delete")}</Button>
                        <Button
                            className="bg-neutral-0 dark:bg-neutral-100"
                            variant={"outline"}
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
