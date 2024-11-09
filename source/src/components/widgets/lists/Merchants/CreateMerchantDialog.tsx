import { useTranslate } from "react-admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { MerchantCreate } from "../../create";

interface CreateMerchantDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateMerchantDialog = (props: CreateMerchantDialogProps) => {
    const { open, onOpenChange } = props;

    const translate = useTranslate();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[716px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.merchant.creatingMerchant")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <MerchantCreate onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
