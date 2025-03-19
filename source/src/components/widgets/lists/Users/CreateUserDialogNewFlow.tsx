import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { UserCreateNewFlow } from "../../create/UserCreateNewFlow";

interface CreateCurrencyDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateUserDialogNewFlow = ({ open, onOpenChange }: CreateCurrencyDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{translate("app.widgets.forms.userCreate.title")}</DialogTitle>
                </DialogHeader>
                <DialogDescription />

                <UserCreateNewFlow onOpenChange={onOpenChange} />
            </DialogContent>
        </Dialog>
    );
};
