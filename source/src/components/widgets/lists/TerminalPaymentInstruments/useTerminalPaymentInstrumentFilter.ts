import { ChangeEvent, useEffect, useState } from "react";
import { useListContext, useRefresh, useTranslate } from "react-admin";
import { debounce } from "lodash";
import { useProvidersListWithoutPagination, useTerminalsListWithoutPagination } from "@/hooks";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { useAppToast } from "@/components/ui/toast/useAppToast";

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
        setTerminalFilterId(value);
        onPropertySelected(value, "terminalFilterId");
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
    };

    const handleUploadReport = async (file: File) => {
        setReportLoading(true);

        try {
            const data = await dataProvider.uploadReport(file);
            appToast(
                "success",
                translate("resources.paymentSettings.reports.uploadSuccess", {
                    inserted: data?.data?.inserted,
                    skipped: data?.data?.skipped,
                    total: data?.data?.total
                })
            );
        } catch (error) {
            if (error instanceof Error) {
                // const parsed = extractFieldsFromErrorMessage(error.message);
                // if (parsed.type === "string_pattern_mismatch") {
                //     appToast(
                //         "error",
                //         translate("resources.paymentSettings.reports.csvValidationErrorDescription", {
                //             field: parsed.loc.join(" > "),
                //             input: parsed.input
                //         })
                //     );
                // } else {
                //     appToast("error", error.message);
                // }
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
        handleUploadReport
    };
};

export default useTerminalPaymentInstrumentFilter;
