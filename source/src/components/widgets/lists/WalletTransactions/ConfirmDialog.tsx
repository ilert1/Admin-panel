import { fetchUtils, useRefresh, useTranslate } from "react-admin";

interface ConfirmDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}

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

const API_URL = import.meta.env.VITE_WALLET_URL;

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
            const { json } = await fetchUtils.fetchJson(`${API_URL}/transaction/${id}/process`, {
                method: "POST",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
                body: undefined
            });

            if (!json.success) {
                throw new Error("");
            }

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
            <DialogContent className="rounded-16 max-h-56 xl:max-h-none h-auto overflow-hidden w-[280px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.wallet.transactions.fields.confirmQuestion")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-around w-full gap-2">
                        <Button
                            onClick={() => {
                                handleConfirm(id);
                            }}>
                            {translate("app.ui.actions.confirm")}
                        </Button>
                        <Button
                            variant={"outline_gray"}
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
