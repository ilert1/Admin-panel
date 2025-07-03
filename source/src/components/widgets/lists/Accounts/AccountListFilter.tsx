import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { useState } from "react";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import useAccountFilter from "@/hooks/useAccountFilter";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/Button";
import { MerchantSelect } from "../../components/Selects/MerchantSelect";

export const AccountListFilter = () => {
    const {
        handleDownloadReport,
        reportLoading,
        merchantData,
        merchantId,
        merchantValue,
        setMerchantValue,
        merchantsLoadingProcess,
        translate,
        clearFilters,
        onMerchantChanged,
        adminOnly,
        startDate,
        endDate,
        changeDate
    } = useAccountFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !merchantValue && !startDate;

    return (
        <div>
            <div className="flex flex-col">
                <div className="mb-6 flex flex-wrap justify-between gap-4">
                    <ResourceHeaderTitle />

                    <FilterButtonGroup
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                        filterList={[merchantValue, startDate]}
                        onClearFilters={clearFilters}
                    />
                </div>

                <AnimatedContainer open={openFiltersClicked}>
                    <div className="mb-4 flex w-full flex-col flex-wrap justify-start gap-2 sm:mb-6 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                            {adminOnly && (
                                <div className="flex-grow-100 flex w-full min-w-[150px] max-w-[700px] flex-1 flex-col gap-1">
                                    <Label variant="title-2" className="mb-0 md:text-nowrap">
                                        {translate("resources.transactions.filter.filterByAccount")}
                                    </Label>

                                    <MerchantSelect
                                        merchants={merchantData || []}
                                        value={merchantValue}
                                        onChange={setMerchantValue}
                                        setIdValue={onMerchantChanged}
                                        disabled={merchantsLoadingProcess}
                                        style="Black"
                                    />
                                </div>
                            )}
                            <DateRangePicker
                                title={translate("resources.transactions.download.dateTitle")}
                                placeholder={translate("resources.transactions.filter.filterByDate")}
                                dateRange={{ from: startDate, to: endDate }}
                                onChange={changeDate}
                            />
                            <Button
                                onClick={() => handleDownloadReport(adminOnly, "xlsx")}
                                className="flex flex-1 items-center justify-center gap-1 font-normal sm:flex-none sm:self-end"
                                disabled={!startDate || (adminOnly && !merchantId) || reportLoading}>
                                <span>{translate("resources.transactions.download.downloadReportButtonText")}</span>
                            </Button>
                        </div>
                    </div>
                </AnimatedContainer>
            </div>
        </div>
    );
};
