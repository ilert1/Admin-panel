import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { EditWallet } from "@/components/widgets/edit";
import { useTranslate } from "react-admin";

export interface EditWalletDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}
export const EditWalletDialog = (props: EditWalletDialogProps) => {
    const { open, id, onOpenChange } = props;

    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader className="w-full">
                    <DialogTitle className="mb-[24px] text-center">
                        {translate("resources.wallet.manage.editingWallet")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <EditWallet id={id} onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
