import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { UserEdit } from "@/components/widgets/edit";
import { useTranslate } from "react-admin";

export interface EditUserDialogProps {
    open: boolean;
    id: string;
    record: Users.User;
    onOpenChange: (state: boolean) => void;
}
export const EditUserDialog = ({ record, open, id, onOpenChange }: EditUserDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">{translate("resources.users.editUser")}</DialogTitle>
                </DialogHeader>

                <UserEdit record={record} id={id} onOpenChange={onOpenChange} />
                <DialogDescription />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
