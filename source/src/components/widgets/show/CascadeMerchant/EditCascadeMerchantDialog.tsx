import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { CascadeEdit } from "../../edit/CascadeEdit";

export interface EditCascadeMerchantDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}
export const EditCascadeMerchantDialog = ({ open, id, onOpenChange }: EditCascadeMerchantDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.cascadeSettings.cascadeMerchants.editingCascade")}
                    </DialogTitle>
                    <DialogDescription />
                    <CascadeEdit id={id} onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
