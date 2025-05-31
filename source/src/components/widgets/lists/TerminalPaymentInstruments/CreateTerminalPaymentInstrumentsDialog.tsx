import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { TerminalPaymentInstrumentsCreate } from "../../create/TerminalPaymentInstrumentsCreate";

interface ICreateFinancialInstitutionDialog {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateTerminalPaymentInstrumentsDialog = ({
    open,
    onOpenChange = () => {}
}: ICreateFinancialInstitutionDialog) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.paymentTools.terminalPaymentInstruments.createTerminalPaymentInstrument")}
                    </DialogTitle>
                    <DialogDescription />

                    <TerminalPaymentInstrumentsCreate onClose={() => onOpenChange(false)} />
                </DialogHeader>
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
