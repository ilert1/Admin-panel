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

export interface DeleteDirectionDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange: (state: boolean) => void;
}
export const DeleteDirectionDialog = (props: DeleteDirectionDialogProps) => {
    const { open, id, onOpenChange, onQuickShowOpenChange } = props;

    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteOne] = useDelete();

    const handleDelete = () => {
        const deleteElem = async () => {
            try {
                await deleteOne("direction", {
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
                        {translate("resources.providers.deleteProviderQuestion")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-around w-full">
                        <Button onClick={() => handleDelete}>{translate("app.ui.actions.delete")}</Button>
                        <Button
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
