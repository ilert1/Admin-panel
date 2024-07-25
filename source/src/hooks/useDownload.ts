import { useState } from "react";
import { useTranslate } from "react-admin";

const useFileDownload = (url: string) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [isStartDateValid, setIsStartDateValid] = useState<boolean>(true);
    const [isEndDateValid, setIsEndDateValid] = useState<boolean>(true);
    const [isDateRangeValid, setIsDateRangeValid] = useState<boolean>(true);
    const translate = useTranslate();
    const validateDates = () => {
        const isStartDateEmpty = startDate === "";
        const isEndDateEmpty = endDate === "";

        setIsStartDateValid(!isStartDateEmpty);
        setIsEndDateValid(!isEndDateEmpty);

        if (isStartDateEmpty || isEndDateEmpty) {
            // prompt(translate("resources.transactions.download.bothError"));

            return false;
        }

        const isValidDateRange = new Date(startDate) < new Date(endDate);
        setIsDateRangeValid(isValidDateRange);

        if (!isValidDateRange) {
            // prompt(translate("resources.transactions.download.greaterError"));
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
                    "Content-Type": "application/octet-stream"
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = "filename.ext"; // имя файла и его расширение
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

// const [startDate, setStartDate] = useState("");
// const [endDate, setEndDate] = useState("");
// const [isStartDateValid, setIsStartDateValid] = useState(true);
// const [isEndDateValid, setIsEndDateValid] = useState(true);
// const [isDateRangeValid, setIsDateRangeValid] = useState(true);

// const handleDownload = async () => {
//     // Проверка выбора дат
//     const isStartDateEmpty = startDate === "";
//     const isEndDateEmpty = endDate === "";

//     setIsStartDateValid(!isStartDateEmpty);
//     setIsEndDateValid(!isEndDateEmpty);

//     if (isStartDateEmpty || isEndDateEmpty) {
//         return;
//     }

//     // Проверка правильности диапазона дат
//     const isValidDateRange = new Date(startDate) < new Date(endDate);
//     setIsDateRangeValid(isValidDateRange);

//     if (!isValidDateRange) {
//         return;
//     }

//     try {
//         const response = await fetch("URL_TO_YOUR_BACKEND_API", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/octet-stream"
//             }
//         });

//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "filename.ext"; // имя файла и его расширение
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//     } catch (error) {
//         console.error("There was an error downloading the file:", error);
//     }
// };
