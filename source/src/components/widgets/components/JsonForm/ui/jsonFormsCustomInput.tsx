import { ControlProps, withJsonFormsControlProps } from "@jsonforms/react";
import { Input } from "@/components/ui/Input/input"; // твой компонент
import { isControl, isIntegerControl, isStringControl, RankedTester, rankWith } from "@jsonforms/core";

const JsonFormsCustomInput = ({
    data,
    handleChange,
    path,
    label,
    errors,
    visible,
    enabled,
    description
}: ControlProps) => {
    if (!visible) return null;

    return (
        <div className="mb-2">
            <Input
                label={label}
                value={String(data) ?? ""}
                error={!!errors}
                errorMessage={errors}
                // onChange={e => handleChange(path, e.target.value)}
                disabled={!enabled}
                placeholder={description}
                className="user-select-text bg-white disabled:dark:bg-muted"
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
