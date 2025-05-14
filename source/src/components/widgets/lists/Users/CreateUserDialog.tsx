import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { UserCreate } from "../../create/UserCreate";

interface CreateCurrencyDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateUserDialog = ({ open, onOpenChange }: CreateCurrencyDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle>{translate("app.widgets.forms.userCreate.title")}</DialogTitle>
                </DialogHeader>
                <DialogDescription />

                <UserCreate onOpenChange={onOpenChange} />
            </DialogContent>
        </Dialog>
    );
};
