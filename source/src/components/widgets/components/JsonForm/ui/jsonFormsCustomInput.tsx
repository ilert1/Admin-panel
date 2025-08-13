import { withJsonFormsControlProps } from "@jsonforms/react";
import { ControlProps } from "@jsonforms/core";
import { Input } from "@/components/ui/Input/input"; // твой компонент
import { isControl, isIntegerControl, isStringControl, RankedTester, rankWith } from "@jsonforms/core";

const JsonFormsCustomInput = ({ data, label, errors, visible, description }: ControlProps) => {
    if (!visible) return null;

    return (
        <div className="mb-2">
            <Input
                label={label}
                value={data === null ? "-" : (String(data) ?? "")}
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
