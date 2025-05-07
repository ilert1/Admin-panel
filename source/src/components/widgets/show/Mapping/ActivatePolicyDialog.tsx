import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CallbackMappingUpdate } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

export interface ActivatePolicyDialogProps {
    open: boolean;
    id: string;
    prevState: boolean;
    onOpenChange: (state: boolean) => void;
}
export const ActivatePolicyDialog = (props: ActivatePolicyDialogProps) => {
    const { open, id, prevState, onOpenChange } = props;
    const dataProvider = useDataProvider();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const translate = useTranslate();
    const appToast = useAppToast();
    const refresh = useRefresh();

    const handleConfirmClicked = async () => {
        if (buttonsDisabled) return;
        setButtonsDisabled(true);

        try {
            const data: CallbackMappingUpdate = { security_policy: { blocked: !prevState } };

            await dataProvider.update("callbridge/v1/mapping", {
                data,
                id,
                previousData: undefined
            });
            refresh();
            appToast("success", translate("app.ui.toast.success"));
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            setButtonsDisabled(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[300px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {prevState
                            ? translate("resources.callbridge.mapping.sec_policy_edit.activatePolicy")
                            : translate("resources.callbridge.mapping.sec_policy_edit.deactivatePolicy")}
                    </DialogTitle>
                    <DialogDescription />
                    <div className="flex w-full gap-2">
                        <Button
                            className="w-full"
                            variant={prevState ? "default" : "outline_gray"}
                            onClick={handleConfirmClicked}>
                            {translate("app.ui.actions.confirm")}
                        </Button>
                        <Button
                            className="w-full"
                            variant={prevState ? "outline_gray" : "default"}
                            onClick={() => onOpenChange(false)}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
