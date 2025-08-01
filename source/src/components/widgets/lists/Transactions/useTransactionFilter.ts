import { debounce } from "lodash";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useListContext, usePermissions, useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";
import { API_URL } from "@/data/base";
import moment from "moment";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { AccountsDataProvider } from "@/data";
import { useFetchDictionaries, useMerchantsListWithoutPagination } from "@/hooks";
import { getFilenameFromContentDisposition } from "@/helpers/getFilenameFromContentDisposition";

const useTransactionFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const dictionaries = useFetchDictionaries();
    const { merchantData, merchantsLoadingProcess } = useMerchantsListWithoutPagination();
    const appToast = useAppToast();
    const translate = useTranslate();

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.start_date ? new Date(filterValues?.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.end_date ? new Date(filterValues?.end_date) : undefined
    );
    const [operationId, setOperationId] = useState(filterValues?.id || "");
    const [customerPaymentId, setCustomerPaymentId] = useState(filterValues?.customer_payment_id || "");
    const [merchantId, setMerchantId] = useState(filterValues?.accountId || "");
    const [merchantValue, setMerchantValue] = useState("");
    const [typeTabActive, setTypeTabActive] = useState(filterValues?.order_type ? Number(filterValues.order_type) : 0);
    const [orderStatusFilter, setOrderStatusFilter] = useState(filterValues?.order_state || "");

    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.accountId)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const chooseClassTabActive = useCallback(
        (type: number) => {
            return typeTabActive === type
                ? "text-green-50 dark:text-green-40 border-b-2 dark:border-green-40 border-green-50 pb-1 duration-200"
                : "pb-1 border-b-2 border-transparent duration-200 hover:text-green-40 text-neutral-70 dark:text-white";
        },
        [typeTabActive]
    );

    const onPropertySelected = debounce(
        (
            value: string | { from: string; to: string } | number,
            type: "id" | "customer_payment_id" | "accountId" | "order_type" | "order_state" | "date"
        ) => {
            if (value) {
                if (type === "date" && typeof value !== "string" && typeof value !== "number") {
                    setFilters(
                        { ...filterValues, ["start_date"]: value.from, ["end_date"]: value.to },
                        displayedFilters,
                        true
                    );
                } else {
                    setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
                }
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
            }
            setPage(1);
        },
        300
    );

    const onOperationIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setOperationId(e.target.value);
        onPropertySelected(e.target.value, "id");
    };

    const onCustomerPaymentIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomerPaymentId(e.target.value);
        onPropertySelected(e.target.value, "customer_payment_id");
    };

    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "accountId");
    };

    const onOrderStatusChanged = (order: string) => {
        setOrderStatusFilter(order);
        onPropertySelected(order, "order_state");
    };

    const changeDate = (date: DateRange | undefined) => {
        if (date) {
            if (date.from && date.to) {
                setStartDate(date.from);
                setEndDate(date.to);
                onPropertySelected({ from: formattedDate(date.from), to: formattedDate(date.to) }, "date");
            }
        } else {
            setStartDate(undefined);
            setEndDate(undefined);
            onPropertySelected({ from: "", to: "" }, "date");
        }
    };

    const onTabChanged = (value: number) => {
        setTypeTabActive(value);
        onPropertySelected(value, "order_type");
    };

    const clearFilters = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setOperationId("");
        setMerchantId("");
        setMerchantValue("");
        setCustomerPaymentId("");
        setOrderStatusFilter("");
        setTypeTabActive(0);
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    const handleDownloadReport = async (type: "pdf" | "csv") => {
        if (!startDate) {
            appToast("error", translate("resources.transactions.download.bothError"));
            return;
        }

        let filename = `data_${filterValues["start_date"]}_to_${filterValues["end_date"]}.${
            type === "csv" ? "csv" : "pdf"
        }`;

        try {
            const url = new URL(`${API_URL}/transactions/report?format=${type}`);
            Object.keys(filterValues).map(item => url.searchParams.set(item, filterValues[item]));

            appToast("success", translate("app.widgets.report.preDownload"));

            const response = await AccountsDataProvider.downloadReport(url);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const contentDisposition = response.headers.get("content-disposition");
            if (contentDisposition) {
                filename = getFilenameFromContentDisposition(contentDisposition, filename);
            }

            appToast("success", translate("app.widgets.report.download", { filename }));

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
            appToast("error", translate("app.widgets.report.downloadError", { filename }));
            console.error("There was an error downloading the file:", error);
        }
    };

    return {
        translate,
        dictionaries,
        adminOnly,
        operationId,
        onOperationIdChanged,
        customerPaymentId,
        onCustomerPaymentIdChanged,
        orderStatusFilter,
        onOrderStatusChanged,
        merchantData,
        merchantsLoadingProcess,
        merchantId,
        onMerchantChanged,
        merchantValue,
        setMerchantValue,
        startDate,
        endDate,
        changeDate,
        typeTabActive,
        onTabChanged,
        chooseClassTabActive,
        handleDownloadReport,
        clearFilters
    };
};

export default useTransactionFilter;
