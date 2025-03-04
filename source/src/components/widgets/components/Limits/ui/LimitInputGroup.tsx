import { Input, InputTypes } from "@/components/ui/Input/input";
import { TextField } from "@/components/ui/text-field";

interface LimitInputGroupProps {
    label: string;
    minValue: string;
    maxValue: string;
    errorMin?: string;
    errorMax?: string;
    onMinChange: (value: string) => void;
    onMaxChange: (value: string) => void;
}

export const LimitInputGroup = ({
    label,
    minValue,
    maxValue,
    errorMin,
    errorMax,
    onMinChange,
    onMaxChange
}: LimitInputGroupProps) => {
    // console.log(errorMin);
    // console.log(errorMax);

    return (
        <div className="flex flex-col gap-2 flex-1">
            <TextField text={label} className="text-display-3" />
            <div className="flex flex-col gap-3">
                <Input
                    variant={InputTypes.GRAY}
                    label="min"
                    value={minValue}
                    onChange={e => onMinChange(e.target.value)}
                    inputMode="numeric"
                    tabIndex={0}
                    error={errorMin}
                    disableErrorMessage
                />
                <Input
                    variant={InputTypes.GRAY}
                    label="max"
                    value={maxValue}
                    tabIndex={0}
                    onChange={e => onMaxChange(e.target.value)}
                    inputMode="numeric"
                    error={errorMax}
                    disableErrorMessage
                />
            </div>
        </div>
    );
};
