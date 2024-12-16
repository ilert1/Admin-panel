import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { UserCreate } from "../../create";

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
                className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <DialogHeader>
                    <DialogTitle>{translate("app.widgets.forms.userCreate.title")}</DialogTitle>
                </DialogHeader>
                <DialogDescription />

                <UserCreate onOpenChange={onOpenChange} />
            </DialogContent>
        </Dialog>
    );
};
