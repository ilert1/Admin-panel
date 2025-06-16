import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { SystemPaymentInstrumentCreate } from "../../create/SystemPaymentInstrumentCreate";

interface CreateSystemPaymentInstrumentDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateSystemPaymentInstrumentDialog = (props: CreateSystemPaymentInstrumentDialogProps) => {
    const { open, onOpenChange = () => {} } = props;
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.paymentSettings.systemPaymentInstruments.creatingPaymentInstrument")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <SystemPaymentInstrumentCreate onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
