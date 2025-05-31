import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useState } from "react";
import { useDelete, useRefresh, useTranslate } from "react-admin";

export interface DeleteFinancialInstitutionProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange: (state: boolean) => void;
}
export const DeleteFinancialInstitutionDialog = ({
    open,
    id,
    onOpenChange,
    onQuickShowOpenChange
}: DeleteFinancialInstitutionProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const [deleteOne] = useDelete();

    const [continueClicked, setContinueClicked] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteOne("financialInstitution", {
                id
            });
            refresh();
            onQuickShowOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[200px] max-w-[400px] overflow-auto bg-muted sm:max-h-[300px]"
                onCloseAutoFocus={() => {
                    setContinueClicked(false);
                }}
                onEscapeKeyDown={() => {
                    setContinueClicked(false);
                }}>
                <DialogHeader>
                    <DialogTitle className="text-center !text-display-2 text-red-40 dark:text-red-40">
                        {translate("resources.paymentTools.deletion.attention")}
                    </DialogTitle>
                    <DialogDescription className="text-center !text-title-1 text-red-400">
                        {!continueClicked
                            ? translate("resources.paymentTools.deletion.attentionDescriptionFinOrganization")
                            : translate("resources.paymentTools.deletion.consequencesFinOrganization")}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-4">
                        {!continueClicked ? (
                            <Button
                                className="w-full sm:w-1/2"
                                variant={"alert"}
                                onClick={() => setContinueClicked(true)}>
                                {translate("app.ui.actions.continue")}
                            </Button>
                        ) : (
                            <>
                                <Button className="w-full" onClick={handleDelete} variant={"alert"}>
                                    {translate("app.ui.actions.delete")}
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        onOpenChange(false);
                                        refresh();
                                    }}>
                                    {translate("app.ui.actions.cancel")}
                                </Button>
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
