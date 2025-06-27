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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Loading } from "@/components/ui/loading";

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
    const [isLoading, setIsLoading] = useState(true);

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

        if (!/^\d+(?:\s*,\s*\d+)*$/.test(retryStatus.trim())) {
            appToast(
                "error",
                <span className="!text-note-1 text-red-30">
                    {translate("resources.callbridge.mapping.fields.enterSepWithCommas")} (500, 400,300)
                </span>,
                translate("resources.callbridge.mapping.fields.wrongFormat")
            );
            return;
        }

        const data = retryStatus;

        const statuses = data
            .split(",")
            .map(el => el.trim())
            .filter(el => el !== "")
            .map(Number);

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

    useEffect(() => {
        if (!open) return;
        setRetryStatus(oldStatuses ? oldStatuses?.join(", ") : "");
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                onCloseAutoFocus={() => {
                    setRetryStatus(oldStatuses ? oldStatuses?.join(", ") : "");
                    setIsLoading(true);
                }}
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[400px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.callbridge.mapping.fields.retryStatusChange")}
                    </DialogTitle>
                    <DialogDescription />
                    {isLoading ? (
                        <div className="h-[300px] w-full">
                            <Loading />
                        </div>
                    ) : (
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
                    )}
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
