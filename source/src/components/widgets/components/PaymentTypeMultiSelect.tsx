import { MultiSelect } from "@/components/ui/multi-select";

interface PaymentTypeMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
}

export const PaymentTypeMultiSelect = (props: PaymentTypeMultiSelectProps) => {
    const { value, onChange } = props;

    const options = [
        { value: "crypto", label: "Crypto" },
        { value: "bank_card", label: "Bank card" },
        { value: "bank_transfer", label: "Bank transfer" }
    ];

    // const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const onValueChange = (values: string[]) => {
        onChange(values);
    };

    return (
        <MultiSelect
            options={options}
            onValueChange={onValueChange}
            defaultValue={value}
            placeholder="Select payment types"
            animation={0}
            maxCount={10}
        />
    );
};
