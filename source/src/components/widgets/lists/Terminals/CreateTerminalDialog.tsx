import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
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
                className="z-[60] bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.terminals.creatingTerminal")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <TerminalCreate provider={provider} onClose={() => onOpenChange(false)} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
