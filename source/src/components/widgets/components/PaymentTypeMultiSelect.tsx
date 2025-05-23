import { PaymentTypeRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { MultiSelect } from "@/components/ui/multi-select";

interface PaymentTypeMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: PaymentTypeRead[];
}

export const PaymentTypeMultiSelect = (props: PaymentTypeMultiSelectProps) => {
    const { value, onChange, options } = props;

    const modifiedOptions =
        options?.map(option => ({
            label: option.code,
            value: option.code
        })) || [];

    const onValueChange = (values: string[]) => {
        onChange(values);
    };

    return (
        <MultiSelect
            options={modifiedOptions}
            onValueChange={onValueChange}
            defaultValue={value}
            placeholder="Select payment types"
            animation={0}
            maxCount={10}
        />
    );
};
