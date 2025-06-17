import { debounce } from "lodash";
import { useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";
import moment from "moment";

const useCallbackListFilter = () => {
    const translate = useTranslate();
    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.createdAfter ? new Date(filterValues?.createdAfter) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.createdBefore ? new Date(filterValues?.createdBefore) : undefined
    );

    const [status, setStatus] = useState(filterValues?.status || "");
    const [mappingId, setMappingId] = useState(filterValues?.mapping_id || "");
    const [callbackId, setCallbackId] = useState(filterValues?.callback_id || "");
    const [txId, settxId] = useState(filterValues?.transaction_id || "");
    const [extOrderId, setExtOrderId] = useState(filterValues?.external_order_id || "");
    const [mappingName, setMappingName] = useState("");

    // const onPropertySelected = debounce(
    //     (value: string, type: "status" | "mapping_id" | "callback_id" | "transaction_id" | "external_order_id") => {
    //         if (value) {
    //             setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
    //         } else {
    //             Reflect.deleteProperty(filterValues, type);
    //             setFilters(filterValues, displayedFilters, true);
    //         }
    //         setPage(1);
    //     },
    //     300
    // );
    const onPropertySelected = debounce(
        (
            value: string | { from: string; to: string } | number,
            type: "id" | "dst_address" | "date" | "order_type" | "accountId" | "order_state"
        ) => {
            if (value) {
                if (type === "date" && typeof value !== "string" && typeof value !== "number") {
                    setFilters(
                        { ...filterValues, ["createdAfter"]: value.from, ["createdBefore"]: value.to },
                        displayedFilters,
                        true
                    );
                } else {
                    setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
                }
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
            }
            setPage(1);
        },
        300
    );

    const changeDate = (date: DateRange | undefined) => {
        if (date) {
            if (date.from && date.to) {
                setStartDate(date.from);
                setEndDate(date.to);
                onPropertySelected({ from: formattedDate(date.from), to: formattedDate(date.to) }, "date");
            }
        } else {
            setStartDate(undefined);
            setEndDate(undefined);
            onPropertySelected({ from: "", to: "" }, "date");
        }
    };

    // const onMappingIdChanged = (val: string) => {
    //     setMappingId(val);
    //     onPropertySelected(val, "mapping_id");
    // };

    // const onMappingNameChanged = (val: string) => {
    //     setMappingName(val);
    // };

    // const onCallbackIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
    //     setCallbackId(e.target.value);
    //     onPropertySelected(e.target.value, "callback_id");
    // };

    // const onTxIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
    //     settxId(e.target.value);
    //     onPropertySelected(e.target.value, "transaction_id");
    // };

    // const onExtOrderIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
    //     setExtOrderId(e.target.value);
    //     onPropertySelected(e.target.value, "external_order_id");
    // };

    // const onStatusChanged = (value: CallbackStatusEnum | "") => {
    //     setStatus(value);
    //     onPropertySelected(value, "status");
    // };

    const onClearFilters = () => {
        setStatus("");
        setMappingId("");
        setCallbackId("");
        setFilters({}, displayedFilters, true);
        setPage(1);
        settxId("");
        setExtOrderId("");
        setMappingName("");
    };

    return {
        translate,
        status,
        mappingId,
        callbackId,
        txId,
        extOrderId,
        startDate,
        endDate,
        changeDate,
        mappingName,
        setMappingName,
        onClearFilters
    };
};

export default useCallbackListFilter;
