import { useTranslate } from "react-admin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { UniqunessCreate } from "../../create/Merchant/UniqunessCreate";
import { useState } from "react";

interface UniquenessDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    merchantId: string;
}
export const UniquenessDialog = ({ open, onOpenChange, merchantId }: UniquenessDialogProps) => {
    const translate = useTranslate();

    const [isSomethingEdited, setIsSomethingEdited] = useState(false);
    const [confirmCloseDialogOpen, setConfirmCloseDialogOpen] = useState(false);
    const [saveClicked, setSaveClicked] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogCloseFn = (e: any) => {
        e.preventDefault();
        if (!saveClicked && isSomethingEdited) {
            setConfirmCloseDialogOpen(true);
        } else {
            setSaveClicked(false);
            onOpenChange(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    onInteractOutside={e => dialogCloseFn(e)}
                    onEscapeKeyDown={e => dialogCloseFn(e)}
                    onCloseAutoFocus={e => dialogCloseFn(e)}
                    disableOutsideClick
                    className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                    <DialogHeader>
                        <DialogTitle className="mb-4 text-center !text-display-1">
                            {translate("resources.merchant.uniqueness.uniquenessTitle")}
                        </DialogTitle>
                        <DialogDescription />
                        <div className="mt-5 w-full">
                            <div className="flex w-full flex-col gap-2">
                                <UniqunessCreate
                                    merchantId={merchantId}
                                    onOpenChange={onOpenChange}
                                    isSomethingEdited={isSomethingEdited}
                                    setIsSomethingEdited={setIsSomethingEdited}
                                    saveClicked={saveClicked}
                                    setSaveClicked={setSaveClicked}
                                    confirmCloseDialogOpen={confirmCloseDialogOpen}
                                    setConfirmDialogOpen={setConfirmCloseDialogOpen}
                                />
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter />
                </DialogContent>
            </Dialog>
        </>
    );
};
