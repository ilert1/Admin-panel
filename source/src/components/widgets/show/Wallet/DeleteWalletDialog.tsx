import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDelete, useRefresh, useTranslate } from "react-admin";

export interface DeleteWalletDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange: (state: boolean) => void;
}
export const DeleteWalletDialog = (props: DeleteWalletDialogProps) => {
    const { open, id, onOpenChange, onQuickShowOpenChange } = props;

    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteOne] = useDelete();

    const handleDelete = () => {
        const deleteElem = async () => {
            try {
                await deleteOne("wallet", {
                    id
                });
                refresh();
                onQuickShowOpenChange(false);
            } catch (error) {
                // Заглушка
            }
        };
        deleteElem();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[251px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.wallet.manage.deleteWallet")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-around w-full">
                        <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>
                        <Button
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
