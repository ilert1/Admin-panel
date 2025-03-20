import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { CurrencyCreate } from "../../create";

interface CreateCurrencyDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateCurrencyDialog = ({ open, onOpenChange }: CreateCurrencyDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl text-center mb-4">
                        {translate("resources.currency.createDialogTitle")}
                    </DialogTitle>
                </DialogHeader>

                <CurrencyCreate closeDialog={() => onOpenChange(false)} />
            </DialogContent>
            <DialogDescription />
        </Dialog>
    );
};
