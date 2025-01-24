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
                className="max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
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
