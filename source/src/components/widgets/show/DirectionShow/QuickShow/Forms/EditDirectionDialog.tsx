import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { DirectionEdit } from "@/components/widgets/edit";
import { useRefresh, useTranslate } from "react-admin";

export interface EditDirectionDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}
export const EditDirectionDialog = (props: EditDirectionDialogProps) => {
    const { open, id, onOpenChange } = props;

    const refresh = useRefresh();
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[716px] h-[464px] bg-muted pb-0">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.direction.editingDirection")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <DirectionEdit id={id} onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
