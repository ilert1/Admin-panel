import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/data/base";
import { format } from "date-fns";

const useReportDownload = () => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isDateRangeValid, setIsDateRangeValid] = useState<boolean>(true);
    const [reqId, setReqId] = useState<string>("");

    const { toast } = useToast();
    const translate = useTranslate();

    const formattedStartDate = useMemo(() => (startDate ? format(startDate, "yyyy-MM-dd") : undefined), [startDate]);
    const formattedEndDate = useMemo(() => (endDate ? format(endDate, "yyyy-MM-dd") : undefined), [endDate]);

    const handleSelectedIdChange = (value: string) => {
        setReqId(value);
    };

    const validateDates = () => {
        if (!startDate || !endDate) {
            toast({
                description: translate("resources.transactions.download.bothError"),
                variant: "error",
                title: translate("resources.transactions.download.error")
            });
            return false;
        }
        if (startDate.getTime() > Date.now() || endDate.getTime() > Date.now()) {
            toast({
                description: translate("resources.transactions.download.dateExceed"),
                variant: "error",
                title: translate("resources.transactions.download.error")
            });
            return false;
        }
        const isValidDateRange = startDate?.getTime() <= endDate?.getTime();
        setIsDateRangeValid(isValidDateRange);

        if (!isValidDateRange) {
            toast({
                description: translate("resources.transactions.download.greaterError"),
                variant: "error",
                title: translate("resources.transactions.download.error")
            });
        }

        return isValidDateRange;
    };

    const handleDownload = async () => {
        if (!validateDates()) {
            return;
        }
        try {
            const url = `${API_URL}/transactions/report?start_date=${formattedStartDate}&end_date=${formattedEndDate}${
                reqId ? "&accountId=" + reqId : ""
            }`;

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
            const filename = `data_${formattedStartDate}_to_${formattedEndDate}.csv`;

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
        startDate,
        endDate,
        isDateRangeValid,
        reqId,
        setStartDate,
        setEndDate,
        handleDownload,
        setIsDateRangeValid,
        handleSelectedIdChange
    };
};

export default useReportDownload;
