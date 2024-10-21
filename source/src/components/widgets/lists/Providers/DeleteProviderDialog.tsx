import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDelete, useRefresh, useTranslate } from "react-admin";

interface DeleteProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    deleteId?: string;
}
export const DeleteProviderDialog = (props: DeleteProviderDialogProps) => {
    const translate = useTranslate();
    const { open, deleteId, onOpenChange = () => {} } = props;
    const [deleteOne] = useDelete();
    const refresh = useRefresh();
    const handleDelete = async () => {
        await deleteOne(
            "provider",
            { id: deleteId },
            {
                onSuccess: async () => {
                    toast({
                        description: translate("app.ui.delete.deletedSuccessfully"),
                        variant: "success",
                        title: "Success"
                    });
                },
                onError: error => {
                    console.error("Ошибка удаления:", error);
                }
            }
        );
        onOpenChange(false);
        refresh();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[251px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.provider.deleteProviderQuestion")}
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
