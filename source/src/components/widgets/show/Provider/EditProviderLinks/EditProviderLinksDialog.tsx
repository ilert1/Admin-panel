import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ProviderLinksEdit } from "@/components/widgets/edit/Providers/ProviderLinksEdit";
import { useTranslate } from "react-admin";

interface EditProviderLinksDialogProps {
    id: string;
    open: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const EditProviderLinksDialog = ({ open, id, onOpenChange = () => {} }: EditProviderLinksDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.provider.links.linksEditing")}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <ProviderLinksEdit id={id} onOpenChange={onOpenChange} />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
