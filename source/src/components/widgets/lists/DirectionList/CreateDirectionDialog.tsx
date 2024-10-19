import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { DirectionCreate } from "../../create";

export interface CreateDirectionDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateDirectionDialog = (props: CreateDirectionDialogProps) => {
    const { open, onOpenChange } = props;

    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">{translate("resources.direction.creatingDirection")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <DirectionCreate onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
