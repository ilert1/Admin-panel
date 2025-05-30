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

export interface DeleteFinancialInstitutionProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange: (state: boolean) => void;
}
export const DeleteFinancialInstitutionDialog = ({
    open,
    id,
    onOpenChange,
    onQuickShowOpenChange
}: DeleteFinancialInstitutionProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const [deleteOne] = useDelete();

    const handleDelete = async () => {
        try {
            await deleteOne("financialInstitution", {
                id
            });
            refresh();
            onQuickShowOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[250px] max-w-[270px] overflow-auto bg-muted sm:max-h-[200px] md:max-w-[350px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.paymentTools.financialInstitution.deleteFinancialInstitution")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                        <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>
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
