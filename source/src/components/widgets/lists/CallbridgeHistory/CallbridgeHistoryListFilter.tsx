import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";
import useCallbridgeHistoryFilter from "@/hooks/useCallbridgeHistoryFilter";
import { MappingSelect } from "../../components/Selects/MappingSelect";

export const CallbridgeHistoryListFilter = () => {
    const {
        translate,
        status,
        mappingId,
        callbackId,
        txId,
        extOrderId,
        mappings,
        isLoadingMappings,
        onMappingIdChanged,
        onCallbackIdChanged,
        onStatusChanged,
        onClearFilters,
        onTxIdChanged,
        onExtOrderIdChanged,
        mappingName,
        onMappingNameChanged
    } = useCallbridgeHistoryFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !status && !mappingId && !callbackId && !txId && !extOrderId;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[status, mappingId, callbackId, txId, extOrderId]}
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
                        <div className="w-full">
                            <Label variant={"title-2"}>
                                {translate("resources.callbridge.history.fields.mapping_name")}
                            </Label>
                            <MappingSelect
                                mappings={mappings ?? []}
                                value={mappingName}
                                onChange={onMappingNameChanged}
                                disabled={isLoadingMappings}
                                idField="id"
                                setIdValue={onMappingIdChanged}
                                placeholder={translate("resources.callbridge.mapping.placeholders.name")}
                            />
                        </div>
                        <Input
                            label={translate("resources.callbridge.history.fields.callback_id")}
                            labelSize="title-2"
                            value={callbackId}
                            onChange={onCallbackIdChanged}
                            className="max-w-6C min-w-40"
                            placeholder={translate("resources.callbridge.history.fields.callback_id")}
                        />
                        <Input
                            label={translate("resources.callbridge.history.fields.transaction_id")}
                            labelSize="title-2"
                            value={txId}
                            onChange={onTxIdChanged}
                            className="max-w-6C min-w-40"
                            placeholder={translate("resources.callbridge.history.fields.transaction_id")}
                        />
                        <Input
                            label={translate("resources.callbridge.history.fields.external_order_id")}
                            labelSize="title-2"
                            value={extOrderId}
                            onChange={onExtOrderIdChanged}
                            className="max-w-6C min-w-40"
                            placeholder={translate("resources.callbridge.history.fields.external_order_id")}
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
