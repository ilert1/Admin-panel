import { withJsonFormsControlProps } from "@jsonforms/react";
import { ControlProps } from "@jsonforms/core";
import { Input } from "@/components/ui/Input/input";
import { isControl, isIntegerControl, isStringControl, RankedTester, rankWith } from "@jsonforms/core";

const JsonFormsCustomInput = ({ data, label, errors, visible, description, schema }: ControlProps) => {
    if (!visible) return null;

    let displayValue = data === null ? "-" : String(data);

    if (schema?.type?.includes("string") && (schema.format === "date" || schema.format === "date-time") && data) {
        const date = new Date(data);
        displayValue = date.toLocaleString();
    }

    return (
        <div className="mb-2">
            <Input
                label={label}
                value={displayValue}
                error={!!errors}
                errorMessage={errors}
                placeholder={description}
                className="user-select-text pointer-events-auto"
                disableControls
            />
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
