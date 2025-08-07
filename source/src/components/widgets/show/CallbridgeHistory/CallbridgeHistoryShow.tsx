import { Loading } from "@/components/ui/loading";
import { CallbridgeDataProvider } from "@/data";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { JsonForm } from "../../components/JsonForm";

interface CallbridgeHistoryShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

const schema = {
    type: "object",
    properties: {
        attempts: { type: "integer", readOnly: true, title: "Attempts" },
        callback_id: { type: "string", readOnly: true, title: "Callback ID" },
        created_at: { type: "string", format: "date-time", readOnly: true, title: "Created At" },
        delivered_at: { type: "string", format: "date-time", readOnly: true, title: "Delivered At" }
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
                { type: "Control", scope: "#/properties/callback_id" }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                { type: "Control", scope: "#/properties/created_at" },
                { type: "Control", scope: "#/properties/delivered_at" }
            ]
        }
    ]
};

export const CallbridgeHistoryShow = ({ id }: CallbridgeHistoryShowProps) => {
    const dataProvider = new CallbridgeDataProvider();
    const [formData, setFormData] = useState<object | null>(null);

    const { isLoading } = useQuery({
        queryKey: ["GetHistoryById", id],
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getHistoryById("callbridge/v1/history", { id, signal });
            const item = res.data.items[0]; // <--
            setFormData(item);
            return res.data.items;
        }
    });

    if (isLoading || !formData) return <Loading />;

    return (
        <JsonForm
            schema={schema}
            uischema={uischema}
            formData={formData}
            setFormData={undefined}
            // onChange={({ data }) => setFormData(data)}
            // renderers={materialRenderers}
            // cells={materialCells}
        />
    );
};
{
    /* <JsonForms
                schema={schema}
                uischema={uischema}
                data={formData}
                onChange={({ data }) => setFormData(data)}
                renderers={materialRenderers}
                cells={materialCells}
            /> */
}
