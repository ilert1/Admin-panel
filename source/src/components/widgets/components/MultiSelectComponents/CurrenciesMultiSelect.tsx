import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslate } from "react-admin";
import { CurrencyWithId } from "@/data/currencies";
import { useEffect, useState } from "react";
import { LoadingBlock } from "@/components/ui/loading";

interface CurrenciesMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: CurrencyWithId[];
    label?: boolean;
    labelValue?: string;
    modal?: boolean;
    isLoading?: boolean;
    variant?: "default" | "secondary" | "destructive" | "inverted" | null | undefined;
    className?: string;
    placeholder?: string;
    labelSize?: "title-2" | "note-1" | undefined;
    draggable?: boolean;
}

export const CurrenciesMultiSelect = (props: CurrenciesMultiSelectProps) => {
    const {
        value,
        onChange,
        options,
        label = true,
        labelValue,
        modal = true,
        isLoading = false,
        variant,
        className,
        placeholder,
        labelSize,
        draggable = false
    } = props;
    const translate = useTranslate();

    const [selectedValues, setSelectedValues] = useState<string[]>(value || []);
    const modifiedOptions = options?.map(option => ({ label: option.code, value: option.code })) || [];

    const onValueChange = (values: string[]) => {
        setSelectedValues(values);
        onChange(values);
    };

    useEffect(() => {
        if (!isLoading && value?.length) {
            setSelectedValues(value);
        } else {
            setSelectedValues([]);
        }
    }, [isLoading, value]);

    if (isLoading || !value) {
        return (
            <div>
                {label && (
                    <Label variant={labelSize}>
                        {labelValue || translate("resources.paymentSettings.financialInstitution.fields.currencies")}
                    </Label>
                )}

                <div className="flex h-[38px] w-full items-center justify-center rounded-4 border border-neutral-40 disabled:border-neutral-80 dark:border-neutral-60">
                    <LoadingBlock className="!h-4 !w-4" />
                </div>
            </div>
        );
    }
    return (
        <div>
            {label && (
                <Label variant={labelSize}>
                    {labelValue || translate("resources.paymentSettings.financialInstitution.fields.currencies")}
                </Label>
            )}
            <MultiSelect
                selectedValues={selectedValues}
                options={modifiedOptions}
                onValueChange={onValueChange}
                notFoundMessage={translate("resources.currency.notFoundMessage")}
                placeholder={placeholder ? placeholder : translate("app.widgets.multiSelect.selectCurrencies")}
                animation={0}
                // maxCount={10}
                modalPopover={modal}
                isLoading={isLoading}
                variant={variant ?? "default"}
                className={className}
                // draggable={draggable}
            />
        </div>
    );
};
