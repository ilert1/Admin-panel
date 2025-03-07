import { format } from "date-fns";
import { useMemo, useState } from "react";
import { usePermissions, useTranslate } from "react-admin";

import { API_URL } from "@/data/base";
import { useAppToast } from "@/components/ui/toast/useAppToast";

const useReportDownload = () => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isDateRangeValid, setIsDateRangeValid] = useState<boolean>(true);
    const [reqId, setReqId] = useState<string>("");

    const appToast = useAppToast();

    const translate = useTranslate();

    const formattedStartDate = useMemo(() => (startDate ? format(startDate, "yyyy-MM-dd") : ""), [startDate]);
    const formattedEndDate = useMemo(() => (endDate ? format(endDate, "yyyy-MM-dd") : ""), [endDate]);

    const handleSelectedIdChange = (value: string) => {
        setReqId(value);
    };

    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const validateDates = () => {
        if (!startDate || !endDate) {
            appToast("error", translate("resources.transactions.download.bothError"));
            return false;
        }
        if (startDate.getTime() > Date.now() || endDate.getTime() > Date.now()) {
            appToast("error", translate("resources.transactions.download.dateExceed"));
            return false;
        }
        const isValidDateRange = startDate?.getTime() <= endDate?.getTime();
        setIsDateRangeValid(isValidDateRange);

        if (!isValidDateRange) {
            appToast("error", translate("resources.transactions.download.greaterError"));
        }

        return isValidDateRange;
    };

    const validateMerchantID = () => {
        if (adminOnly && !reqId) {
            appToast("error", translate("resources.transactions.download.accountField"));
            return false;
        }
        return true;
    };

    const handleDownload = async () => {
        if (!validateDates() || !validateMerchantID()) {
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
