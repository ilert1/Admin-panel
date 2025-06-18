import { RestoreStrategy } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslate } from "react-admin";

interface RestoreBackupDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const RestoreBackupDialog = ({ open, onOpenChange }: RestoreBackupDialogProps) => {
    const translate = useTranslate();
    const strategies = Object.values(RestoreStrategy);
    const [strategy, setStrategy] = useState(strategies[0]);
    const appToast = useAppToast();

    const [fileName, setFileName] = useState<string>(""); // base64
    const [originalFileName, setOriginalFileName] = useState<string>(""); // имя файла
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center text-xl">
                        {translate("resources.callbridge.history.backupRestoring.restoringFromBackup")}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label>{translate("resources.callbridge.history.backupRestoring.file")}</Label>
                        <div className="!mt-0 flex items-center gap-4">
                            {fileName && (
                                <div className="h-10 w-10 shrink-0">
                                    <img
                                        src={fileName}
                                        alt="icon"
                                        className="pointer-events-none h-full w-full object-contain"
                                    />
                                </div>
                            )}

                            <div className="relative w-full">
                                <label
                                    htmlFor="icon-upload"
                                    className="block w-full cursor-pointer rounded-4 bg-green-50 px-4 py-2 text-center !text-white transition-all duration-300 hover:bg-green-40"
                                    title={
                                        originalFileName ||
                                        translate("resources.callbridge.history.backupRestoring.file") + "..."
                                    }>
                                    <span className="block truncate">
                                        {originalFileName ||
                                            translate("resources.callbridge.history.backupRestoring.file") + "..."}
                                    </span>
                                </label>

                                {fileName && (
                                    <X
                                        size={20}
                                        className="absolute right-2 top-2 cursor-pointer text-white"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setFileName("");
                                            setOriginalFileName("");
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                    />
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                id="icon-upload"
                                type="file"
                                accept=".jsonl.gz"
                                style={{ display: "none" }}
                                onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const isValidExtension = file.name.endsWith(".jsonl.gz");

                                    if (!isValidExtension) {
                                        appToast(
                                            "error",
                                            "Неверный формат файла",
                                            "Пожалуйста, выберите файл с расширением .jsonl.gz"
                                        );
                                        setOriginalFileName("");
                                        setFileName("");
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                        return;
                                    }

                                    setOriginalFileName(file.name);

                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        const base64 = reader.result as string;
                                        setFileName(base64);
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex max-w-full flex-1 flex-col gap-1">
                        <Label className="mb-0">
                            {translate("resources.callbridge.history.backupRestoring.strategy")}
                        </Label>

                        <Select value={strategy} onValueChange={value => setStrategy(value as RestoreStrategy)}>
                            <SelectTrigger className="h-[38px] text-ellipsis">
                                <SelectValue
                                    placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    {strategies.map(el => {
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
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                    <Button type="submit" variant="default" className="w-full sm:w-auto">
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
            </DialogContent>
        </Dialog>
    );
};
