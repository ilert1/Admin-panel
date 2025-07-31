import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslate } from "react-admin";
import { CurrencyWithId } from "@/data/currencies";
import { useState } from "react";

interface CurrenciesMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: CurrencyWithId[];
    label?: boolean;
    modal?: boolean;
    isLoading?: boolean;
}

export const CurrenciesMultiSelect = (props: CurrenciesMultiSelectProps) => {
    const { value, onChange, options, label = true, modal = true, isLoading = false } = props;
    const translate = useTranslate();

    const [selectedValues, setSelectedValues] = useState<string[]>(value || []);
    const modifiedOptions = options?.map(option => ({ label: option.code, value: option.code })) || [];

    const onValueChange = (values: string[]) => {
        setSelectedValues(values);
        onChange(values);
    };

    return (
        <div>
            {label && <Label>{translate("resources.paymentSettings.financialInstitution.fields.currencies")}</Label>}
            <MultiSelect
                selectedValues={selectedValues}
                options={modifiedOptions}
                onValueChange={onValueChange}
                notFoundMessage={translate("resources.currency.notFoundMessage")}
                placeholder={translate("app.widgets.multiSelect.selectCurrencies")}
                animation={0}
                // maxCount={10}
                modalPopover={modal}
                isLoading={isLoading}
            />
        </div>
    );
};
