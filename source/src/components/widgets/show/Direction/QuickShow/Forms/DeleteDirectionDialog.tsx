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
            <DialogContent className="max-w-[251px] max-h-[200px] sm:max-h-[140px] bg-muted overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.direction.deleteDirection")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-around w-full">
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
