import { ImportMode } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { useFilePicker } from "use-file-picker";
import { ProviderSelect } from "../../components/Selects/ProviderSelect";
import { ProvidersDataProvider, TerminalsDataProvider } from "@/data";
import { TerminalMultiSelect } from "../../components/MultiSelectComponents/TerminalMultiSelect";
import { LoadingBlock } from "@/components/ui/loading";

interface ImportSingleFileDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    handleImport: (file: File, mode: string, terminal_ids: string[]) => Promise<void>;
}

export const ImportSingleFileDialog = (props: ImportSingleFileDialogProps) => {
    const { open, onOpenChange = () => {}, handleImport } = props;
    const { filterValues } = useListContext();

    const appToast = useAppToast();
    const translate = useTranslate();
    const { checkAuth } = authProvider;

    const providersDataProvider = new ProvidersDataProvider();
    const terminalsDataProvider = new TerminalsDataProvider();

    const importModes = Object.values(ImportMode);

    const [selectedProvider, setSelectedProvider] = useState<string>("");
    const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);

    const [inputVal, setInputVal] = useState("");
    const [importMode, setImportMode] = useState<ImportMode>("strict");

    const queryClient = useQueryClient();

    const { data, isLoading: isLoadingProviders } = useQuery({
        queryKey: ["provider", "list"],
        queryFn: () => providersDataProvider.getList("provider", { pagination: { page: 1, perPage: 10000 } }),
        enabled: open,
        select: data => data.data
    });

    const { data: terminalData, isLoading: isLoadingTerminals } = useQuery({
        queryKey: ["terminal", "list"],
        queryFn: () => terminalsDataProvider.getList("terminal", { filter: { provider: selectedProvider } }),
        enabled: !!selectedProvider,
        select: data => data.data
    });

    const { openFilePicker, filesContent, loading, plainFiles, clear } = useFilePicker({
        accept: ".csv",
        multiple: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFilesSelected: (file: any) => {
            const fileName = file.filesContent[0].name;
            if (file.filesContent[0].type !== "text/csv" && file.filesContent[0].type !== "application/vnd.ms-excel") {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!inputVal) clear();
            } else if (!fileName.toLowerCase().endsWith(".csv")) {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!inputVal) clear();
            } else setInputVal(fileName);
        }
    });

    useEffect(() => {
        if (!selectedProvider) {
            setSelectedTerminals([]);
            queryClient.resetQueries({
                queryKey: ["terminal", "list"]
            });
        }
    }, [selectedProvider, queryClient]);

    useEffect(() => {
        if (open) {
            if (filterValues?.provider) {
                setSelectedProvider(filterValues.provider ?? "");
            } else {
                setSelectedProvider("");
            }
        }
    }, [open, filterValues]);

    useEffect(() => {
        if (filterValues?.terminalFilterId) {
            setSelectedTerminals([filterValues.terminalFilterId]);
        } else {
            setSelectedTerminals([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedProvider]);

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
                {isLoadingTerminals || isLoadingProviders ? (
                    <div className="h-[400px]">
                        <LoadingBlock />
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="mb-4 text-center">
                                {translate("resources.paymentSettings.reports.uploadingFile")}
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                            <div className="mb-4 flex w-full flex-col gap-2">
                                <div>
                                    <Label>{translate("resources.direction.provider")}</Label>
                                    <ProviderSelect
                                        providers={data ?? []}
                                        disabled={isLoadingProviders}
                                        value={selectedProvider}
                                        modal
                                        onChange={(value: string) => {
                                            setSelectedProvider(value);
                                        }}
                                    />
                                </div>
                                <div>
                                    <TerminalMultiSelect
                                        options={terminalData ?? []}
                                        value={selectedTerminals}
                                        disabled={!terminalData || isLoadingTerminals}
                                        onChange={(value: string[]) => {
                                            setSelectedTerminals(value);
                                        }}
                                        placeholder={
                                            !selectedProvider
                                                ? translate("app.widgets.multiSelect.selectProviderAtFirst")
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
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
                                        <SelectTrigger className="h-[38px] text-ellipsis" variant={SelectType.GRAY}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {importModes.map(el => {
                                                    return (
                                                        <SelectItem key={el} value={el} variant={SelectType.GRAY}>
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
                                        disabled={!plainFiles?.[0] || !selectedProvider || !selectedTerminals.length}
                                        onClick={async () => {
                                            await checkAuth({});
                                            handleImport(plainFiles?.[0] ?? null, importMode, selectedTerminals);
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
                        <DialogFooter></DialogFooter>{" "}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
