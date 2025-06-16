import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { SystemPaymentInstrumentEdit } from "../../edit/SystemPaymentInstrumentEdit";

export interface EditPaymentInstrumentDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}
export const EditPaymentInstrumentDialog = ({ open, id, onOpenChange }: EditPaymentInstrumentDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.paymentSettings.systemPaymentInstruments.editingPaymentInstrument")}
                    </DialogTitle>
                </DialogHeader>

                <SystemPaymentInstrumentEdit id={id} onOpenChange={onOpenChange} />
                <DialogDescription />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
