import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { toast } from "sonner";
import { API_URL } from "@/data/base";
import { format } from "date-fns";
import { debounce } from "lodash";
import { DateRange } from "react-day-picker";

const useWithdrawFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.start_date ? new Date(filterValues?.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.end_date ? new Date(filterValues?.end_date) : undefined
    );
    const [operationId, setOperationId] = useState(filterValues?.id || "");

    const translate = useTranslate();

    const formattedDate = (date: Date) => format(date, "yyyy-MM-dd");

    const onPropertySelected = debounce((value: string | { from: string; to: string }, type: "id" | "date") => {
        if (value) {
            if (type === "date" && typeof value !== "string") {
                setFilters({ ...filterValues, ["start_date"]: value.from, ["end_date"]: value.to }, displayedFilters);
            } else {
                setFilters({ ...filterValues, [type]: value }, displayedFilters);
            }
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters);
        }
        setPage(1);
    }, 300);

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
            const url =
                `${API_URL}/withdraw/report?format=${type}&` +
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
        operationId,
        onOperationIdChanged,
        startDate,
        endDate,
        changeDate,
        handleDownloadReport,
        clearFilters
    };
};

export default useWithdrawFilter;
