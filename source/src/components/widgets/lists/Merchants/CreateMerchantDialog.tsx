import { useTranslate } from "react-admin";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { MerchantCreate } from "../../create";

interface CreateMerchantDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateMerchantDialog = (props: CreateMerchantDialogProps) => {
    const { open, onOpenChange } = props;

    const translate = useTranslate();
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="z-[60] bg-muted max-w-full w-[716px] h-full max-h-[100dvh] md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mb-4 text-center">
                        {translate("resources.merchant.creatingMerchant")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <MerchantCreate onOpenChange={onOpenChange} />
                </AlertDialogHeader>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
