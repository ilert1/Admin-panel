import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { useListContext, useRefresh, useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { ImportStrategy } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { SystemPaymentInstrumentsProvider } from "@/data/systemPaymentInstruments";
import extractFieldsFromErrorMessage from "@/helpers/extractErrorForCSV";
import { useCurrenciesListWithoutPagination } from "@/hooks";
import { PaymentTypesProvider } from "@/data/payment_types";

const useSystemPaymentInstrumentsListFilter = () => {
    const { currenciesData, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const translate = useTranslate();
    const paymentTypesProvider = new PaymentTypesProvider();
    const systemPIDataProvider = new SystemPaymentInstrumentsProvider();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const appToast = useAppToast();
    const refresh = useRefresh();

    const [code, setCode] = useState(filterValues?.code || "");
    const [currencyCode, setCurrencyCode] = useState("");
    const [paymentTypeCode, setPaymentTypeCode] = useState("");
    const [reportLoading, setReportLoading] = useState(false);

    const { data: paymentTypes, isLoading: isLoadingPaymentTypes } = useQuery({
        queryKey: ["paymentTypesForSystemPI", "getListWithoutPagination"],
        queryFn: ({ signal }) => paymentTypesProvider.getListWithoutPagination("payment_type", signal),
        select: data => data.data
    });

    useEffect(() => {
        if (currenciesData && filterValues?.currency_code) {
            const foundCurrencyCode = currenciesData.find(
                currency => currency.code === filterValues?.currency_code
            )?.code;

            if (foundCurrencyCode) {
                setCurrencyCode(foundCurrencyCode);
            } else {
                Reflect.deleteProperty(filterValues, "currency_code");
                setFilters(filterValues, displayedFilters, true);
                setCurrencyCode("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currenciesData]);

    useEffect(() => {
        if (paymentTypes && filterValues?.payment_type_code) {
            const foundPaymentTypeCode = paymentTypes.find(type => type.code === filterValues?.payment_type_code)?.code;

            if (foundPaymentTypeCode) {
                setPaymentTypeCode(foundPaymentTypeCode);
            } else {
                Reflect.deleteProperty(filterValues, "payment_type_code");
                setFilters(filterValues, displayedFilters, true);
                setPaymentTypeCode("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentTypes]);

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

    const handleUploadReport = async (file: File, mode: ImportStrategy) => {
        setReportLoading(true);

        try {
            const data = await systemPIDataProvider.uploadReport(file, mode);
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

    return {
        translate,
        code,
        currencyCode,
        paymentTypeCode,
        currenciesData,
        currenciesLoadingProcess,
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
