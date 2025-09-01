import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { TerminalCreate } from "../../create/TerminalCreate";
import { DialogDescription } from "@radix-ui/react-dialog";

interface CreateTerminalDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateTerminalDialog = ({ open, onOpenChange = () => {} }: CreateTerminalDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-h-full w-full max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[900px]"
            >
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.terminals.creatingTerminal")}
                    </DialogTitle>
                    <DialogDescription />
                    <TerminalCreate onClose={() => onOpenChange(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
