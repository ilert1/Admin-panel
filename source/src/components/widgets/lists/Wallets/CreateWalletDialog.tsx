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
}
export const CreateWalletDialog = (props: CreateWalletDialogProps) => {
    const { open, onOpenChange } = props;
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[716px] ">
                <DialogHeader>
                    <DialogTitle className="mb-4">{translate("resources.direction.creatingDirection")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <CreateWallet onOpenChange={onOpenChange} />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
