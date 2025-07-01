import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslate } from "react-admin";
import { CurrencyWithId } from "@/data/currencies";

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

    const modifiedOptions = options?.map(option => ({ label: option.code, value: option.code })) || [];

    const onValueChange = (values: string[]) => {
        onChange(values);
    };

    return (
        <div>
            {label && <Label>{translate("resources.paymentSettings.financialInstitution.fields.currencies")}</Label>}
            <MultiSelect
                options={modifiedOptions}
                onValueChange={onValueChange}
                defaultValue={value}
                notFoundMessage={translate("resources.currency.notFoundMessage")}
                placeholder={translate("app.widgets.multiSelect.selectCurrencies")}
                animation={0}
                maxCount={10}
                modalPopover={modal}
                isLoading={isLoading}
            />
        </div>
    );
};
