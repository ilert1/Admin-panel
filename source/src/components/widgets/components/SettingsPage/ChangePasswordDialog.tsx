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
                className="bg-muted max-w-full w-[380px] h-auto !overflow-y-auto rounded-[16px] mx-2 sm:mx-0 gap-0">
                <DialogHeader className="flex flex-col gap-[24px]">
                    <DialogTitle className="text-center !mb-0">
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
