import { ImportMode } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
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

interface UploadCsvFileDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    handleUplaod: (file: File, mode: ImportMode) => void;
}
export const UploadCsvFileDialog = (props: UploadCsvFileDialogProps) => {
    const { open, onOpenChange = () => {}, handleUplaod } = props;

    const appToast = useAppToast();
    const translate = useTranslate();
    const importModes = Object.values(ImportMode);
    const [inputVal, setInputVal] = useState("");
    const [importMode, setImportMode] = useState<ImportMode>("strict");

    const { openFilePicker, filesContent, loading, plainFiles, clear } = useFilePicker({
        accept: ".csv",
        multiple: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFilesSelected: (file: any) => {
            console.log(file.filesContent[0].type);
            if (file.filesContent[0].type !== "text/csv" && file.filesContent[0].type !== "application/vnd.ms-excel") {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!inputVal) clear();
            } else setInputVal(file.filesContent[0].name);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                onCloseAutoFocus={() => {
                    setInputVal("");
                    setImportMode("strict");
                    clear();
                }}
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[400px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.paymentSettings.reports.uploadingFile")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="flex w-full flex-col gap-4">
                        <TextField
                            text={inputVal ? inputVal : translate("resources.paymentSettings.reports.pickFile")}
                            lineClamp
                            wrap
                        />
                        <Button onClick={openFilePicker} disabled={loading} className="">
                            {filesContent?.[0]?.name
                                ? translate("resources.paymentSettings.reports.selectOtherFile")
                                : translate("resources.paymentSettings.reports.selectFile")}
                        </Button>
                        <div>
                            <Label>{translate("resources.paymentSettings.reports.inputMode")}</Label>
                            <Select value={importMode} onValueChange={val => setImportMode(val as ImportMode)}>
                                <SelectTrigger className="h-[38px] text-ellipsis">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {importModes.map(el => {
                                            return (
                                                <SelectItem key={el} value={el}>
                                                    {translate(`resources.paymentSettings.reports.${el}`)}
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
                                onClick={() => {
                                    handleUplaod(plainFiles?.[0] ?? null, importMode);
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
