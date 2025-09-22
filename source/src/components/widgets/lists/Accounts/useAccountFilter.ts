import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useListContext, usePermissions, useTranslate } from "react-admin";
import moment from "moment";
import { API_URL } from "@/data/base";
import { AccountsDataProvider } from "@/data";
import { DateRange } from "react-day-picker";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useMerchantsListWithoutPagination } from "@/hooks";
import { getFilenameFromContentDisposition } from "@/helpers/getFilenameFromContentDisposition";

const useAccountFilter = () => {
    const appToast = useAppToast();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { merchantData, merchantsLoadingProcess } = useMerchantsListWithoutPagination();

    const [merchantId, setMerchantId] = useState(filterValues?.merchantId || "");
    const [merchantValue, setMerchantValue] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.start_date ? new Date(filterValues?.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.end_date ? new Date(filterValues?.end_date) : undefined
    );
    const [reportLoading, setReportLoading] = useState(false);

    const translate = useTranslate();

    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    useEffect(() => {
        if (merchantData && filterValues?.merchantId) {
            const foundMerchant = merchantData.find(merchant => merchant.id === filterValues?.merchantId)?.name;

            if (foundMerchant) {
                setMerchantValue(foundMerchant);
            } else {
                Reflect.deleteProperty(filterValues, "merchantId");
                setFilters(filterValues, displayedFilters, true);
                setMerchantValue("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const onPropertySelected = debounce((value: string, type: "merchantId") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "merchantId");
    };

    const clearFilters = () => {
        setMerchantId("");
        setMerchantValue("");
        setStartDate(undefined);
        setEndDate(undefined);
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const changeDate = (date: DateRange | undefined) => {
        if (date) {
            if (date.from) {
                const end_date = date.to ?? undefined;
                const start_date = date.from;

                setStartDate(start_date);
                setEndDate(end_date);

                setFilters(
                    {
                        ...filterValues,
                        start_date: start_date,
                        end_date: end_date
                    },
                    displayedFilters
                );
            }
        } else {
            setStartDate(undefined);
            setEndDate(undefined);
            setFilters(
                {
                    ...filterValues,
                    start_date: undefined,
                    end_date: undefined
                },
                displayedFilters
            );
        }
    };

    const handleDownloadReport = async (adminOnly: boolean = false, type: "pdf" | "csv" | "xlsx" = "xlsx") => {
        if (!startDate || !endDate || (adminOnly && !merchantId)) {
            appToast("error", translate("resources.transactions.download.bothError"));
            return;
        }

        setReportLoading(true);

        try {
            const url = new URL(`${API_URL}/transactions/balance_report`);
            url.searchParams.set("start_date", formattedDate(startDate));
            url.searchParams.set("end_date", formattedDate(endDate));
            url.searchParams.set("merchantId", merchantId);

            appToast("success", translate("app.widgets.report.preDownload"));

            let filename = `report_${merchantId && `merchantId_${merchantId}_`}${formattedDate(startDate)}_to_${formattedDate(endDate)}.${type}`;

            AccountsDataProvider.downloadBalanceReport(url)
                .then(async response => {
                    if (response.headers.get("content-type") === "application/json") {
                        const data = await response.json();

                        if (!data.success) {
                            appToast("error", translate("app.widgets.report.notFoundData"));
                            return;
                        }
                    }

                    const contentDisposition = response.headers.get("content-disposition");
                    if (contentDisposition) {
                        filename = getFilenameFromContentDisposition(contentDisposition, filename);
                    }

                    appToast("success", translate("app.widgets.report.download", { filename }));

                    return response.blob();
                })
                .then(blob => {
                    if (blob) {
                        const fileUrl = window.URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = fileUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(fileUrl);
                    }
                })
                .catch(error => {
                    appToast("error", translate("app.widgets.report.downloadError", { filename }));
                    console.error("There was an error downloading the file:", error);
                })
                .finally(() => {
                    setReportLoading(false);
                });
        } catch (error) {
            appToast("error", translate("resources.transactions.download.bothError"));
            console.error("There was an error downloading the file:", error);
        }
    };

    return {
        handleDownloadReport,
        reportLoading,
        merchantData,
        merchantId,
        merchantValue,
        setMerchantValue,
        merchantsLoadingProcess,
        translate,
        clearFilters,
        onMerchantChanged,
        adminOnly,
        startDate,
        endDate,
        changeDate
    };
};

export default useAccountFilter;
