import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useRefresh, useTranslate } from "react-admin";
import { PaymentTypesProvider } from "@/data/payment_types";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { ImportMode } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

const usePaymentTypesListFilter = () => {
    const translate = useTranslate();
    const dataProvider = new PaymentTypesProvider();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [code, setCode] = useState(filterValues?.code || "");
    const [title, setTitle] = useState(filterValues?.title || "");
    const [category, setCategory] = useState(filterValues?.category || "");
    const [reportLoading, setReportLoading] = useState(false);
    const refresh = useRefresh();
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

    const handleDownloadReport = async () => {
        setReportLoading(true);

        try {
            const response = await dataProvider.downloadReport({
                filter: filterValues
            });
            const contentDisposition = response?.headers?.get("Content-Disposition");
            let filename = "report.csv";
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename\*?=["']?(.*?)["']?(;|$)/i);
                if (matches?.[1]) {
                    filename = decodeURIComponent(matches[1]);
                }
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            }
        } finally {
            setReportLoading(false);
            refresh();
        }
    };

    const handleUploadReport = async (file: File, mode: ImportMode) => {
        setReportLoading(true);

        try {
            const data = await dataProvider.uploadReport(file, mode);
            appToast(
                "success",
                translate("resources.paymentSettings.reports.uploadSuccess", {
                    inserted: data?.data?.inserted,
                    skipped: data?.data?.skipped,
                    total: data?.data?.total
                })
            );
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            }
        } finally {
            refresh();
            setReportLoading(false);
        }
    };

    return {
        translate,
        code,
        title,
        reportLoading,
        category,
        onCategoryChanged,
        onClearFilters,
        onCodeChanged,
        onTitleChanged,
        handleDownloadReport,
        handleUploadReport
    };
};

export default usePaymentTypesListFilter;

// Saving just in case we need it

// import Papa from "papaparse";
// const csvText = await blob.text();

// const result = Papa.parse<Record<string, string>>(csvText, {
//     header: true,
//     skipEmptyLines: true
// });

// // const parsedData = result.data.map(row => {
// //     const parsedRow: Record<string, any> = { ...row };

// //     ["meta", "currencies", "financial_institutions"].forEach(key => {
// //         try {
// //             parsedRow[key] = row[key] ? JSON.parse(row[key]) : null;
// //         } catch (e) {
// //             parsedRow[key] = row[key];
// //         }
// //     });

// //     return parsedRow;
// // });
