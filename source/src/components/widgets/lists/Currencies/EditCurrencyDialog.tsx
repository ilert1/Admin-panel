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
                className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <DialogHeader>
                    <DialogTitle className="text-xl text-center">
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
