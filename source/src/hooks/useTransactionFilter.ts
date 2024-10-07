import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useDataProvider, useGetList, useListContext, usePermissions, useTranslate } from "react-admin";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/data/base";
import { format } from "date-fns";
import { useQuery } from "react-query";
import { debounce } from "lodash";
import { DateRange } from "react-day-picker";

const useTransactionFilter = () => {
    const dataProvider = useDataProvider();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());

    // TODO: временное решение, нужно расширить компонент селекта для поддержки пагинациц
    const { data: accounts } = useGetList("accounts", { pagination: { perPage: 100, page: 1 } });

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [operationId, setOperationId] = useState(filterValues?.id || "");
    const [customerPaymentId, setCustomerPaymentId] = useState(filterValues?.customer_payment_id || "");
    const [account, setAccount] = useState(accounts?.find(account => filterValues?.accountId === account.id) || "");
    const [typeTabActive, setTypeTabActive] = useState("");

    const orderStatusIndex = Object.keys(data.states).find(
        index => filterValues?.orderStatus === data.states[index].state_description
    );
    const [orderStatusFilter, setOrderStatusFilter] = useState(orderStatusIndex ? data.states[orderStatusIndex] : "");

    const { toast } = useToast();
    const translate = useTranslate();

    const formattedDate = (date: Date) => format(date, "yyyy-MM-dd");

    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const chooseClassTabActive = useCallback(
        (type: string) => {
            return typeTabActive === type
                ? "text-green-50 dark:text-green-40 border-b-2 dark:border-green-40 border-green-50 pb-1 duration-200"
                : "pb-1 border-b-2 border-transparent duration-200 hover:text-green-40";
        },
        [typeTabActive]
    );

    const onPropertySelected = debounce(
        (
            value: string | { from: string; to: string },
            type: "id" | "customer_payment_id" | "accountId" | "type" | "order_status" | "date"
        ) => {
            if (value) {
                if (type === "date" && typeof value !== "string") {
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

    const onAccountChanged = (account: Account | string) => {
        setAccount(account);

        if (typeof account === "string") {
            onPropertySelected(account, "accountId");
        } else {
            onPropertySelected(account.id, "accountId");
        }
    };

    const onOrderStatusChanged = (order: string | { state_description: string }) => {
        setOrderStatusFilter(order);

        if (typeof order === "string") {
            onPropertySelected(order, "order_status");
        } else {
            onPropertySelected(order.state_description, "order_status");
        }
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
        }
    };

    const onTabChanged = (value: { type_descr: string; type: string }) => {
        setTypeTabActive(value.type_descr);
        onPropertySelected(value.type, "type");
    };

    const clearFilters = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setOperationId("");
        setAccount("");
        setCustomerPaymentId("");
        setOrderStatusFilter("");
        setTypeTabActive("");
        setFilters({}, displayedFilters);
        setPage(1);
    };

    const handleDownloadReport = async (type: "pdf" | "excel") => {
        if (adminOnly && !account.id) {
            toast({
                description: translate("resources.transactions.download.accountField"),
                variant: "error",
                title: translate("resources.transactions.download.error")
            });

            return;
        }

        if (!startDate || !endDate) {
            toast({
                description: translate("resources.transactions.download.bothError"),
                variant: "error",
                title: translate("resources.transactions.download.error")
            });

            return;
        }

        try {
            const url =
                `${API_URL}/transactions/report?` +
                Object.keys(filterValues)
                    .map((item, index) => {
                        if (index > 0) {
                            return `&${item}=${filterValues[item]}`;
                        } else {
                            return `${item}=${filterValues[item]}`;
                        }
                    })
                    .join("");

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
            const filename = `data_${filterValues["start_date"]}_to_${filterValues["end_date"]}.csv`;

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
        data,
        adminOnly,
        accounts,
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
