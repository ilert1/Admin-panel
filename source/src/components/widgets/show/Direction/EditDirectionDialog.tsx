import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { DirectionEdit } from "@/components/widgets/edit";
import { useTranslate } from "react-admin";

export interface EditDirectionDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}
export const EditDirectionDialog = (props: EditDirectionDialogProps) => {
    const { open, id, onOpenChange } = props;

    const translate = useTranslate();
    // h-[464px]
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.direction.editingDirection")}
                    </DialogTitle>
                    <DialogDescription />
                    <DirectionEdit id={id} onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
