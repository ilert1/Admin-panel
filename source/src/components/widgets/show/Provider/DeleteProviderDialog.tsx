import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useDelete, useRefresh, useTranslate } from "react-admin";

interface DeleteProviderDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange: (state: boolean) => void;
}
export const DeleteProviderDialog = ({ open, id, onOpenChange, onQuickShowOpenChange }: DeleteProviderDialogProps) => {
    const translate = useTranslate();
    const [deleteOne] = useDelete();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const handleDelete = async () => {
        try {
            await deleteOne("provider", { id });

            appToast("success", translate("app.ui.delete.deletedSuccessfully"));
            refresh();
            onQuickShowOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[200px] max-w-[270px] overflow-auto bg-muted sm:max-h-[140px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.provider.deleteProviderQuestion")}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                        <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>
                        <Button
                            variant={"outline"}
                            className="bg-neutral-0 dark:bg-neutral-100"
                            onClick={() => onOpenChange(false)}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
