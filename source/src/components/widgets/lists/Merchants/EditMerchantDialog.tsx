import { useTranslate } from "react-admin";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { MerchantEdit } from "../../edit";

interface EditMerchantDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const EditMerchantDialog = (props: EditMerchantDialogProps) => {
    const { id, open, onOpenChange } = props;

    const translate = useTranslate();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="z-[60] bg-muted max-w-full w-[716px] h-full max-h-[100dvh] md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mb-4 text-center">
                        {translate("resources.merchant.editingMerchant")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <MerchantEdit id={id} onOpenChange={onOpenChange} />
                </AlertDialogHeader>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
