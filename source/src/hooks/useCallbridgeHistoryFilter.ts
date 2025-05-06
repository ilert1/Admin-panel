import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useCallbridgeHistoryFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [status, setStatus] = useState(filterValues?.status || "");
    const [mappingId, setMappingId] = useState(filterValues?.mapping_id || "");
    const [callbackId, setCallbackId] = useState(filterValues?.callback_id || "");
    const [originalUrl, setOriginalUrl] = useState(filterValues?.original_url || "");
    // const [triggerType, setTriggerType] = useState("");

    const onPropertySelected = debounce(
        (value: string, type: "status" | "mapping_id" | "callback_id" | "original_url") => {
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

    const onMappingIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setMappingId(e.target.value);
        onPropertySelected(e.target.value, "mapping_id");
    };

    const onCallbackIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCallbackId(e.target.value);
        onPropertySelected(e.target.value, "callback_id");
    };

    const onOriginalUrlChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setOriginalUrl(e.target.value);
        onPropertySelected(e.target.value, "original_url");
    };

    const onStatusChanged = (value: CallbackStatusEnum | "") => {
        setStatus(value);
        onPropertySelected(value, "status");
    };

    const onClearFilters = () => {
        setStatus("");
        setMappingId("");
        setCallbackId("");
        setOriginalUrl("");
        setFilters({}, displayedFilters, true);
        setPage(1);
        // setTriggerType("");
    };

    return {
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
    };
};

export default useCallbridgeHistoryFilter;
