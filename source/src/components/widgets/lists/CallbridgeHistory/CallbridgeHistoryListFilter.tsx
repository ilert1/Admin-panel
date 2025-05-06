import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";
import useCallbridgeHistoryFilter from "@/hooks/useCallbridgeHistoryFilter";

export const CallbridgeHistoryListFilter = () => {
    const {
        translate,
        status,
        mappingId,
        callbackId,
        originalUrl,
        onMappingIdChanged,
        onCallbackIdChanged,
        onOriginalUrlChanged,
        onStatusChanged,
        onClearFilters
    } = useCallbridgeHistoryFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !status && !mappingId && !callbackId && !originalUrl;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[status, mappingId, callbackId, originalUrl]}
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
                            onChange={onMappingIdChanged}
                        />
                        <Input
                            label={translate("resources.callbridge.history.callback_id")}
                            labelSize="title-2"
                            value={callbackId}
                            onChange={onCallbackIdChanged}
                            className="max-w-6C min-w-40"
                        />
                        <Input
                            label={translate("resources.callbridge.history.fields.original_url")}
                            labelSize="title-2"
                            value={originalUrl}
                            className="max-w-6C min-w-40"
                            onChange={onOriginalUrlChanged}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        <div className="flex min-w-[50%] max-w-full flex-1 flex-col gap-1 sm:min-w-44 sm:max-w-[25%]">
                            <Label variant="title-2" className="mb-0">
                                {translate("resources.callbridge.history.fields.status")}
                            </Label>

                            <Select
                                value={status?.toString()}
                                onValueChange={value =>
                                    value === "null"
                                        ? onStatusChanged("")
                                        : onStatusChanged(value as CallbackStatusEnum)
                                }>
                                <SelectTrigger className="h-[38px] text-ellipsis">
                                    <SelectValue
                                        placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                    />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="null">
                                            {translate("resources.transactions.filter.showAll")}
                                        </SelectItem>

                                        {Object.values(CallbackStatusEnum).map(el => {
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
                    </div>
                </div>
            </AnimatedContainer>
        </div>
    );
};
