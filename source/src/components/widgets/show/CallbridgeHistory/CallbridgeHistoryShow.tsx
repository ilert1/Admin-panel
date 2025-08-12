import { Loading } from "@/components/ui/loading";
import { CallbridgeDataProvider } from "@/data";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { JsonForm } from "../../components/JsonForm";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TextField } from "@/components/ui/text-field";
import { useSheets } from "@/components/providers/SheetProvider";
import { ShowMappingSheet } from "../../lists/Mappings/ShowMappingSheet";
import { SimpleTable } from "../../shared";

interface CallbridgeHistoryShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

const schema = {
    type: "object",
    properties: {
        attempts: { type: ["integer", "null"], readOnly: true, title: "Attempts" },
        callback_id: { type: ["string", "null"], readOnly: true, title: "Callback ID" },
        status: { type: ["string", "null"], readOnly: true, title: "Status" },

        response_status: { type: ["integer", "null"], readOnly: true, title: "Response Status" },
        error_message: { type: ["string", "null"], readOnly: true, title: "Error Message" },
        request_method: { type: ["string", "null"], readOnly: true, title: "Request Method" },

        created_at: { type: ["string", "null"], format: "date-time", readOnly: true, title: "Created At" },
        delivered_at: { type: ["string", "null"], format: "date-time", readOnly: true, title: "Delivered At" },
        updated_at: { type: ["string", "null"], format: "date-time", readOnly: true, title: "Updated At" },

        external_order_id: { type: ["string", "null"], readOnly: true, title: "External Order ID" },
        id: { type: ["string", "null"], readOnly: true, title: "ID" },
        mapping_id: { type: ["string", "null"], readOnly: true, title: "Mapping ID" },

        transaction_id: { type: ["string", "null"], readOnly: true, title: "Transaction ID" },
        next_retry_at: { type: ["string", "null"], format: "date-time", readOnly: true, title: "Next Retry At" },
        trigger_type: { type: ["string", "null"], readOnly: true, title: "Trigger Type" },
        original_url: { type: ["string", "null"], readOnly: true, title: "Original URL" }
    }
};

const uischema = {
    type: "VerticalLayout",
    elements: [
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/attempts"
                },
                { type: "Control", scope: "#/properties/callback_id" },
                { type: "Control", scope: "#/properties/status" }
            ]
        },
        {
            type: "HorizontalLayout",

            elements: [
                { type: "Control", scope: "#/properties/response_status" },
                { type: "Control", scope: "#/properties/error_message" },
                { type: "Control", scope: "#/properties/request_method" }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                { type: "Control", scope: "#/properties/created_at" },
                { type: "Control", scope: "#/properties/delivered_at" },
                { type: "Control", scope: "#/properties/updated_at" }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                { type: "Control", scope: "#/properties/external_order_id" },
                { type: "Control", scope: "#/properties/id" },
                { type: "Control", scope: "#/properties/mapping_id" }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                { type: "Control", scope: "#/properties/transaction_id" },
                { type: "Control", scope: "#/properties/next_retry_at" },
                { type: "Control", scope: "#/properties/trigger_type" }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [{ type: "Control", scope: "#/properties/original_url" }]
        }
    ]
};

