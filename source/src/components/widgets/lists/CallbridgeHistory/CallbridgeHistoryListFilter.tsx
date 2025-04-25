import { useTranslate } from "react-admin";
import { useEffect, useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { Label } from "@/components/ui/label";

interface MappingsListFilterProps {
    setFilters: (filters: unknown, displayedFilters?: unknown, debounce?: boolean) => void;
}

interface FilterObjectType {
    status?: string;
}

const selectValues = ["queued", "processing", "success", "error", "sync"];

export const CallbridgeHistoryListFilter = (props: MappingsListFilterProps) => {
    const { setFilters } = props;
    const translate = useTranslate();

    const [filterValue, setFilterValue] = useState("");

    const onClearFilters = () => {
        setFilterValue("");
    };

    useEffect(() => {
        const filtersObj: FilterObjectType = {};

        filterValue ? (filtersObj.status = filterValue) : "";

        setFilters(filtersObj, filtersObj);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue]);

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !filterValue;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex gap-4">
                    <FilterButtonGroup
                        filterList={[filterValue]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />
                </div>
            </div>
            <AnimatedContainer open={openFiltersClicked}>
                <div className="flex min-w-44 max-w-[25%] flex-1 flex-col gap-1">
                    <Label variant="title-2" className="mb-0">
                        {translate("resources.callbridge.history.fields.status")}
                    </Label>

                    <Select
                        value={filterValue?.toString()}
                        onValueChange={val => {
                            val === "null" ? setFilterValue("null") : setFilterValue(val as CallbackStatusEnum);
                        }}>
                        <SelectTrigger className="h-[38px] text-ellipsis">
                            <SelectValue
                                placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                            />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                {selectValues.map(el => {
                                    return (
                                        <SelectItem key={el} value={el}>
                                            {translate(`resources.callbridge.history.callbacksStatus.${el}`)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </AnimatedContainer>
        </div>
    );
};
