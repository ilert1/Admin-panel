import { debounce } from "lodash";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useListContext, usePermissions, useTranslate } from "react-admin";
import { DateRange, TZDate } from "react-day-picker";
import { toast } from "sonner";
import { API_URL } from "@/data/base";
import fetchDictionaries from "@/helpers/get-dictionaries";

const useTransactionFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const dictionaries = fetchDictionaries();

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.start_date ? new TZDate(filterValues?.start_date, "+00:00") : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.end_date ? new TZDate(filterValues?.end_date, "+00:00") : undefined
    );
    const [operationId, setOperationId] = useState(filterValues?.id || "");
    const [customerPaymentId, setCustomerPaymentId] = useState(filterValues?.customer_payment_id || "");
    const [account, setAccount] = useState(filterValues?.accountId || "");
    const [typeTabActive, setTypeTabActive] = useState(filterValues?.order_type ? Number(filterValues.order_type) : 0);
    const [orderStatusFilter, setOrderStatusFilter] = useState(filterValues?.order_state || "");

    const translate = useTranslate();

    const formattedDate = (date: Date) => new Date(date.toUTCString()).toISOString();

    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

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
                        displayedFilters
                    );
                } else {
                    setFilters({ ...filterValues, [type]: value }, displayedFilters);
                }
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters);
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

    const onAccountChanged = (account: string) => {
        setAccount(account);
        onPropertySelected(account, "accountId");
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
        setAccount("");
        setCustomerPaymentId("");
        setOrderStatusFilter("");
        setTypeTabActive(0);
        setFilters({}, displayedFilters);
        setPage(1);
    };

    const handleDownloadReport = async (type: "pdf" | "csv") => {
        if (adminOnly && !account) {
            toast.error(translate("resources.transactions.download.error"), {
                dismissible: true,
                description: translate("resources.transactions.download.accountField"),
                duration: 3000
            });

            return;
        }

        if (!startDate) {
            toast.error(translate("resources.transactions.download.error"), {
                dismissible: true,
                description: translate("resources.transactions.download.bothError"),
                duration: 3000
            });

            return;
        }

        try {
            const url =
                `${API_URL}/transactions/report?format=${type}&` +
                Object.keys(filterValues)
                    .map(item => {
                        return `${item}=${filterValues[item]}`;
                    })
                    .join("&");

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/octet-stream",
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            });

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
        account,
        onAccountChanged,
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
