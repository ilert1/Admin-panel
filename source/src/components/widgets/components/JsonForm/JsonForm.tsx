/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonForms } from "@jsonforms/react";
import { MyCustomInputRenderer, myCustomInputTester } from "./ui/jsonFormsCustomInput";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

interface JsonFormProps {
    schema: any;
    uischema: any;
    formData: any;
    setFormData: any;
}

export const JsonForm = ({ schema, uischema, formData, setFormData }: JsonFormProps) => {
    return (
        <div className="mx-5">
            <JsonForms
                schema={schema}
                uischema={uischema}
                data={formData}
                onChange={({ data }) => setFormData(data)}
                renderers={[...materialRenderers, { tester: myCustomInputTester, renderer: MyCustomInputRenderer }]}
                cells={materialCells}
            />
        </div>
    );
};
