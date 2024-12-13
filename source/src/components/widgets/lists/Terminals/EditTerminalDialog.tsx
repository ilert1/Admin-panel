import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { TerminalEdit } from "../../edit/TerminalEdit";

interface EditProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    provider: string;
    id: string;
}

export const EditTerminalDialog = ({ open, id, provider, onOpenChange = () => {} }: EditProviderDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="z-[60] bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.terminals.editingTerminal")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <TerminalEdit provider={provider} id={id} onClose={() => onOpenChange(false)} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
