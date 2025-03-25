import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { CurrencyEdit } from "../../edit";
import { useTranslate } from "react-admin";

interface EditCurrencieDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}

export const EditCurrencyDialog = ({ open, id, onOpenChange }: EditCurrencieDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                        {translate("resources.currency.editDialogTitle")}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <CurrencyEdit id={id} closeDialog={() => onOpenChange(false)} />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
