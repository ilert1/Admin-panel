import { PaymentTypeModel } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslate } from "react-admin";
import { PaymentTypeIcon } from "../PaymentTypeIcon";
import { useEffect, useState } from "react";

interface PaymentTypeMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: PaymentTypeModel[];
    label?: boolean;
    modal?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
}

export const PaymentTypeMultiSelect = (props: PaymentTypeMultiSelectProps) => {
    const { value, onChange, options, label = true, modal = true, isLoading, disabled } = props;
    const translate = useTranslate();

    const [selectedValues, setSelectedValues] = useState<string[]>(value || []);
    const modifiedOptions =
        options?.map(option => ({
            label: option.code,
            value: option.code,
            icon: (props: object) => {
                const icon = option.meta?.["icon"];

                return <PaymentTypeIcon type={option.code} metaIcon={icon} small={false} {...props} />;
            }
        })) || [];

    const onValueChange = (values: string[]) => {
        setSelectedValues(values);
        onChange(values);
    };

    useEffect(() => {
        setSelectedValues(value || []);
    }, [value]);

    return (
        <div>
            {label && <Label>{translate("resources.paymentSettings.paymentType.name")}</Label>}
            <MultiSelect
                selectedValues={selectedValues}
                options={modifiedOptions}
                onValueChange={onValueChange}
                placeholder={translate("app.widgets.multiSelect.selectPaymentTypes")}
                notFoundMessage={translate("resources.paymentSettings.paymentType.notFoundMessage")}
                animation={0}
                // maxCount={10}
                modalPopover={modal}
                isLoading={isLoading}
                disabled={disabled}
            />
        </div>
    );
};
