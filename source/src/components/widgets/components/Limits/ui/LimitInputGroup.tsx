import { Input, InputTypes } from "@/components/ui/Input/input";
import { TextField } from "@/components/ui/text-field";

interface LimitInputGroupProps {
    label: string;
    minValue: string;
    maxValue: string;
    onMinChange: (value: string) => void;
    onMaxChange: (value: string) => void;
}

export const LimitInputGroup = ({ label, minValue, maxValue, onMinChange, onMaxChange }: LimitInputGroupProps) => {
    return (
        <div className="flex flex-col gap-2 flex-1">
            <TextField text={label} />
            <div className="flex gap-6">
                <Input
                    variant={InputTypes.GRAY}
                    tabIndex={0}
                    label="min (int)"
                    value={minValue}
                    onChange={e => onMinChange(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                />
                <Input
                    variant={InputTypes.GRAY}
                    label="max (int)"
                    value={maxValue}
                    tabIndex={0}
                    onChange={e => onMaxChange(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                />
            </div>
        </div>
    );
};
