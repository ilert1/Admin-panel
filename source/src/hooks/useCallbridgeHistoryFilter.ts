import {
    CallbackMappingRead,
    CallbackStatusEnum,
    RestoreStrategy
} from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { useDataProvider, useListContext, useRefresh, useTranslate } from "react-admin";
import { CallbackBackupsDataProvider } from "@/data/callback_backup";

const useCallbridgeHistoryFilter = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const callbridgeHistoryProvider = new CallbackBackupsDataProvider();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const { data: mappings, isLoading: isLoadingMappings } = useQuery({
        queryKey: ["mappingListForFilter"],
        queryFn: () => dataProvider.getList<CallbackMappingRead>("callbridge/v1/mapping", {}),
        select: data => data.data
    });

    const [status, setStatus] = useState(filterValues?.status || "");
    const [mappingId, setMappingId] = useState(filterValues?.mapping_id || "");
    const [callbackId, setCallbackId] = useState(filterValues?.callback_id || "");
    const [txId, settxId] = useState(filterValues?.transaction_id || "");
    const [extOrderId, setExtOrderId] = useState(filterValues?.external_order_id || "");
    const [mappingName, setMappingName] = useState("");
    const [reportLoading, setReportLoading] = useState(false);
    const refresh = useRefresh();
    const appToast = useAppToast();

    useEffect(() => {
        if (filterValues?.mapping_id) {
            setMappingName(mappings?.find(item => item.id === filterValues?.mapping_id)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mappings]);

    const onPropertySelected = debounce(
        (value: string, type: "status" | "mapping_id" | "callback_id" | "transaction_id" | "external_order_id") => {
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

    const onMappingIdChanged = (val: string) => {
        setMappingId(val);
        onPropertySelected(val, "mapping_id");
    };

    const onMappingNameChanged = (val: string) => {
        setMappingName(val);
    };

    const onCallbackIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCallbackId(e.target.value);
        onPropertySelected(e.target.value, "callback_id");
    };

    const onTxIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        settxId(e.target.value);
        onPropertySelected(e.target.value, "transaction_id");
    };

    const onExtOrderIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setExtOrderId(e.target.value);
        onPropertySelected(e.target.value, "external_order_id");
    };

    const onStatusChanged = (value: CallbackStatusEnum | "") => {
        setStatus(value);
        onPropertySelected(value, "status");
    };

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

    const handleUploadReport = async (file: File, mode: RestoreStrategy) => {
        setReportLoading(true);

        try {
            const data = await callbridgeHistoryProvider.uploadReport(file, mode);
            appToast(
                "success",
                translate("resources.paymentSettings.reports.uploadSuccess", {
                    inserted: data?.data?.inserted,
                    skipped: data?.data?.skipped,
                    total: data?.data?.total
                })
            );
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            // if (error instanceof Error) {
            //     const parsed = extractFieldsFromErrorMessage(error.message);
            //     if (parsed.type === "string_pattern_mismatch") {
            //         appToast(
            //             "error",
            //             translate("resources.paymentSettings.reports.csvValidationErrorDescription", {
            //                 field: parsed.loc.join(" > "),
            //                 input: parsed.input
            //             })
            //         );
            //     } else {
            //         appToast("error", error.message);
            //     }
            // }
        } finally {
            setReportLoading(false);
            refresh();
        }
    };

    return {
        translate,
        status,
        mappingId,
        callbackId,
        txId,
        extOrderId,
        mappings,
        isLoadingMappings,
        mappingName,
        setMappingName,
        onMappingNameChanged,
        onMappingIdChanged,
        onCallbackIdChanged,
        onStatusChanged,
        onClearFilters,
        onTxIdChanged,
        onExtOrderIdChanged,
        handleUploadReport,
        reportLoading
    };
};

export default useCallbridgeHistoryFilter;
