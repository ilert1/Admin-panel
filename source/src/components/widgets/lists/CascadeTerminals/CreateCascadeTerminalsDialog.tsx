import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { CascadeTerminalCreate } from "../../create/CascadeTerminalCreate";

interface CreateCascadeTerminalsDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateCascadeTerminalsDialog = ({ open, onOpenChange = () => {} }: CreateCascadeTerminalsDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.cascadeSettings.cascadeTerminals.creatingCascadeTerminal")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription />

                <CascadeTerminalCreate onClose={() => onOpenChange(false)} />

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
