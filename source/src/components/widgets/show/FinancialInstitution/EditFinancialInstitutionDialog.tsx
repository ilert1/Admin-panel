import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { FinancialInstitutionEdit } from "../../edit/FinancialInstitutionEdit";

interface EditFinancialInstitutionDialogProps {
    open?: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}

export const EditFinancialInstitutionDialog = ({
    open,
    id,
    onOpenChange = () => {}
}: EditFinancialInstitutionDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.paymentTools.financialInstitution.editingFinancialInstitution")}
                    </DialogTitle>

                    <DialogDescription />

                    <FinancialInstitutionEdit id={id} onClose={() => onOpenChange(false)} />
                </DialogHeader>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
