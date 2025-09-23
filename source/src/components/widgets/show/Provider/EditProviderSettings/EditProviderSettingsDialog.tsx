import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ProviderSettingsEdit } from "@/components/widgets/edit/Providers/ProviderSettingsEdit";
import { useTranslate } from "react-admin";

interface EditProviderSettingsDialogProps {
    id: string;
    open: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const EditProviderSettingsDialog = ({ open, id, onOpenChange = () => {} }: EditProviderSettingsDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.provider.settings.settingsEditing")}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <ProviderSettingsEdit id={id} onOpenChange={onOpenChange} />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
