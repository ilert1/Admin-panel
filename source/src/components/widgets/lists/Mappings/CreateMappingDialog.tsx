import { useTranslate } from "react-admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { CreateMapping } from "../../create/CreateMapping";

interface CreateMerchantDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateMappingDialog = ({ open, onOpenChange }: CreateMerchantDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.callbridge.mapping.creatingMapping")}
                    </DialogTitle>
                    <DialogDescription />
                    <CreateMapping onOpenChange={onOpenChange} />
                </DialogHeader>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
