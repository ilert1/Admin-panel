import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useRefresh, useTranslate } from "react-admin";
import { PaymentTypeEdit } from "../../edit/PaymentTypeEdit";

interface EditPaymentDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    id: string;
}

export const EditPaymentDialog = (props: EditPaymentDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();

    const { open, id, onOpenChange = () => {} } = props;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.paymentTools.paymentType.editingPaymentType")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <PaymentTypeEdit
                        id={id}
                        onClose={() => {
                            onOpenChange(false);
                            refresh();
                        }}
                    />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
