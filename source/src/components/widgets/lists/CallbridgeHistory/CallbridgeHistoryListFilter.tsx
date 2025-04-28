import { useTranslate } from "react-admin";
import { useEffect, useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";

interface MappingsListFilterProps {
    setFilters: (filters: unknown, displayedFilters?: unknown, debounce?: boolean) => void;
}

interface FilterObjectType {
    status?: string;
    mapping_id?: string;
    callback_id?: string;
    original_url?: string;
    // trigger_type?: string;
}

const selectValues = ["queued", "processing", "success", "error", "sync"];
// const triggerTypeValues = ["system", "retry", "manual", "unknown"];

export const CallbridgeHistoryListFilter = (props: MappingsListFilterProps) => {
    const { setFilters } = props;
    const translate = useTranslate();

    const [filterValue, setFilterValue] = useState("");
    const [mappingId, setMappingId] = useState("");
    const [callbackId, setCallbackId] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");
    // const [triggerType, setTriggerType] = useState("");

    const onClearFilters = () => {
        setFilterValue("");
        setMappingId("");
        setCallbackId("");
        setOriginalUrl("");
        // setTriggerType("");
    };

    useEffect(() => {
        const filtersObj: FilterObjectType = {};

        filterValue ? (filtersObj.status = filterValue) : "";
        // triggerType ? (filtersObj.trigger_type = triggerType) : "";
        mappingId ? (filtersObj.mapping_id = mappingId) : "";
        callbackId ? (filtersObj.callback_id = callbackId) : "";
        originalUrl ? (filtersObj.original_url = originalUrl) : "";

        setFilters(filtersObj, filtersObj);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        callbackId,
        filterValue,
        mappingId,
        originalUrl
        // triggerType
    ]);

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !filterValue && !mappingId && !callbackId && !originalUrl;
    //  && !triggerType;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[
                            filterValue,
                            mappingId,
                            callbackId,
                            originalUrl
                            // triggerType
                        ]}
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
                        <Input
                            label={translate("resources.callbridge.history.fields.mapping_id")}
                            labelSize="title-2"
                            className="max-w-6C min-w-40"
                            value={mappingId}
                            onChange={e => setMappingId(e.target.value)}
                        />
                        <Input
                            label={"Callback ID"}
                            labelSize="title-2"
                            value={callbackId}
                            onChange={e => setCallbackId(e.target.value)}
                            className="max-w-6C min-w-40"
                        />
                        <Input
                            label={translate("resources.callbridge.history.fields.original_url")}
                            labelSize="title-2"
                            value={originalUrl}
                            className="max-w-6C min-w-40"
                            onChange={e => setOriginalUrl(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        <div className="flex min-w-[50%] max-w-full flex-1 flex-col gap-1 sm:min-w-44 sm:max-w-[25%]">
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
                        {/* <div className="flex min-w-[50%] max-w-full flex-1 flex-col gap-1 sm:min-w-44 sm:max-w-[25%]">
                            <Label variant="title-2" className="mb-0">
                                {translate("resources.callbridge.history.fields.trigger_type")}
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
                                        {triggerTypeValues.map(el => {
                                            return (
                                                <SelectItem key={el} value={el}>
                                                    {el}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div> */}
                    </div>
                </div>
            </AnimatedContainer>
        </div>
    );
};
