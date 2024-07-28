import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/data/base";
import { format } from "date-fns";

const useReportDownload = (accountId: string) => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isDateRangeValid, setIsDateRangeValid] = useState<boolean>(true);
    const { toast } = useToast();
    const translate = useTranslate();

    const formattedStartDate = useMemo(() => (startDate ? format(startDate, "yyyy-MM-dd") : ""), [startDate]);
    const formattedEndDate = useMemo(() => (endDate ? format(endDate, "yyyy-MM-dd") : ""), [endDate]);

    const validateDates = () => {
        if (!startDate || !endDate) {
            toast({
                description: translate("resources.transactions.download.bothError"),
                variant: "destructive",
                title: translate("resources.transactions.download.error")
            });
            return false;
        }
        if (startDate.getTime() > Date.now() || endDate.getTime() > Date.now()) {
            toast({
                description: translate("resources.transactions.download.dateExceed"),
                variant: "destructive",
                title: translate("resources.transactions.download.error")
            });
            return false;
        }
        const isValidDateRange = startDate?.getTime() <= endDate?.getTime();
        setIsDateRangeValid(isValidDateRange);

        if (!isValidDateRange) {
            toast({
                description: translate("resources.transactions.download.greaterError"),
                variant: "destructive",
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
            const url = `${API_URL}/transactions/report?start_date=${formattedStartDate}&end_date=${formattedEndDate}&accountId=${accountId}`; // &accountId=fe3bbc89-1540-4a60-9bf3-46d988b375b1

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
        setStartDate,
        setEndDate,
        handleDownload,
        setIsDateRangeValid
    };
};

export default useReportDownload;
