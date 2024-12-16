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
export const EditMerchantDialog = ({ id, open, onOpenChange }: EditMerchantDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.merchant.editingMerchant")}
                    </DialogTitle>

                    <DialogDescription />

                    <MerchantEdit id={id} onOpenChange={onOpenChange} />
                </DialogHeader>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
