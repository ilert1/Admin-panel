import { Loading } from "@/components/ui/loading";
import { CallbridgeDataProvider } from "@/data";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { JsonForm } from "../../components/JsonForm";
import { TextField } from "@/components/ui/text-field";
import { ShowMappingSheet } from "../../lists/Mappings/ShowMappingSheet";
import { CallbridgeHistoryTechnicalInfoShow } from "./CallbridgeHistoryTechnicalInfoShow";
import { CallbackHistoryRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useGetJsonFormSchemas } from "./useGetJsonFormSchemas";
import { useGetCallbridgeHistoryColumns } from "./Columns";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import clsx from "clsx";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

interface CallbridgeHistoryShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CallbridgeHistoryShow = ({ id }: CallbridgeHistoryShowProps) => {
    const dataProvider = new CallbridgeDataProvider();
    const [formData, setFormData] = useState<CallbackHistoryRead | null>(null);
    const [openMapping, setOpenMapping] = useState(false);
    const { schema, uischema } = useGetJsonFormSchemas();
    const { columns } = useGetCallbridgeHistoryColumns();
    const [currentState, setCurrentState] = useState(false);

    const { isLoading } = useQuery({
        queryKey: ["GetHistoryById", id],
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getHistoryById("callbridge/v1/history", { id, signal });
            const item = res.data.items[0];
            setFormData(item);
            return res.data.items;
        }
    });

    if (isLoading || !formData) return <Loading />;

    const technicalInfo = {
        request_headers: formData?.request_headers,
        request_params: formData?.request_params,
        response_headers: formData?.response_headers
    };

    const bodies = {
        request_body: formData?.request_body,
        response_body: formData?.response_body
    };

    const changeActivity = () => {
        setCurrentState(!currentState);
    };
    //    security_rejected: "security_rejected",
    // queued: "queued",
    // rpc_sent: "rpc_sent",
    // rpc_completed: "rpc_completed",
    // rpc_failed: "rpc_failed",
    // rpc_timeout: "rpc_timeout",
    // processing: "processing",
    // delivered: "delivered",
    // error: "error",
    // retrying: "retrying",
    // success: "success",
    // quick_processing: "quick_processing"

    return (
        <>
            <div className="flex flex-col gap-4 px-[20px] md:px-[45px]">
                <div className="">
                    <TextField text={id} copyValue onClick={() => setOpenMapping(true)} />
                </div>

                <JsonForm schema={schema} uischema={uischema} formData={formData} setFormData={setFormData} />

                <label className="flex items-center gap-2 self-end">
                    <button
                        onClick={changeActivity}
                        className={clsx(
                            "flex w-11 items-center rounded-[50px] p-0.5 outline outline-1",
                            currentState
                                ? "bg-neutral-100 outline-transparent dark:bg-green-50 dark:outline-green-40"
                                : "bg-transparent outline-green-40 dark:outline-green-50"
                        )}>
                        <span
                            className={clsx(
                                "h-5 w-5 rounded-full outline outline-1 transition-all",
                                currentState
                                    ? "translate-x-full bg-neutral-0 outline-transparent dark:bg-neutral-100 dark:outline-green-40"
                                    : "translate-x-0 bg-green-50 outline-green-40 dark:bg-green-50 dark:outline-transparent"
                            )}
                        />
                    </button>
                    <p className="text-base text-neutral-90 dark:text-neutral-30">JSON</p>
                </label>
                {!currentState ? (
                    <div className="w-full">
                        <SimpleTable
                            columns={columns}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            data={formData?.changes_history ?? []}
                            tableType={TableTypes.COLORED}
                        />
                    </div>
                ) : (
                    <div className="h-[350px] w-full">
                        <MonacoEditor
                            code={JSON.stringify(formData?.changes_history, null, 2)}
                            height="h-full"
                            disabled
                        />
                    </div>
                )}

                <div className="">
                    <CallbridgeHistoryTechnicalInfoShow technicalInfo={technicalInfo} bodies={bodies} />
                </div>
            </div>
            <ShowMappingSheet
                id={formData?.mapping_id ?? ""}
                open={openMapping}
                onOpenChange={setOpenMapping}
                externalData={formData?.mapping}
            />
        </>
    );
};
