import { withJsonFormsControlProps } from "@jsonforms/react";
import { ControlProps, JsonSchema4 } from "@jsonforms/core";
import { isControl, isIntegerControl, isStringControl, RankedTester, rankWith } from "@jsonforms/core";
import { useTranslate } from "react-admin";

interface ExtendedJsonSchema extends JsonSchema4 {
    callbdridgeStatus?: boolean;
}

const JsonFormsCustomInput = ({ data, label, visible, schema, config }: ControlProps) => {
    const translate = useTranslate();
    const extendedSchema = schema as ExtendedJsonSchema;

    if (!visible || (!data && !config.showNull)) return null;

    let displayValue = !data || data === null ? "-" : String(data);

    if (
        extendedSchema?.type?.includes("string") &&
        (extendedSchema.format === "date" || extendedSchema.format === "date-time") &&
        data
    ) {
        const date = new Date(data);
        displayValue = date.toLocaleString().split(",").join(" ");
    }

    if (extendedSchema.callbdridgeStatus) {
        displayValue = translate(`resources.callbridge.history.callbacksStatus.${data}`);
    }

    return (
        <div className="mb-2 flex max-w-full flex-col gap-1">
            <label className="block text-note-1 text-neutral-60 md:text-nowrap">{label}</label>
            <span className="text-wrap break-words text-neutral-90 dark:text-neutral-0">{displayValue}</span>
        </div>
    );
};

export const MyCustomInputRenderer = withJsonFormsControlProps(JsonFormsCustomInput);

export const myCustomInputTester: RankedTester = rankWith(
    5,
    (uischema, schema, context) =>
        isControl(uischema) &&
        (isIntegerControl(uischema, schema, context) || isStringControl(uischema, schema, context))
    // (uischema, schema) => isControl(uischema) && schema?.custom === "myInput"
);
