import { authProvider } from "@/components/providers";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { useFilePicker } from "use-file-picker";
import { RestoreStrategy } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

interface RestoreBackupDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    handleUpload: (file: File, mode: RestoreStrategy) => Promise<void>;
}
export const RestoreBackupDialog = (props: RestoreBackupDialogProps) => {
    const { open, onOpenChange = () => {}, handleUpload } = props;

    const appToast = useAppToast();
    const translate = useTranslate();
    const restoreStrategies = Object.values(RestoreStrategy);
    const [inputVal, setInputVal] = useState("");
    const [importMode, setImportMode] = useState<RestoreStrategy>("merge");
    const { checkAuth } = authProvider;
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { openFilePicker, filesContent, loading, plainFiles, clear } = useFilePicker({
        accept: ".jsonl.gz",
        multiple: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFilesSelected: (file: any) => {
            const fileName = file.filesContent[0].name;
            if (
                file.filesContent[0].type !== "application/gzip" &&
                file.filesContent[0].type !== "application/x-gzip"
            ) {
                appToast("error", translate("resources.callbridge.history.backupRestoring.errors.wrongFileFormat"));
                if (!inputVal) clear();
            } else if (!fileName.toLowerCase().endsWith(".jsonl.gz")) {
                appToast("error", translate("resources.callbridge.history.backupRestoring.errors.wrongFileFormat"));
                if (!inputVal) clear();
            } else setInputVal(fileName);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                onCloseAutoFocus={() => {
                    setInputVal("");
                    setImportMode("merge");
                    clear();
                }}
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[400px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.callbridge.history.backupRestoring.restoringFromBackup")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="flex w-full flex-col gap-4">
                        <TextField
                            text={inputVal ? inputVal : translate("resources.callbridge.history.backupRestoring.file")}
                            lineClamp
                            wrap
                        />
                        <Button onClick={openFilePicker} disabled={loading} className="">
                            {filesContent?.[0]?.name
                                ? translate("resources.paymentSettings.reports.selectOtherFile")
                                : translate("resources.paymentSettings.reports.selectFile")}
                        </Button>
                        <div>
                            <Label>{translate("resources.callbridge.history.backupRestoring.strategy")}</Label>
                            <Select value={importMode} onValueChange={val => setImportMode(val as RestoreStrategy)}>
                                <SelectTrigger className="h-[38px] text-ellipsis">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {restoreStrategies.map(el => {
                                            return (
                                                <SelectItem key={el} value={el}>
                                                    {translate(
                                                        `resources.callbridge.history.backupRestoring.strategies.${el}`
                                                    )}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full"
                                disabled={!plainFiles?.[0] || buttonDisabled}
                                onClick={async () => {
                                    setButtonDisabled(true);
                                    await checkAuth({});
                                    await handleUpload(plainFiles?.[0] ?? null, importMode);
                                    setButtonDisabled(false);
                                    onOpenChange(false);
                                }}>
                                {translate("resources.paymentSettings.reports.upload")}
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
