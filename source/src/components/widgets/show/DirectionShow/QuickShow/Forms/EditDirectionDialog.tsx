import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
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
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="z-[60] bg-muted max-w-full w-[716px] h-full max-h-[100dvh] md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mb-4 text-center">
                        {translate("resources.direction.editingDirection")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <DirectionEdit id={id} onOpenChange={onOpenChange} />
                </AlertDialogHeader>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
