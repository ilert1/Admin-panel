import { useTranslate } from "react-admin";

export const useGetJsonFormSchemas = () => {
    const translate = useTranslate();

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

            original_url: { type: ["string", "null"], readOnly: true, title: "Original URL" },

            request_url: { type: ["string", "null"], readOnly: true, title: "Request URL" }
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
            },
            {
                type: "HorizontalLayout",
                elements: [{ type: "Control", scope: "#/properties/request_url" }]
            }
        ]
    };

    return { schema, uischema };
};
