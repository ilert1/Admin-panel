import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import useCallbackListFilter from "./useCallbackListFilter";

export const CallbackBackupListFilter = () => {
    const { translate, startDate, endDate, changeDate, onClearFilters } = useCallbackListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !startDate;
    const filterList = [startDate];

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={filterList}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />
                </div>
            </div>
            <AnimatedContainer open={openFiltersClicked}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        <DateRangePicker
                            title={translate("resources.withdraw.filter.filterByDate")}
                            placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                            dateRange={{ from: startDate, to: endDate }}
                            onChange={changeDate}
                        />
                    </div>
                </div>
            </AnimatedContainer>
        </div>
    );
};
