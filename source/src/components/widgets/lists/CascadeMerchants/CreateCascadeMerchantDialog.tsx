import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { MerchantCascadeCreate } from "../../create/MerchantCascadeCreate ";

interface CreateCascadeMerchantsDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateCascadeMerchantsDialog = ({ open, onOpenChange = () => {} }: CreateCascadeMerchantsDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.cascadeSettings.cascades.creatingCascade")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <MerchantCascadeCreate onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
