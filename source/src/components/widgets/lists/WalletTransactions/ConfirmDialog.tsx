import { useRefresh, useTranslate } from "react-admin";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { WalletsDataProvider } from "@/data";

interface ConfirmDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();

    const appToast = useAppToast();

    const { open, id, onOpenChange } = props;

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleConfirm = async (id: string) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        onOpenChange(false);
        try {
            WalletsDataProvider.confirmWalletTransaction(id);

            appToast("success", translate("resources.wallet.transactions.successMessage"));
            refresh();
        } catch (error) {
            appToast("error", translate("resources.wallet.transactions.errors.failedToConfirm"));
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="h-auto max-h-56 !w-[280px] overflow-hidden rounded-16 bg-muted xl:max-h-none">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.wallet.transactions.fields.confirmQuestion")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full justify-around gap-2">
                        <Button
                            onClick={() => {
                                handleConfirm(id);
                            }}>
                            {translate("app.ui.actions.confirm")}
                        </Button>
                        <Button
                            variant={"outline"}
                            className="bg-neutral-0 dark:bg-neutral-100"
                            onClick={() => {
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
