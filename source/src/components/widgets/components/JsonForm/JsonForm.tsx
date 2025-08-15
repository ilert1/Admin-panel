/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonForms } from "@jsonforms/react";
import { MyCustomInputRenderer, myCustomInputTester } from "./ui/jsonFormsCustomInput";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import { gridLayoutRendererRegistryEntry } from "./ui/gridLayoutForJsonForm";
import { MyCustomTextAreaRenderer, myCustomTextAreaTester } from "./ui/jsoonFormsCustomTextArea";

interface JsonFormProps {
    schema: any;
    uischema: any;
    formData: any;
    setFormData: any;
}

export const JsonForm = ({ schema, uischema, formData, setFormData }: JsonFormProps) => {
    return (
        <div>
            <JsonForms
                schema={schema}
                uischema={uischema}
                data={formData}
                onChange={({ data }) => setFormData(data)}
                renderers={[
                    ...vanillaRenderers,
                    gridLayoutRendererRegistryEntry,
                    { tester: myCustomTextAreaTester, renderer: MyCustomTextAreaRenderer },
                    { tester: myCustomInputTester, renderer: MyCustomInputRenderer }
                ]}
                cells={vanillaCells}
            />
        </div>
    );
};
