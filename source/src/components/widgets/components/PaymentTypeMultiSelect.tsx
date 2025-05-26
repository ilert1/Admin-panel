import { PaymentTypeRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslate } from "react-admin";

interface PaymentTypeMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: PaymentTypeRead[];
    label?: boolean;
}

export const PaymentTypeMultiSelect = (props: PaymentTypeMultiSelectProps) => {
    const { value, onChange, options, label = true } = props;
    const translate = useTranslate();

    const modifiedOptions =
        options?.map(option => ({
            label: option.code,
            value: option.code
        })) || [];

    const onValueChange = (values: string[]) => {
        onChange(values);
    };

    return (
        <div>
            {label && <Label>{translate("resources.payment_type.fields.payment_types")}</Label>}
            <MultiSelect
                options={modifiedOptions}
                onValueChange={onValueChange}
                defaultValue={value}
                placeholder="Select payment types"
                animation={0}
                maxCount={10}
            />
        </div>
    );
};
