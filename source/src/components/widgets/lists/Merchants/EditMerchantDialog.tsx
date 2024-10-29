import { useTranslate } from "react-admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { MerchantEdit } from "../../edit";

interface EditMerchantDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const EditMerchantDialog = (props: EditMerchantDialogProps) => {
    const { id, open, onOpenChange } = props;

    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[716px] max-h-[90vh] bg-muted pb-0 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-center mb-[24px]">
                        {translate("resources.merchant.editingMerchant")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <MerchantEdit id={id} onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
