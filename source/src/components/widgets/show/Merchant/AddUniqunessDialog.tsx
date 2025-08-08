import { useTranslate } from "react-admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { UniqunessCreate } from "../../create/Merchant/UniqunessCreate";

interface CreateMerchantDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    merchantId: string;
    directionName: string;
}
export const AddUniqunessDialog = ({ open, onOpenChange, merchantId, directionName }: CreateMerchantDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {/* {translate("resources.callbridge.mapping.creatingMapping")} */}
                    </DialogTitle>
                    <DialogDescription />
                    <UniqunessCreate
                        onOpenChange={onOpenChange}
                        merchantId={merchantId}
                        directionName={directionName}
                    />
                    {/* <CreateMapping onOpenChange={onOpenChange} /> */}
                </DialogHeader>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
