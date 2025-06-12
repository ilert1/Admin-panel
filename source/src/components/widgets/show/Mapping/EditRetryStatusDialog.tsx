import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { Input } from "@/components/ui/Input/input";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export interface EditRetryStatusDialogProps {
    open: boolean;
    id: string;
    oldStatuses?: number[];
    onOpenChange: (state: boolean) => void;
}
export const EditRetryStatusDialog = (props: EditRetryStatusDialogProps) => {
    const { open, id, oldStatuses, onOpenChange } = props;
    const refresh = useRefresh();

    const appToast = useAppToast();
    const dataProvider = useDataProvider();

    const [retryStatus, setRetryStatus] = useState(oldStatuses ? oldStatuses?.join(", ") : "");

    const translate = useTranslate();

    const onSave = async () => {
        if (!retryStatus.match(/^[\d, ]+$/)) {
            appToast(
                "error",
                translate("resources.callbridge.mapping.fields.allowedSymbols"),
                translate("resources.callbridge.mapping.fields.wrongFormat")
            );
            return;
        }

        if (!retryStatus.match(/^(?!.*,,)(?![,\s]+$)[\d, ]+$/)) {
            appToast(
                "error",
                translate("resources.callbridge.mapping.fields.allowedVariant"),
                translate("resources.callbridge.mapping.fields.wrongFormat")
            );
            return;
        }

        const data = retryStatus;

        const statuses = data.split(",").map(el => {
            const newEl = el.trim();
            return Number(newEl);
        });

        try {
            await dataProvider.update("callbridge/v1/mapping", {
                id,
                data: {
                    retry_policy: {
                        retry_on_status: statuses
                    }
                },
                previousData: undefined
            });
            refresh();
            appToast("success", translate("app.ui.toast.success"));
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.edit.editError"));
        } finally {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                onCloseAutoFocus={() => {
                    setRetryStatus(oldStatuses ? oldStatuses?.join(", ") : "");
                }}
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[400px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.callbridge.mapping.fields.retryStatusChange")}
                    </DialogTitle>
                    <DialogDescription />
                    <div className="w-full">
                        <Input
                            value={retryStatus}
                            onChange={e => setRetryStatus(e.target.value)}
                            title={translate("resources.callbridge.mapping.fields.newStatus")}
                        />
                        <div className="mb-2">
                            <span className="!text-note-1 text-red-40">
                                {translate("resources.callbridge.mapping.fields.enterSepWithCommas")} (500, 400,300)
                            </span>
                        </div>
                        <div className="flex flex-col justify-end gap-4 sm:flex-row sm:items-center">
                            <Button onClick={onSave} variant="default" className="w-full sm:w-auto">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                onClick={() => onOpenChange(false)}
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
