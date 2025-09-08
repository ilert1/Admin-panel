import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { ProviderCreate } from "../../create";

interface CreateProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateProviderDialog = ({ open, onOpenChange = () => {} }: CreateProviderDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.provider.creatingProvider")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <ProviderCreate onClose={() => onOpenChange(false)} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