export const CallbridgeHistoryShow = ({ id }: CallbridgeHistoryShowProps) => {
    const dataProvider = new CallbridgeDataProvider();
    const [formData, setFormData] = useState<object | null>(null);
    const [openMapping, setOpenMapping] = useState(false);

    const { isLoading } = useQuery({
        queryKey: ["GetHistoryById", id],
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getHistoryById("callbridge/v1/history", { id, signal });
            const item = res.data.items[0];
            setFormData(item);
            return res.data.items;
        }
    });
    // console.log(formData?.mapping);

    const { data: queryData, isLoading: isLoadingForMonaco } = useQuery({
        queryKey: ["GetHistoryById"],
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getHistoryById("callbridge/v1/history", { id, signal });
            return res.data.items;
        }
    });

    if (isLoading || !formData || isLoadingForMonaco) return <Loading />;

    const code = queryData?.map(el => JSON.stringify(el, null, "\t")).join(",\n");

    const parsedOnceRequest = JSON.parse(formData?.request_body ?? "{}");
    const parsedOnceResponse = JSON.parse(formData?.response_body ?? "{}");
    // changes_history
    return (
        <>
            <div className="mx-5">
                <div className="mx-6 mb-4">
                    <TextField text={id} copyValue onClick={() => setOpenMapping(true)} />
                </div>

                <JsonForm
                    schema={schema}
                    uischema={uischema}
                    formData={formData}
                    setFormData={setFormData}
                    // onChange={({ data }) => setFormData(data)}
                    // renderers={materialRenderers}
                    // cells={materialCells}
                />
                {/* <SimpleTable /> */}
                {/* <div className="min-h-[200px]"> */}
                <div className="flex h-28 min-h-[300px] gap-4 overflow-auto pt-0">
                    <MonacoEditor
                        disabled
                        height="h-full"
                        width="100%"
                        onMountEditor={() => {}}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                        code={JSON.stringify(formData?.request_headers, null, "\t") ?? ""}
                        setCode={() => {}}
                    />
                    <MonacoEditor
                        disabled
                        height="h-full"
                        width="100%"
                        onMountEditor={() => {}}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                        code={JSON.stringify(formData?.request_params, null, "\t") ?? ""}
                        setCode={() => {}}
                    />
                </div>
                <div className="mt-4 flex h-28 min-h-[300px] gap-4 overflow-auto pt-0">
                    <MonacoEditor
                        disabled
                        height="h-full"
                        width="100%"
                        onMountEditor={() => {}}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                        // code={JSON.stringify(formData?.request_body, null, "\t") ?? ""}
                        code={JSON.stringify(parsedOnceRequest, null, "\t") ?? ""}
                        setCode={() => {}}
                    />
                    <MonacoEditor
                        disabled
                        height="h-full"
                        width="100%"
                        onMountEditor={() => {}}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                        code={JSON.stringify(formData?.request_params, null, "\t") ?? ""}
                        setCode={() => {}}
                    />
                </div>
                <div className="mt-4 flex h-28 min-h-[300px] gap-4 overflow-auto pt-0">
                    <MonacoEditor
                        disabled
                        height="h-full"
                        width="100%"
                        onMountEditor={() => {}}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                        // code={JSON.stringify(JSON.parse(JSON.parse(formData?.response_body ?? "")), null, "\t") ?? ""}
                        code={JSON.stringify(parsedOnceResponse ?? "", null, "\t")}
                        setCode={() => {}}
                    />
                    <MonacoEditor
                        disabled
                        height="h-full"
                        width="100%"
                        onMountEditor={() => {}}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                        code={JSON.stringify(formData?.response_headers, null, "\t") ?? ""}
                        setCode={() => {}}
                    />
                </div>
                {/* <div className="flex h-full min-h-[300px] flex-col overflow-auto pt-0">
                    <div className="flex h-full flex-col gap-2 px-4 md:px-[42px]">
                        <MonacoEditor
                            disabled
                            height="h-full"
                            width="100%"
                            onMountEditor={() => {}}
                            onErrorsChange={() => {}}
                            onValidChange={() => {}}
                            code={code ?? ""}
                            setCode={() => {}}
                        />
                    </div>
                </div> */}
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

// 	"changes_history": [
// 		{
// 			"changed_at": "2025-08-12T08:38:05.747334+00:00",
// 			"delivered_at": {
// 				"from": null,
// 				"to": "2025-08-12T08:38:05.699333+00:00"
// 			},
// 			"external_order_id": {
// 				"from": null,
// 				"to": "9796066c-280d-4ff5-931d-4734e2e531db"
// 			},
// 			"response_body": {
// 				"from": null,
// 				"to": "{\"callback_id\":\"3f1f66ab-68d4-4ece-99b3-8ccf2c68a08e\",\"success\":true,\"provider_state\":{\"id\":\"723c1b82-05f8-4803-97d5-b4cb12477402\",\"external_id\":\"9796066c-280d-4ff5-931d-4734e2e531db\",\"state\":{\"state_int\":14,\"state_description\":\"Expired\",\"final\":true},\"provider\":\"PFU2 Provider\",\"amount\":{\"currency\":null,\"shop_currency\":null,\"value\":{\"quantity\":12121,\"accuracy\":100}},\"fx_rate\":null,\"external_status\":\"cancelled\",\"external_status_details\":\"customer_confirm_timeout\",\"callback_id\":\"3f1f66ab-68d4-4ece-99b3-8ccf2c68a08e\"},\"error\":null,\"is_system_error\":false}"
// 			},
// 			"response_headers": {
// 				"from": null,
// 				"to": {}
// 			},
// 			"response_status": {
// 				"from": null,
// 				"to": 200
// 			},
// 			"status": {
// 				"from": "quick_processing",
// 				"to": "success"
// 			},
// 			"transaction_id": {
// 				"from": null,
// 				"to": "723c1b82-05f8-4803-97d5-b4cb12477402"
// 			}
// 		},
// 		{
// 			"changed_at": "2025-08-12T08:38:05.715515+00:00",
// 			"status": {
// 				"from": "queued",
// 				"to": "quick_processing"
// 			}
// 		}
// 	],
// 	"request_url": null,
// 	"response_body": "{\"callback_id\":\"3f1f66ab-68d4-4ece-99b3-8ccf2c68a08e\",\"success\":true,\"provider_state\":{\"id\":\"723c1b82-05f8-4803-97d5-b4cb12477402\",\"external_id\":\"9796066c-280d-4ff5-931d-4734e2e531db\",\"state\":{\"state_int\":14,\"state_description\":\"Expired\",\"final\":true},\"provider\":\"PFU2 Provider\",\"amount\":{\"currency\":null,\"shop_currency\":null,\"value\":{\"quantity\":12121,\"accuracy\":100}},\"fx_rate\":null,\"external_status\":\"cancelled\",\"external_status_details\":\"customer_confirm_timeout\",\"callback_id\":\"3f1f66ab-68d4-4ece-99b3-8ccf2c68a08e\"},\"error\":null,\"is_system_error\":false}",
// 	"response_headers": {},
// }
