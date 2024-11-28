import { fetchUtils, useRefresh, useTranslate } from "react-admin";

interface ConfirmDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const API_URL = import.meta.env.VITE_WALLET_URL;

export const ConfirmDialog = (props: ConfirmDialogProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const { open, id, onOpenChange } = props;

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleConfirm = async (id: string) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            const { json } = await fetchUtils.fetchJson(`${API_URL}/transaction/${id}/process`, {
                method: "POST",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
                body: undefined
            });
            console.log(json);
            if (!json.success) {
                throw new Error("");
            }
            onOpenChange(false);
            refresh();
        } catch (error) {
            toast.error(translate("resources.wallet.transactions.error"), {
                description: translate("resources.wallet.transactions.errors.failedToConfirm"),
                dismissible: true,
                duration: 3000
            });
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[251px] bg-muted">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        {translate("resources.wallet.transactions.fields.confirmQuestion")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex justify-around w-full">
                        <Button
                            onClick={() => {
                                handleConfirm(id);
                            }}>
                            {translate("app.ui.actions.confirm")}
                        </Button>
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
