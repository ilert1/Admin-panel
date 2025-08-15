import { withJsonFormsControlProps } from "@jsonforms/react";
import { ControlProps } from "@jsonforms/core";
import { isControl, RankedTester, rankWith } from "@jsonforms/core";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const JsonFormsCustomTextArea = ({ data, errors, visible, description, label }: ControlProps) => {
    if (!visible) return null;

    return (
        <div className="mb-2">
            <Label>{label}</Label>
            <Textarea
                value={data ?? "-"}
                error={!!errors}
                errorMessage={errors}
                placeholder={description}
                className="user-select-text pointer-events-auto max-h-[150px]"
            />
        </div>
    );
};

export const MyCustomTextAreaRenderer = withJsonFormsControlProps(JsonFormsCustomTextArea);

export const myCustomTextAreaTester: RankedTester = rankWith(
    5,
    uischema => isControl(uischema) && uischema.scope === "#/properties/error_message"
);
