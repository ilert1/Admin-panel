// import { Loading } from "@/components/ui/loading";
// import { CallbridgeDataProvider } from "@/data";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { JsonForm } from "../../components/JsonForm";

// interface CallbridgeHistoryShowProps {
//     id: string;
//     onOpenChange: (state: boolean) => void;
// }

// const schema = {
//     type: "object",
//     properties: {
//         attempts: { type: "integer", readOnly: true, title: "Attempts" },
//         callback_id: { type: "string", readOnly: true, title: "Callback ID" },
//         created_at: { type: "string", format: "date-time", readOnly: true, title: "Created At" },
//         delivered_at: { type: "string", format: "date-time", readOnly: true, title: "Delivered At" }
//     }
// };

// const uischema = {
//     type: "VerticalLayout",
//     elements: [
//         {
//             type: "HorizontalLayout",
//             elements: [
//                 {
//                     type: "Control",
//                     scope: "#/properties/attempts"
//                 },
//                 { type: "Control", scope: "#/properties/callback_id" }
//             ]
//         },
//         {
//             type: "HorizontalLayout",
//             elements: [
//                 { type: "Control", scope: "#/properties/created_at" },
//                 { type: "Control", scope: "#/properties/delivered_at" }
//             ]
//         }
//     ]
// };

// export const CallbridgeHistoryShow = ({ id }: CallbridgeHistoryShowProps) => {
//     const dataProvider = new CallbridgeDataProvider();
//     const [formData, setFormData] = useState<object | null>(null);

//     const { isLoading } = useQuery({
//         queryKey: ["GetHistoryById", id],
//         queryFn: async ({ signal }) => {
//             const res = await dataProvider.getHistoryById("callbridge/v1/history", { id, signal });
//             const item = res.data.items[0]; // <--
//             setFormData(item);
//             return res.data.items;
//         }
//     });

//     if (isLoading || !formData) return <Loading />;

//     return (
//         <JsonForm
//             schema={schema}
//             uischema={uischema}
//             formData={formData}
//             setFormData={undefined}
//             // onChange={({ data }) => setFormData(data)}
//             // renderers={materialRenderers}
//             // cells={materialCells}
//         />
//     );
// };

// /* <JsonForms
//                 schema={schema}
//                 uischema={uischema}
//                 data={formData}
//                 onChange={({ data }) => setFormData(data)}
//                 renderers={materialRenderers}
//                 cells={materialCells}
//             /> */

import { Loading } from "@/components/ui/loading";
import { CallbridgeDataProvider } from "@/data";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useQuery } from "@tanstack/react-query";

interface CallbridgeHistoryShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CallbridgeHistoryShow = (props: CallbridgeHistoryShowProps) => {
    const { id } = props;
    const dataProvider = new CallbridgeDataProvider();

    const { data: queryData, isLoading } = useQuery({
        queryKey: ["GetHistoryById"],
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getHistoryById("callbridge/v1/history", { id, signal });
            return res.data.items;
        }
    });

    if (isLoading) return <Loading />;

    const code = queryData?.map(el => JSON.stringify(el, null, "\t")).join(",\n");

    return (
        <>
            <div className="flex h-full min-h-[300px] flex-col overflow-auto pt-0">
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
            </div>
        </>
    );
};
