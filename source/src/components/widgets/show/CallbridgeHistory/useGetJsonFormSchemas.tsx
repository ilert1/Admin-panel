import { useTranslate } from "react-admin";

export const useGetJsonFormSchemas = () => {
    const translate = useTranslate();

    const schema = {
        type: "object",
        properties: {
            attempts: {
                type: ["integer", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.attempts")
            },
            callback_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.callback_id")
            },
            status: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.status")
            },
            response_status: {
                type: ["integer", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.response_status")
            },
            error_message: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.error_message")
            },
            request_method: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.request_method")
            },
            created_at: {
                type: ["string", "null"],
                format: "date-time",
                readOnly: true,
                title: translate("resources.callbridge.history.fields.createdAt")
            },
            delivered_at: {
                type: ["string", "null"],
                format: "date-time",
                readOnly: true,
                title: translate("resources.callbridge.history.fields.deliveredAt")
            },
            updated_at: {
                type: ["string", "null"],
                format: "date-time",
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.updated_at")
            },
            external_order_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.external_order_id")
            },
            id: {
                type: ["string", "null"],
                readOnly: true,
                title: "ID"
            },
            mapping_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.mapping_id")
            },
            transaction_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.transaction_id")
            },
            next_retry_at: {
                type: ["string", "null"],
                format: "date-time",
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.next_retry_at")
            },
            trigger_type: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.trigger_type")
            },
            original_url: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.original_url")
            },
            request_url: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.fields.request_url")
            }
        }
    };

    const uischema = {
        type: "GridLayout",
        options: {
            variant: "grid",
            columns: 3,
            gap: "1rem"
        },
        elements: [
            // 1
            {
                type: "Control",
                scope: "#/properties/attempts"
            },
            {
                type: "Control",
                scope: "#/properties/callback_id"
            },
            {
                type: "Control",
                scope: "#/properties/status"
            },

            // 2
            {
                type: "Control",
                scope: "#/properties/response_status"
            },

            {
                type: "Control",
                scope: "#/properties/request_method"
            },

            // 3
            {
                type: "Control",
                scope: "#/properties/created_at"
            },
            {
                type: "Control",
                scope: "#/properties/delivered_at"
            },
            {
                type: "Control",
                scope: "#/properties/updated_at"
            },

            // 4
            {
                type: "Control",
                scope: "#/properties/external_order_id"
            },
            {
                type: "Control",
                scope: "#/properties/id"
            },
            {
                type: "Control",
                scope: "#/properties/mapping_id"
            },

            // 5
            {
                type: "Control",
                scope: "#/properties/transaction_id"
            },
            {
                type: "Control",
                scope: "#/properties/next_retry_at"
            },
            {
                type: "Control",
                scope: "#/properties/trigger_type"
            },
            {
                type: "Control",
                scope: "#/properties/error_message",
                options: {
                    colSpan: 3
                }
            },
            // 6
            {
                type: "Control",
                scope: "#/properties/original_url",
                options: {
                    colSpan: 3
                }
            },
            {
                type: "Control",
                scope: "#/properties/request_url",
                options: {
                    colSpan: 3
                }
            }
        ]
    };

    return { schema, uischema };
};
