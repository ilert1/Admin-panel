import { ImportMode } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { FinancialInstitutionProvider } from "@/data/financialInstitution";
import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useRefresh, useTranslate } from "react-admin";

const useFinancialInstitutionsListFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const [name, setName] = useState(filterValues?.name || "");
    const [code, setCode] = useState(filterValues?.code || "");
    const [institutionType, setInstitutionType] = useState(filterValues?.institution_type || "");
    const [countryCode, setCountryCode] = useState(filterValues?.country_code || "");
    const [nspkMemberId, setNspkMemberId] = useState(filterValues?.nspk_member_id || "");
    const [reportLoading, setReportLoading] = useState(false);

    const appToast = useAppToast();
    const refresh = useRefresh();
    const dataProvider = new FinancialInstitutionProvider();

    const onPropertySelected = debounce(
        (value: string, type: "name" | "code" | "institution_type" | "country_code" | "nspk_member_id") => {
            if (value) {
                setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
            }
            setPage(1);
        },
        300
    );

    const onNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        onPropertySelected(e.target.value, "name");
    };

    const onCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        onPropertySelected(e.target.value, "code");
    };

    const onInstitutionTypeChanged = (value: string) => {
        setInstitutionType(value);
        onPropertySelected(value, "institution_type");
    };
    const onCountryCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCountryCode(value);
        onPropertySelected(value, "country_code");
    };
    const onNspkMemberIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNspkMemberId(value);
        onPropertySelected(value, "nspk_member_id");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setName("");
        setCode("");
        setInstitutionType("");
        setCountryCode("");
        setNspkMemberId("");
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
            setReportLoading(false);
            refresh();
        }
    };

    return {
        translate,
        name,
        code,
        institutionType,
        countryCode,
        nspkMemberId,
        reportLoading,
        onCodeChanged,
        onInstitutionTypeChanged,
        onCountryCodeChanged,
        onNspkMemberIdChanged,
        onClearFilters,
        onNameChanged,
        handleDownloadReport,
        handleUploadReport
    };
};

export default useFinancialInstitutionsListFilter;
