import { debounce } from "lodash";
import { ChangeEvent, useCallback, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { API_URL } from "@/data/base";
import fetchDictionaries from "@/helpers/get-dictionaries";
import moment from "moment";

const useWithdrawFilter = () => {
    const dictionaries = fetchDictionaries();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.start_date ? new Date(filterValues?.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.end_date ? new Date(filterValues?.end_date) : undefined
    );

    const [typeTabActive, setTypeTabActive] = useState(filterValues?.order_type ? Number(filterValues.order_type) : 0);

    const [operationId, setOperationId] = useState(filterValues?.id || "");

    const translate = useTranslate();

    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const onPropertySelected = debounce(
        (value: string | { from: string; to: string } | number, type: "id" | "date" | "order_type") => {
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

    const clearFilters = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setOperationId("");
        setTypeTabActive(0);
        setFilters({}, displayedFilters);
        setPage(1);
    };

    const handleDownloadReport = async (type: "pdf" | "csv") => {
        if (!startDate || !endDate) {
            toast.error(translate("resources.withdraw.download.error"), {
                description: translate("resources.withdraw.download.bothError"),
                dismissible: true,
                duration: 3000
            });

            return;
        }

        try {
            const url = new URL(`${API_URL}/withdraw/report?format=${type}&`);
            Object.keys(filterValues).map(item => url.searchParams.set(item, filterValues[item]));

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
        endDate,
        startDate,
        typeTabActive,
        translate,
        onOperationIdChanged,
        changeDate,
        handleDownloadReport,
        clearFilters,
        chooseClassTabActive,
        onTabChanged
    };
};

export default useWithdrawFilter;
