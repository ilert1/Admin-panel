import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { TerminalCreate } from "../../create/TerminalCreate";
import { DialogDescription } from "@radix-ui/react-dialog";

interface CreateProviderDialogProps {
    provider: string;
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateTerminalDialog = ({ open, onOpenChange = () => {}, provider }: CreateProviderDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.terminals.creatingTerminal")}
                    </DialogTitle>
                    <DialogDescription />
                    <TerminalCreate provider={provider} onClose={() => onOpenChange(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
