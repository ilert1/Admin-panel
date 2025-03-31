import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { AccountEdit } from "../../edit/AccountEdit";

interface EditCurrencieDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}

export const EditAccountDialog = ({ open, id, onOpenChange }: EditCurrencieDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                        {translate("resources.accounts.editDialogTitle")}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <AccountEdit id={id} onClose={() => onOpenChange(false)} />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
