import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { toast } from "@/components/ui/use-toast";
import { useDelete, useTranslate } from "react-admin";

interface DeleteProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    deleteId?: string;
}
export const DeleteProviderDialog = (props: DeleteProviderDialogProps) => {
    const translate = useTranslate();
    const { open, deleteId, onOpenChange } = props;
    const [deleteOne] = useDelete();

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
        setChosenId("");
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[251px] bg-muted">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        {translate("resources.providers.deleteProviderQuestion")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex justify-around w-full">
                        <AlertDialogAction onClick={handleDelete}>
                            {translate("app.ui.actions.delete")}
                        </AlertDialogAction>
                        <AlertDialogCancel>{translate("app.ui.actions.cancel")}</AlertDialogCancel>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
