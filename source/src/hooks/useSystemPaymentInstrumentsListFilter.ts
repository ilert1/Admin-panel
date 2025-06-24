import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useDataProvider, useListContext, useRefresh, useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { ImportMode } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { SystemPaymentInstrumentsProvider } from "@/data/systemPaymentInstruments";
import extractFieldsFromErrorMessage from "@/helpers/extractErrorForCSV";

const useSystemPaymentInstrumentsListFilter = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const systemPIDataProvider = new SystemPaymentInstrumentsProvider();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const [code, setCode] = useState(filterValues?.code || "");
    const [currencyCode, setCurrencyCode] = useState(filterValues?.currency_code || "");
    const [paymentTypeCode, setPaymentTypeCode] = useState<CallbackStatusEnum | "">(
        filterValues?.payment_type_code || ""
    );

    const [reportLoading, setReportLoading] = useState(false);
    const appToast = useAppToast();
    const refresh = useRefresh();

    const { data: currencies, isLoading: isLoadingCurrencies } = useQuery({
        queryKey: ["currencies"],
        queryFn: ({ signal }) => dataProvider.getListWithoutPagination("currency", signal),
        select: data => data.data
    });

    const { data: paymentTypes, isLoading: isLoadingPaymentTypes } = useQuery({
        queryKey: ["paymentTypesForSystemPI"],
        queryFn: () => dataProvider.getListWithoutPagination("payment_type"),
        select: data => data.data
    });

    const onPropertySelected = debounce((value: string, type: "code" | "currency_code" | "payment_type_code") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        onPropertySelected(e.target.value, "code");
    };

    const onCurrencyCodeChanged = (e: string) => {
        setCurrencyCode(e);
        onPropertySelected(e, "currency_code");
    };

    const onPaymentTypeCodeChanged = (value: CallbackStatusEnum | "") => {
        setPaymentTypeCode(value);
        onPropertySelected(value, "payment_type_code");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setCode("");
        setCurrencyCode("");
        setPaymentTypeCode("");
    };
    const handleDownloadReport = async () => {
        setReportLoading(true);

        try {
            const response = await systemPIDataProvider.downloadReport({
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

    const handleUploadReport = async (file: File, mode: ImportMode) => {
        setReportLoading(true);

        try {
            const data = await systemPIDataProvider.uploadReport(file, mode);
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
                const parsed = extractFieldsFromErrorMessage(error.message);
                if (parsed.type === "string_pattern_mismatch") {
                    appToast(
                        "error",
                        translate("resources.paymentSettings.reports.csvValidationErrorDescription", {
                            field: parsed.loc.join(" > "),
                            input: parsed.input
                        }),
                        translate("resources.paymentSettings.reports.csvValidationError")
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

    return {
        translate,
        code,
        currencyCode,
        paymentTypeCode,
        currencies,
        isLoadingCurrencies,
        paymentTypes,
        isLoadingPaymentTypes,
        onPaymentTypeCodeChanged,
        onClearFilters,
        onCodeChanged,
        onCurrencyCodeChanged,
        handleDownloadReport,
        handleUploadReport,
        reportLoading
    };
};

export default useSystemPaymentInstrumentsListFilter;
