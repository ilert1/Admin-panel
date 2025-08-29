import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { TerminalsEdit } from "../../edit/Terminals";
import { ProviderBase } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

interface EditProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    provider: ProviderBase;
    id: string;
}

export const EditTerminalDialog = ({ open, id, provider, onOpenChange = () => {} }: EditProviderDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-h-full w-full max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.terminals.editingTerminal")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <TerminalsEdit provider={provider} id={id} onClose={() => onOpenChange(false)} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
