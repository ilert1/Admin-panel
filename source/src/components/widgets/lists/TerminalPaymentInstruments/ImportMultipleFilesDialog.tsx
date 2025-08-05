/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface ImportMultipleFilesDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    handleImport: (
        payment_type_file: File,
        financial_institution_file: File,
        currency_file: File,
        provider: string,
        terminal_ids: string[]
    ) => Promise<void>;
}

export const ImportMultipleFilesDialog = (props: ImportMultipleFilesDialogProps) => {
    const { open, onOpenChange = () => {}, handleImport } = props;
    const appToast = useAppToast();
    const translate = useTranslate();
    const { checkAuth } = authProvider;
    const { filterValues } = useListContext();

    const providersDataProvider = new ProvidersDataProvider();
    const terminalsDataProvider = new TerminalsDataProvider();

    const [selectedProvider, setSelectedProvider] = useState<string>("");
    const [selectedProviderId, setSelectedProviderId] = useState<string>("");
    const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);

    const [paymentTypeCsvFileName, setPaymentTypeCsvFileName] = useState<string>("");
    const [financialInstitutionCsvFileName, setFinancialInstitutionCsvFileName] = useState<string>("");
    const [currencyCsvFileName, setCurrencyCsvFileName] = useState<string>("");

    const queryClient = useQueryClient();

    const { data, isLoading: isLoadingProviders } = useQuery({
        queryKey: ["provider", "list"],
        queryFn: () => providersDataProvider.getList("provider", { pagination: { page: 1, perPage: 10000 } }),
        enabled: open,
        select: data => data.data
    });

    const { data: terminalData, isLoading: isLoadingTerminals } = useQuery({
        queryKey: ["terminal", "list", selectedProvider],
        queryFn: () => terminalsDataProvider.getList("terminal", { filter: { provider: selectedProvider } }),
        enabled: !!selectedProvider,
        select: data => data.data
    });

    const {
        openFilePicker: openPaymentTypePicker,
        plainFiles: paymentTypePlainFiles,
        loading: paymentTypeFilesLoading,
        clear: clearPaymentTypePicker
    } = useFilePicker({
        accept: ".csv",
        multiple: false,
        onFilesSelected: (file: any) => {
            const fileName = file.filesContent[0].name;
            if (file.filesContent[0].type !== "text/csv" && file.filesContent[0].type !== "application/vnd.ms-excel") {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!paymentTypeCsvFileName) clearPaymentTypePicker();
            } else if (!fileName.toLowerCase().endsWith(".csv")) {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!paymentTypeCsvFileName) clearPaymentTypePicker();
            } else setPaymentTypeCsvFileName(fileName);
        }
    });

    const {
        openFilePicker: openInstitutionPicker,
        plainFiles: institutionPlainFiles,
        loading: institutionFilesLoading,
        clear: clearInstitutionPicker
    } = useFilePicker({
        accept: ".csv",
        multiple: false,
        onFilesSelected: (file: any) => {
            const fileName = file.filesContent[0].name;
            if (file.filesContent[0].type !== "text/csv" && file.filesContent[0].type !== "application/vnd.ms-excel") {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!financialInstitutionCsvFileName) clearInstitutionPicker();
            } else if (!fileName.toLowerCase().endsWith(".csv")) {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!financialInstitutionCsvFileName) clearInstitutionPicker();
            } else setFinancialInstitutionCsvFileName(fileName);
        }
    });

    const {
        openFilePicker: openCurrencyPicker,
        plainFiles: currencyPlainFiles,
        loading: currencyFilesLoading,
        clear: clearCurrencyPicker
    } = useFilePicker({
        accept: ".csv",
        multiple: false,
        onFilesSelected: (file: any) => {
            const fileName = file.filesContent[0].name;
            if (file.filesContent[0].type !== "text/csv" && file.filesContent[0].type !== "application/vnd.ms-excel") {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!currencyCsvFileName) clearCurrencyPicker();
            } else if (!fileName.toLowerCase().endsWith(".csv")) {
                appToast("error", translate("resources.paymentSettings.reports.wrongFileFormat"));
                if (!currencyCsvFileName) clearCurrencyPicker();
            } else setCurrencyCsvFileName(fileName);
        }
    });

    // useEffect(() => {
    //     if (!selectedProvider) {
    //         setSelectedTerminals([]);
    //         queryClient.resetQueries({
    //             queryKey: ["terminal", "list"]
    //         });
    //     }
    // }, [selectedProvider, queryClient]);

    // useEffect(() => {
    //     if (open) {
    //         if (filterValues?.provider) {
    //             setSelectedProvider(filterValues.provider ?? "");
    //             setSelectedProviderId(data?.find(el => el.name === filterValues.provider)?.id ?? "");
    //         } else {
    //             setSelectedProvider("");
    //         }
    //     }
    // }, [open, filterValues, data]);

    // useEffect(() => {
    //     if (filterValues?.terminalFilterId) {
    //         setSelectedTerminals([filterValues.terminalFilterId]);
    //     } else {
    //         setSelectedTerminals([]);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [open, selectedProvider]);
    useEffect(() => {
        if (!selectedProvider) {
            setSelectedTerminals([]);
            queryClient.resetQueries({
                queryKey: ["terminal", "list"]
            });
        }
    }, [selectedProvider, queryClient, filterValues]);

    useEffect(() => {
        if (open) {
            if (filterValues?.provider) {
                setSelectedProvider(filterValues.provider ?? "");
                queryClient.resetQueries({
                    queryKey: ["terminal", "list"]
                });
            } else {
                setSelectedProvider("");
            }
        }
    }, [open, filterValues, queryClient]);

    useEffect(() => {
        if (selectedProvider && filterValues?.terminalFilterId) {
            setSelectedTerminals([filterValues.terminalFilterId]);
        } else {
            setSelectedTerminals([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedProvider, filterValues]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                onCloseAutoFocus={() => {
                    setPaymentTypeCsvFileName("");
                    setFinancialInstitutionCsvFileName("");
                    setCurrencyCsvFileName("");
                    setSelectedTerminals([]);

                    clearPaymentTypePicker();
                    clearInstitutionPicker();
                    clearCurrencyPicker();
                }}
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[400px]">
                <DialogTitle className="hidden" />
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
                                        idField="id"
                                        idFieldValue={selectedProviderId}
                                        setIdValue={setSelectedProviderId}
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
                            <div className="flex w-full flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex w-full flex-col gap-2">
                                        <TextField
                                            text={
                                                paymentTypeCsvFileName
                                                    ? paymentTypeCsvFileName
                                                    : translate(
                                                          "resources.paymentSettings.terminalPaymentInstruments.fileDownloadUpload.payment_types_csv"
                                                      )
                                            }
                                            lineClamp
                                            wrap
                                        />
                                        <Button
                                            onClick={openPaymentTypePicker}
                                            disabled={paymentTypeFilesLoading}
                                            className="">
                                            {paymentTypePlainFiles?.[0]?.name
                                                ? translate("resources.paymentSettings.reports.selectOtherFile")
                                                : translate("resources.paymentSettings.reports.selectFile")}
                                        </Button>
                                    </div>
                                    <div className="flex w-full flex-col gap-2">
                                        <TextField
                                            text={
                                                financialInstitutionCsvFileName
                                                    ? financialInstitutionCsvFileName
                                                    : translate(
                                                          "resources.paymentSettings.terminalPaymentInstruments.fileDownloadUpload.financial_institutions_csv"
                                                      )
                                            }
                                            lineClamp
                                            wrap
                                        />
                                        <Button
                                            onClick={openInstitutionPicker}
                                            disabled={institutionFilesLoading}
                                            className="">
                                            {institutionPlainFiles?.[0]?.name
                                                ? translate("resources.paymentSettings.reports.selectOtherFile")
                                                : translate("resources.paymentSettings.reports.selectFile")}
                                        </Button>
                                    </div>
                                    <div className="flex w-full flex-col gap-2">
                                        <TextField
                                            text={
                                                currencyCsvFileName
                                                    ? currencyCsvFileName
                                                    : translate(
                                                          "resources.paymentSettings.terminalPaymentInstruments.fileDownloadUpload.currency_csv"
                                                      )
                                            }
                                            lineClamp
                                            wrap
                                        />
                                        <Button
                                            onClick={openCurrencyPicker}
                                            disabled={currencyFilesLoading}
                                            className="">
                                            {currencyPlainFiles?.[0]?.name
                                                ? translate("resources.paymentSettings.reports.selectOtherFile")
                                                : translate("resources.paymentSettings.reports.selectFile")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                                    <Button
                                        type="submit"
                                        variant="default"
                                        className="w-full"
                                        disabled={
                                            !paymentTypePlainFiles?.[0] ||
                                            !institutionPlainFiles?.[0] ||
                                            // !currencyPlainFiles?.[0] ||
                                            !selectedProvider
                                        }
                                        onClick={async () => {
                                            await checkAuth({});
                                            handleImport(
                                                paymentTypePlainFiles?.[0] ?? null,
                                                institutionPlainFiles?.[0] ?? null,
                                                currencyPlainFiles?.[0] ?? null,
                                                selectedProviderId,
                                                selectedTerminals
                                            );
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
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
