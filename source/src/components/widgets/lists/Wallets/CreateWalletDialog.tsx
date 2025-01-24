import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { CreateWallet } from "../../create";

interface CreateWalletDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    callbackData?: (data: Wallets.Wallet) => void;
}
export const CreateWalletDialog = (props: CreateWalletDialogProps) => {
    const { open, onOpenChange, callbackData = () => {} } = props;
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent disableOutsideClick className="w-[716px] max-w-full max-h-full outline-none">
                <DialogHeader>
                    <DialogTitle className="mb-4">{translate("resources.wallet.manage.creatingWallet")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <CreateWallet callbackData={callbackData} onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
