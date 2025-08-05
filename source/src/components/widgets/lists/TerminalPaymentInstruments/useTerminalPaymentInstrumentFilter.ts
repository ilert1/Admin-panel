import { ChangeEvent, useEffect, useState } from "react";
import { useListContext, useRefresh, useTranslate } from "react-admin";
import { debounce } from "lodash";
import { useProvidersListWithoutPagination, useTerminalsListWithoutPagination } from "@/hooks";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import extractFieldsFromErrorMessage from "@/helpers/extractErrorForCSV";
import { ImportStrategy } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

const useTerminalPaymentInstrumentFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();
    const dataProvider = new TerminalPaymentInstrumentsProvider();

    const translate = useTranslate();
    const appToast = useAppToast();
    const refresh = useRefresh();

    const [terminalPaymentTypeCode, setTerminalPaymentTypeCode] = useState(
        filterValues?.terminal_payment_type_code || ""
    );
    const [terminalCurrencyCode, setTerminalCurrencyCode] = useState(filterValues?.terminal_currency_code || "");
    const [terminalFinancialInstitutionCode, setTerminalFinancialInstitutionCode] = useState(
        filterValues?.terminal_financial_institution_code || ""
    );
    const [terminalFilterId, setTerminalFilterId] = useState(filterValues?.terminalFilterId || "");
    const [terminalFilterName, setTerminalFilterName] = useState("");
    const [providerName, setProviderName] = useState(filterValues?.provider || "");
    const [selectSpiCode, setSelectSpiCode] = useState(filterValues?.system_payment_instrument_code || "");

    const [reportLoading, setReportLoading] = useState(false);

    const { terminalsData, terminalsLoadingProcess } = useTerminalsListWithoutPagination(providerName);

    useEffect(() => {
        if (terminalsData) {
            setTerminalFilterName(
                terminalsData?.find(terminal => terminal.terminal_id === filterValues?.terminalFilterId)
                    ?.verbose_name || ""
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalsData]);

    const onPropertySelected = debounce(
        (
            value: string,
            type:
                | "terminal_payment_type_code"
                | "terminal_currency_code"
                | "terminal_financial_institution_code"
                | "terminalFilterId"
                | "system_payment_instrument_code"
        ) => {
            if (value) {
                setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
            }

            setPage(1);
        },
        300
    );

    const onProviderChanged = (provider: string) => {
        setProviderName(provider);

        setTerminalFilterId("");
        setTerminalFilterName("");
        setTerminalPaymentTypeCode("");
        setTerminalCurrencyCode("");
        setTerminalFinancialInstitutionCode("");
        setSelectSpiCode("");

        if (provider) {
            setFilters({ ["provider"]: provider }, displayedFilters, true);
        } else {
            setFilters({}, displayedFilters, true);
        }

        setPage(1);
    };

    const onTerminalPaymentTypeCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerminalPaymentTypeCode(value);
        onPropertySelected(value, "terminal_payment_type_code");
    };

    const onSystemPaymentInstrumentCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectSpiCode(value);
        onPropertySelected(value, "system_payment_instrument_code");
    };

    const onTerminalCurrencyCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerminalCurrencyCode(value);
        onPropertySelected(value, "terminal_currency_code");
    };

    const onTerminalFinancialInstitutionCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerminalFinancialInstitutionCode(value);
        onPropertySelected(value, "terminal_financial_institution_code");
    };

    const onTerminalIdFieldChanged = (value: string) => {
        if (value === terminalFilterId) {
            setTerminalFilterId("");
            onPropertySelected("", "terminalFilterId");
        } else {
            setTerminalFilterId(value);
            onPropertySelected(value, "terminalFilterId");
        }
    };

    const onTerminalNameChanged = (value: string) => {
        setTerminalFilterName(value);
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setTerminalPaymentTypeCode("");
        setTerminalCurrencyCode("");
        setTerminalFinancialInstitutionCode("");
        setTerminalFilterId("");
        setTerminalFilterName("");
        setProviderName("");
        setSelectSpiCode("");
    };

    const handleUploadReport = async (file: File, mode: string, terminal_ids: string[]) => {
        setReportLoading(true);

        try {
            const data = await dataProvider.uploadReport(file, mode as ImportStrategy, terminal_ids);

            appToast(
                "success",
                translate("resources.paymentSettings.reports.uploadSuccess", {
                    inserted: data?.data?.inserted,
                    skipped: data?.data?.skipped,
                    total: data?.data?.total,
                    updated: data?.data.updated
                })
            );
        } catch (error) {
            if (error instanceof Error) {
                const parsed = extractFieldsFromErrorMessage(error.message);
                if (parsed.type === "string_pattern_mismatch") {
                    appToast(
                        "error",
                        translate("resources.paymentSettings.reports.csvValidationErrorDescription", {
                            field: parsed.loc.join(" > "),
                            input: parsed.input
                        })
                    );
                } else {
                    appToast("error", error.message);
                }
            }
        } finally {
            setReportLoading(false);
            refresh();
        }
    };

    const handleUploadMultipleFiles = async (
        payment_type_file: File,
        financial_institution_file: File,
        currency_file: File,
        provider: string,
        terminal_ids: string[]
    ) => {
        try {
            const data = await dataProvider.uploadMultipleFiles(
                [payment_type_file, financial_institution_file, currency_file],
                provider,
                terminal_ids
            );

            appToast(
                "success",
                translate("resources.paymentSettings.reports.uploadSuccess", {
                    inserted: data?.data?.inserted,
                    skipped: data?.data?.skipped,
                    total: data?.data?.total,
                    updated: data?.data.updated
                })
            );
        } catch (error) {
            if (error instanceof Error) {
                const parsed = extractFieldsFromErrorMessage(error.message);
                if (parsed.type === "string_pattern_mismatch") {
                    appToast(
                        "error",
                        translate("resources.paymentSettings.reports.csvValidationErrorDescription", {
                            field: parsed.loc.join(" > "),
                            input: parsed.input
                        })
                    );
                } else {
                    appToast("error", error.message);
                }
            }
        } finally {
            setReportLoading(false);
            refresh();
        }
    };

    const handleDownloadReport = async (terminalId: string) => {
        setReportLoading(true);

        try {
            const response = await dataProvider.downloadReport(terminalId, {
                filter: filterValues
            });
            const contentDisposition = response?.headers?.get("Content-Disposition");
            let filename = "report.csv";
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename\*?=["']?(.*?)["']?(;|$)/i);
                if (matches?.[1]) {
                    filename = decodeURIComponent(matches[1]);
                }
            }

            const blob = await response.blob();

            if ((await blob.text()).length <= 4) {
                appToast("error", translate("resources.paymentSettings.reports.noData"));
                return;
            }

            const fileUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            }
        } finally {
            setReportLoading(false);
            refresh();
        }
    };

    return {
        providersData,
        providersLoadingProcess,
        onClearFilters,
        onProviderChanged,
        translate,
        terminalPaymentTypeCode,
        terminalCurrencyCode,
        terminalFinancialInstitutionCode,
        onTerminalPaymentTypeCodeChanged,
        onTerminalCurrencyCodeChanged,
        onTerminalFinancialInstitutionCodeChanged,
        terminalsLoadingProcess,
        providerName,
        terminalFilterName,
        terminalsData,
        terminalFilterId,
        onTerminalNameChanged,
        onTerminalIdFieldChanged,
        reportLoading,
        handleUploadReport,
        handleUploadMultipleFiles,
        handleDownloadReport,
        onSystemPaymentInstrumentCodeChanged,
        selectSpiCode
    };
};

export default useTerminalPaymentInstrumentFilter;
