/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { TransactionDataProvider } from "@/data";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useState } from "react";

interface SyncDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    txId: string;
}

export const SyncDialog = (props: SyncDialogProps) => {
    const { open, onOpenChange, txId } = props;
    const dataProvider = TransactionDataProvider;

    const translate = useTranslate();
    const refresh = useRefresh();
    const toast = useAppToast();

    const [buttonClicked, setButtonClicked] = useState(false);

    const handleSync = async () => {
        if (buttonClicked) return;
        setButtonClicked(true);

        try {
            await dataProvider.syncronize(txId);
        } catch (error) {
            if (error instanceof Error) toast("error", error.message);
            else toast("success", "Unknown error");
        } finally {
            refresh();
            setButtonClicked(false);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[340px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.transactions.show.syncWithNats")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter className="!w-full">
                    <div className="w-full">
                        <div className="flex w-full justify-around gap-[35px]">
                            <Button disabled={buttonClicked} onClick={handleSync} className="w-full">
                                {translate("app.ui.actions.confirm")}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="!ml-0 w-full bg-neutral-0 px-3 dark:bg-neutral-100">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
