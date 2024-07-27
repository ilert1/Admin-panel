import { useState } from "react";
import { useTranslate } from "react-admin";
import { useToast } from "@/components/ui/use-toast";

const useFileDownload = (url: string) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [isStartDateValid, setIsStartDateValid] = useState<boolean>(true);
    const [isEndDateValid, setIsEndDateValid] = useState<boolean>(true);
    const [isDateRangeValid, setIsDateRangeValid] = useState<boolean>(true);
    const { toast } = useToast();

    const translate = useTranslate();
    const validateDates = () => {
        const isStartDateEmpty = startDate === "";
        const isEndDateEmpty = endDate === "";

        setIsStartDateValid(!isStartDateEmpty);
        setIsEndDateValid(!isEndDateEmpty);

        if (isStartDateEmpty || isEndDateEmpty) {
            toast({
                description: translate("resources.transactions.download.bothError"),
                variant: "destructive",
                title: translate("resources.transactions.download.error")
            });
            return false;
        }

        const isValidDateRange = new Date(startDate) <= new Date(endDate);
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
            const a = document.createElement("a");
            const formattedStartDate = startDate.replace(/-/g, "");
            const formattedEndDate = endDate.replace(/-/g, "");
            const filename = `data_${formattedStartDate}_to_${formattedEndDate}.csv`;
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
        isStartDateValid,
        isEndDateValid,
        isDateRangeValid,
        setStartDate,
        setEndDate,
        handleDownload,
        setIsEndDateValid,
        setIsStartDateValid,
        setIsDateRangeValid
    };
};

export default useFileDownload;
