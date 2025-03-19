import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { TerminalCreate } from "../../create/TerminalCreate";

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
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.terminals.creatingTerminal")}
                    </DialogTitle>
                    <TerminalCreate provider={provider} onClose={() => onOpenChange(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
