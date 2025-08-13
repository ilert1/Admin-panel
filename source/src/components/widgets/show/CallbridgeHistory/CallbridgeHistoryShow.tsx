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

interface CallbridgeHistoryShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CallbridgeHistoryShow = ({ id }: CallbridgeHistoryShowProps) => {
    const dataProvider = new CallbridgeDataProvider();
    const [formData, setFormData] = useState<CallbackHistoryRead | null>(null);
    const [openMapping, setOpenMapping] = useState(false);
    const { schema, uischema } = useGetJsonFormSchemas();

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

    return (
        <>
            <div className="mx-5">
                <div className="mx-6 mb-4">
                    <TextField text={id} copyValue onClick={() => setOpenMapping(true)} />
                </div>

                <JsonForm schema={schema} uischema={uischema} formData={formData} setFormData={setFormData} />
                {/* <SimpleTable /> */}
                <div className="mx-5 mt-4">
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
