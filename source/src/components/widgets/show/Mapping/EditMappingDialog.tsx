import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { MappingEdit } from "../../edit/MappingEdit";

export interface EditDirectionDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}
export const EditMappingDialog = (props: EditDirectionDialogProps) => {
    const { open, id, onOpenChange } = props;

    const translate = useTranslate();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.callbridge.mapping.editingMapping")}
                    </DialogTitle>
                    <DialogDescription />
                    <MappingEdit id={id} onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
