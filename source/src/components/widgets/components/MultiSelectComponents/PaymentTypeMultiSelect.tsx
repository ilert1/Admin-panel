import { PaymentTypeModel } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslate } from "react-admin";
import { PaymentTypeIcon } from "../PaymentTypeIcon";

interface PaymentTypeMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: PaymentTypeModel[];
    label?: boolean;
}

export const PaymentTypeMultiSelect = (props: PaymentTypeMultiSelectProps) => {
    const { value, onChange, options, label = true } = props;
    const translate = useTranslate();

    const modifiedOptions =
        options?.map(option => ({
            label: option.code,
            value: option.code,
            icon: (props: object) => (
                <PaymentTypeIcon
                    type={option.code}
                    metaIcon={option.meta?.["icon"] as string}
                    metaIconMargin
                    {...props}
                />
            )
        })) || [];

    const onValueChange = (values: string[]) => {
        onChange(values);
    };

    return (
        <div>
            {label && <Label>{translate("resources.paymentTools.paymentType.name")}</Label>}
            <MultiSelect
                options={modifiedOptions}
                onValueChange={onValueChange}
                defaultValue={value}
                placeholder={translate("app.widgets.multiSelect.selectPaymentTypes")}
                notFoundMessage={translate("resources.paymentTools.paymentType.notFoundMessage")}
                animation={0}
                maxCount={10}
                modalPopover
            />
        </div>
    );
};
