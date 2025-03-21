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
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center text-xl">
                        {translate("resources.currency.createDialogTitle")}
                    </DialogTitle>
                </DialogHeader>

                <CurrencyCreate closeDialog={() => onOpenChange(false)} />
            </DialogContent>
            <DialogDescription />
        </Dialog>
    );
};
