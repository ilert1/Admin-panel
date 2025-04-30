import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { useState } from "react";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import useAccountFilter from "@/hooks/useAccountFilter";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useListContext } from "react-admin";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { API_URL } from "@/data/base";
import moment from "moment";

// interface AccountListFilterProps {
//     setFilters: (filters: unknown, displayedFilters?: unknown, debounce?: boolean | undefined) => void;
// }

export const AccountListFilter = () => {
    // const { setFilters } = props;
    const { filterValues, setFilters } = useListContext();
    const appToast = useAppToast();
    const { merchantId, onMerchantChanged, translate, clearFilters, adminOnly } = useAccountFilter();
    // const [accountId, setAccountId] = useState(filterValues.id ?? "");

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.start_date ? new Date(filterValues?.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.end_date ? new Date(filterValues?.end_date) : undefined
    );

    const [reportLoading, setReportLoading] = useState(false);

    const clear = () => {
        setFilters({}, {});
        setStartDate(undefined);
        setEndDate(undefined);
        clearFilters();
    };

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const handleDownloadReport = async (type: "pdf" | "csv") => {
        if (!startDate || !endDate || !merchantId) {
            appToast("error", translate("resources.transactions.download.bothError"));
            return;
        }

        setReportLoading(true);

        try {
            const url = new URL(`${API_URL}/transactions/balance_report`);
            url.searchParams.set("start_date", formattedDate(startDate));
            url.searchParams.set("end_date", formattedDate(endDate));
            url.searchParams.set("merchantId", merchantId);

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
        } finally {
            setReportLoading(false);
        }
    };

    const changeDate = (date: DateRange | undefined) => {
        if (date) {
            if (date.from && date.to) {
                setStartDate(date.from);
                setEndDate(date.to);

                setFilters(
                    {
                        start_date: startDate,
                        end_date: endDate,
                        merchantId: filterValues.merchantId ?? undefined
                    },
                    {
                        start_date: startDate,
                        end_date: endDate,
                        merchantId: filterValues.merchantId ?? undefined
                    }
                );
            }
        } else {
            setStartDate(undefined);
            setEndDate(undefined);
        }
    };

    // useEffect(() => {
    //     const filters: FilterObjectType = {};
    //     // accountId ? (filters.id = accountId) : "";

    //     setFilters(filters);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [accountId]);

    const clearDisabled = !merchantId;
    return (
        <div>
            <div className="flex flex-col">
                <div className="mb-6 flex flex-wrap justify-between gap-4">
                    <ResourceHeaderTitle />

                    {adminOnly && (
                        <FilterButtonGroup
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            clearButtonDisabled={clearDisabled}
                            filterList={[merchantId, startDate]}
                            onClearFilters={clear}
                        />
                    )}
                </div>
                {adminOnly && (
                    <AnimatedContainer open={openFiltersClicked}>
                        <div className="mb-4 flex w-full flex-col flex-wrap justify-start gap-2 sm:mb-6 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                            <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                                <div className="flex-grow-100 flex w-full min-w-[150px] max-w-[700px] flex-1 flex-col gap-1">
                                    <Label variant="title-2" className="mb-0 md:text-nowrap">
                                        {translate("resources.transactions.filter.filterByAccount")}
                                    </Label>

                                    <MerchantSelectFilter
                                        merchant={merchantId}
                                        onMerchantChanged={onMerchantChanged}
                                        resource="merchant"
                                    />
                                </div>
                                <DateRangePicker
                                    title={translate("resources.transactions.download.dateTitle")}
                                    placeholder={translate("resources.transactions.filter.filterByDate")}
                                    dateRange={{ from: startDate, to: endDate }}
                                    onChange={changeDate}
                                />
                                <Button
                                    onClick={() => handleDownloadReport("csv")}
                                    className="flex flex-1 items-center justify-center gap-1 font-normal sm:flex-none sm:self-end"
                                    disabled={reportLoading}>
                                    <span>{translate("resources.transactions.download.downloadReportButtonText")}</span>
                                </Button>
                                {/* <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="sm:self-end">
                                        <Button
                                            disabled={(!startDate && adminOnly) || !merchantId}
                                            className="mt-1 sm:mt-0 md:ml-auto"
                                            variant="default"
                                            size="sm">
                                            {translate("resources.transactions.download.downloadReportButtonText")}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="border-green-50 p-0" align="end">
                                        <DropdownMenuItem
                                            className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-neutral-80 focus:dark:text-white"
                                            onClick={() => handleDownloadReport("csv")}>
                                            CSV
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-neutral-80 focus:dark:text-white"
                                            onClick={() => handleDownloadReport("pdf")}>
                                            PDF
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu> */}
                            </div>
                        </div>
                    </AnimatedContainer>
                )}
            </div>
        </div>
    );
};
