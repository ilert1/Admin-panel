import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { ChangePasswordForm } from "../../forms/ChangePasswordForm";

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const ChangePasswordDialog = (props: ChangePasswordDialogProps) => {
    const { open, onOpenChange } = props;
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="mx-2 h-auto w-[380px] gap-0 !overflow-y-auto rounded-[16px] bg-muted sm:mx-0">
                <DialogHeader className="flex flex-col gap-[24px]">
                    <DialogTitle className="!mb-0 text-center">
                        {translate("pages.settings.passChange.passChange")}
                    </DialogTitle>
                    <ChangePasswordForm onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
                <DialogDescription className="hidden" />
            </DialogContent>
        </Dialog>
    );
};
