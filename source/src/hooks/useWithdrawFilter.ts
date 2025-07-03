import { debounce } from "lodash";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useListContext, usePermissions, useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";
import { API_URL } from "@/data/base";
import fetchDictionaries from "@/helpers/get-dictionaries";
import moment from "moment";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { MerchantsDataProvider, WithdrawDataProvider } from "@/data";

const useWithdrawFilter = () => {
    const dictionaries = fetchDictionaries();
    const withdrawDataProvider = WithdrawDataProvider;
    const merchantsDataProvider = new MerchantsDataProvider();
    const appToast = useAppToast();
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { permissions } = usePermissions();

    const {
        data: merchantData,
        isFetching: isMerchantsFetching,
        isLoading: isMerchantsLoading
    } = useQuery({
        queryKey: ["merchants", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("merchant", signal),
        select: data => data?.data
    });

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.start_date ? new Date(filterValues?.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.end_date ? new Date(filterValues?.end_date) : undefined
    );
    const [statusFilter, setStatusFilter] = useState<string>(filterValues?.order_state || "");
    const [typeTabActive, setTypeTabActive] = useState(filterValues?.order_type ? Number(filterValues.order_type) : 0);
    const [merchantId, setMerchantId] = useState<string>(filterValues?.accountId || "");
    const [merchantValue, setMerchantValue] = useState("");
    const [operationId, setOperationId] = useState<string>(filterValues?.id || "");
    const [operationTrc20, setOperationTrc20] = useState<string>(filterValues?.dst_address || "");

    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.accountId)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const merchantsLoadingProcess = useMemo(
        () => isMerchantsLoading || isMerchantsFetching,
        [isMerchantsLoading, isMerchantsFetching]
    );

    const onPropertySelected = debounce(
        (
            value: string | { from: string; to: string } | number,
            type: "id" | "dst_address" | "date" | "order_type" | "accountId" | "order_state"
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

    const onOperationTrc20Changed = (e: ChangeEvent<HTMLInputElement>) => {
        setOperationTrc20(e.target.value);
        onPropertySelected(e.target.value, "dst_address");
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

    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "accountId");
    };

    const onStatusFilterChanged = (order: string) => {
        setStatusFilter(order);
        onPropertySelected(order, "order_state");
    };

    const clearFilters = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setOperationId("");
        setOperationTrc20("");
        setMerchantId("");
        setMerchantValue("");
        setStatusFilter("");
        setTypeTabActive(0);
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    const handleDownloadReport = async (type: "pdf" | "csv") => {
        if (!startDate || !endDate) {
            appToast("error", translate("resources.withdraw.download.bothError"));

            return;
        }

        try {
            const url = new URL(`${API_URL}/withdraw/report?format=${type}&`);
            Object.keys(filterValues).map(item => url.searchParams.set(item, filterValues[item]));

            const response = await withdrawDataProvider.downloadReport(url);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);
            const filename = `data_${filterValues["start_date"]}_to_${filterValues["end_date"]}.${
                type === "csv" ? "csv" : "pdf"
            }`;

            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error("There was an error downloading the file:", error);
        }
    };

    const chooseClassTabActive = useCallback(
        (type: number) => {
            return typeTabActive === type
                ? "text-green-50 dark:text-green-40 border-b-2 dark:border-green-40 border-green-50 pb-1 duration-200"
                : "pb-1 border-b-2 border-transparent duration-200 hover:text-green-40";
        },
        [typeTabActive]
    );

    const onTabChanged = (value: number) => {
        setTypeTabActive(value);
        onPropertySelected(value, "order_type");
    };

    return {
        dictionaries,
        operationId,
        operationTrc20,
        endDate,
        startDate,
        merchantData,
        merchantsLoadingProcess,
        merchantId,
        merchantValue,
        setMerchantValue,
        onMerchantChanged,
        statusFilter,
        typeTabActive,
        translate,
        onOperationIdChanged,
        onOperationTrc20Changed,
        changeDate,
        handleDownloadReport,
        clearFilters,
        chooseClassTabActive,
        onTabChanged,
        onStatusFilterChanged,
        adminOnly
    };
};

export default useWithdrawFilter;
