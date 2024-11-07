import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDelete, useRefresh, useTranslate } from "react-admin";
interface DeleteMerchantDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const DeleteMerchantDialog = (props: DeleteMerchantDialogProps) => {
    const { id, open, onOpenChange } = props;

    const translate = useTranslate();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();
    const { toast } = useToast();

    const handleDelete = async () => {
        await deleteOne(
            "merchant",
            { id },
            {
                onSuccess: () => {
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
        refresh();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[251px] max-h-[200px] sm:max-h-[140px] bg-muted overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.merchant.delete")}</DialogTitle>
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
