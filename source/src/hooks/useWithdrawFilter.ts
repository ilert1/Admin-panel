import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/data/base";
import { format } from "date-fns";
import { debounce } from "lodash";
import { DateRange } from "react-day-picker";

const useWithdrawFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [operationId, setOperationId] = useState(filterValues?.id || "");

    const { toast } = useToast();
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDownloadReport = async (type: "pdf" | "excel") => {
        if (!startDate || !endDate) {
            toast({
                description: translate("resources.withdraw.download.bothError"),
                variant: "error",
                title: translate("resources.withdraw.download.error")
            });

            return;
        }

        try {
            const url =
                `${API_URL}/withdraw/report?` +
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
