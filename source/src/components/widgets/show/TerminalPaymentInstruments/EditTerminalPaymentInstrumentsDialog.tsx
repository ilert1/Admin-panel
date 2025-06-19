import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { TerminalPaymentInstrumentsEdit } from "../../edit/TerminalPaymentInstrumentsEdit";

interface EditTerminalPaymentInstrumentsDialogProps {
    open?: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}

export const EditTerminalPaymentInstrumentsDialog = ({
    open,
    id,
    onOpenChange = () => {}
}: EditTerminalPaymentInstrumentsDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate(
                            "resources.paymentSettings.terminalPaymentInstruments.editingTerminalPaymentInstrument"
                        )}
                    </DialogTitle>

                    <DialogDescription />

                    <TerminalPaymentInstrumentsEdit id={id} onClose={() => onOpenChange(false)} />
                </DialogHeader>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
