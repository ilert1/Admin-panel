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
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center mb-4">{translate("resources.users.editUser")}</DialogTitle>
                </DialogHeader>

                <UserEdit record={record} id={id} onOpenChange={onOpenChange} />
                <DialogDescription />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
