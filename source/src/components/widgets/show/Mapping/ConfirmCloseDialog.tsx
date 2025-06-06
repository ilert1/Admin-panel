import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";

export interface ConfirmCloseDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    onSave: () => void;
    onClose: () => void;
}
export const ConfirmCloseDialog = (props: ConfirmCloseDialogProps) => {
    const { open, onOpenChange, onSave, onClose } = props;

    const translate = useTranslate();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.callbridge.mapping.sec_policy_edit.youHaveUnsavedChanges")}
                    </DialogTitle>
                    <span className="mb-4 text-title-2">
                        {translate("resources.callbridge.mapping.sec_policy_edit.saveOrDeleteThem")}
                    </span>
                    <DialogDescription />
                    <div>
                        <div className="flex justify-center"></div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    onSave();
                                    onOpenChange(false);
                                    onClose();
                                }}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button onClick={() => onOpenChange(false)}>{translate("app.ui.actions.back")}</Button>
                            <Button
                                onClick={() => {
                                    onOpenChange(false);
                                    onClose();
                                }}
                                variant="outline_gray"
                                type="button"
                                className="w-full rounded-4 border border-neutral-50 hover:border-neutral-100 sm:w-auto">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
