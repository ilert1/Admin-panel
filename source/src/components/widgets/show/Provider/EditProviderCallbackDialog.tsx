import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { ProviderCallbackEdit } from "../../edit/Providers/ProviderCallbackEdit";

interface IEditProviderCallbackDialog {
    open: boolean;
    onOpenChange?: (state: boolean) => void;
    id: string;
}

export const EditProviderCallbackDialog = ({ open, id, onOpenChange = () => {} }: IEditProviderCallbackDialog) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.provider.callbackEditing")}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <ProviderCallbackEdit id={id} onOpenChange={onOpenChange} />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
