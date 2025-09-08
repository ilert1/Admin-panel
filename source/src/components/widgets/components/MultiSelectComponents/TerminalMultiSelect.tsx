import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslate } from "react-admin";
import { useEffect, useState } from "react";
import { TerminalWithId } from "@/data/terminals";

interface TerminalMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: TerminalWithId[];
    label?: string;
    modal?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    notFoundMessage?: string;
}

export const TerminalMultiSelect = (props: TerminalMultiSelectProps) => {
    const {
        value,
        onChange,
        options,
        label = "",
        modal = true,
        isLoading = false,
        disabled = false,
        placeholder,
        notFoundMessage
    } = props;
    const translate = useTranslate();

    const [selectedValues, setSelectedValues] = useState<string[]>(value || []);

    const modifiedOptions = options?.map(option => ({ label: option.verbose_name, value: option.id })) || [];

    const onValueChange = (values: string[]) => {
        setSelectedValues(values);
        onChange(values);
    };

    useEffect(() => {
        if (!value || value.length === 0) {
            setSelectedValues([]);
        } else {
            setSelectedValues(value);
        }
    }, [value]);

    return (
        <div>
            {label && (
                <Label>
                    {label ?? translate("resources.paymentSettings.terminalPaymentInstruments.fields.terminal_id")}
                </Label>
            )}
            <MultiSelect
                selectedValues={selectedValues}
                options={modifiedOptions}
                onValueChange={onValueChange}
                notFoundMessage={notFoundMessage ?? translate("app.widgets.multiSelect.noResultFound")}
                placeholder={placeholder ?? translate("app.widgets.multiSelect.selectTerminals")}
                animation={0}
                // maxCount={10}
                modalPopover={modal}
                isLoading={isLoading}
                disabled={disabled}
            />
        </div>
    );
};
