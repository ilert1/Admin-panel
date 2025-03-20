import { useTranslate } from "react-admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { MerchantCreateNewFlow } from "../../create/MerchantCreateNewFlow";

interface CreateMerchantDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateMerchantDialogNewFlow = ({ open, onOpenChange }: CreateMerchantDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.merchant.creatingMerchant")}
                    </DialogTitle>

                    <DialogDescription />

                    <MerchantCreateNewFlow onOpenChange={onOpenChange} />
                </DialogHeader>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
