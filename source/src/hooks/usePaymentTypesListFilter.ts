import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { PaymentTypesProvider } from "@/data/payment_types";
import { useAppToast } from "@/components/ui/toast/useAppToast";

const usePaymentTypesListFilter = () => {
    const translate = useTranslate();
    const dataProvider = new PaymentTypesProvider();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [code, setCode] = useState(filterValues?.code || "");
    const [title, setTitle] = useState(filterValues?.title || "");
    const [category, setCategory] = useState(filterValues?.category || "");
    const [reportLoading, setReportLoading] = useState(false);
    const appToast = useAppToast();
    const onPropertySelected = debounce((value: string, type: "code" | "title" | "category") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        onPropertySelected(e.target.value, "code");
    };

    const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        onPropertySelected(e.target.value, "title");
    };

    const onCategoryChanged = (value: string) => {
        setCategory(value);
        onPropertySelected(value, "category");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setCode("");
        setTitle("");
        setCategory("");
    };
    const handleDownloadReport = async (type: "pdf" | "csv" | "xlsx" = "xlsx") => {
        // if (!startDate || !endDate || (adminOnly && !merchantId)) {
        //     appToast("error", translate("resources.transactions.download.bothError"));
        //     return;
        // }
        setReportLoading(true);

        try {
            // const url = new URL(`${API_URL}/transactions/balance_report`);
            // url.searchParams.set("start_date", formattedDate(startDate));
            // url.searchParams.set("end_date", formattedDate(endDate));
            // url.searchParams.set("merchantId", merchantId);
            // let filename = `report_${merchantId && `merchantId_${merchantId}_`}${formattedDate(startDate)}_to_${formattedDate(endDate)}.${type}`;
            const filename = new Date().toISOString();
            const data = await dataProvider.downloadReport({});
            const blob = await data?.data?.blob();
            const fileUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(fileUrl);
            setReportLoading(false);
            // .then(response => {
            //     const contentDisposition = response?.headers?.get("Content-Disposition");
            //     const matches = contentDisposition?.match(/filename\*?=["']?(.+?)["']?;?$/i);
            //     filename = matches?.[1] ? matches[1] : filename;
            //     return response.blob();
            // })
            // .then(blob => {
            //     const fileUrl = window.URL.createObjectURL(blob);
            //     const a = document.createElement("a");
            //     a.href = fileUrl;
            //     a.download = filename;
            //     document.body.appendChild(a);
            //     a.click();
            //     a.remove();
            //     window.URL.revokeObjectURL(fileUrl);
            // })
            // .catch(error => {
            //     appToast("error", translate("resources.transactions.download.bothError"));
            //     console.error("There was an error downloading the file:", error);
            // })
            // .finally(() => {
            //     setReportLoading(false);
            // });
        } catch (error) {
            appToast("error", translate("resources.transactions.download.bothError"));
            console.error("There was an error downloading the file:", error);
        }
    };

    return {
        translate,
        code,
        title,
        category,
        onCategoryChanged,
        onClearFilters,
        onCodeChanged,
        onTitleChanged,
        handleDownloadReport
    };
};

export default usePaymentTypesListFilter;
