import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import useCallbackListFilter from "./useCallbackListFilter";

export const CallbackBackupListFilter = () => {
    const { translate, startDate, endDate, sortDirection, onSortDirectionChanged, changeDate, onClearFilters } =
        useCallbackListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !startDate && !endDate && sortDirection === "asc";
    const filterList = [startDate, endDate, ...[sortDirection !== "asc" ? sortDirection : ""]];

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
                        <div className="flex min-w-[50%] max-w-full flex-1 flex-col gap-1 sm:min-w-44 sm:max-w-[25%]">
                            <Label variant="title-2" className="mb-0">
                                {translate("resources.callbridge.history_backup.filter.sortBy")}
                            </Label>

                            <Select
                                value={sortDirection}
                                onValueChange={value => {
                                    console.log(value);
                                    value === "asc" || value === "desc"
                                        ? onSortDirectionChanged(value)
                                        : onSortDirectionChanged("asc");
                                }}>
                                <SelectTrigger className="h-[38px] text-ellipsis">
                                    <SelectValue
                                        placeholder={translate("resources.callbridge.history_backup.filter.sortBy")}
                                    />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value={"asc"}>
                                            {translate("resources.callbridge.history_backup.sortDirections.asc")}
                                        </SelectItem>
                                        <SelectItem value={"desc"}>
                                            {translate("resources.callbridge.history_backup.sortDirections.desc")}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </div>
    );
};
