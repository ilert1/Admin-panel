import { RequiredFieldItem } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import { LoadingBlock } from "@/components/ui/loading";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect } from "react";
import { useTranslate } from "react-admin";

interface RequiredFieldsMultiSelectProps {
    value: string[] | undefined;
    onChange: (values: string[]) => void;
    options?: Record<number, RequiredFieldItem> | undefined;
    label?: boolean;
    modal?: boolean;
    isLoading?: boolean;
    addingNew?: boolean;
}

export const RequiredFieldsMultiSelect = (props: RequiredFieldsMultiSelectProps) => {
    const { value, onChange, options, label = true, modal = true, isLoading = false, addingNew = true } = props;

    const translate = useTranslate();

    const modifiedOptions =
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(options ?? [])?.map(([_, value]) => ({ label: value.label, value: value.value })) || [];

    useEffect(() => {
        if (value) {
            value.forEach(val => {
                if (!modifiedOptions.some(opt => opt.value === val)) {
                    modifiedOptions.push({ label: val, value: val });
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onValueChange = (values: string[]) => {
        onChange(values);
    };

    if (isLoading) {
        return (
            <div>
                <Label>{translate("resources.paymentSettings.paymentType.fields.required_fields_for_payment")}</Label>

                <div className="flex h-[38px] w-full items-center justify-center rounded-4 border border-neutral-40 disabled:border-neutral-80 dark:border-neutral-60">
                    <LoadingBlock className="!h-4 !w-4" />
                </div>
            </div>
        );
    }

    return (
        <div>
            {label && (
                <Label>{translate("resources.paymentSettings.paymentType.fields.required_fields_for_payment")}</Label>
            )}
            <MultiSelect
                options={modifiedOptions}
                onValueChange={onValueChange}
                defaultValue={value}
                notFoundMessage={translate("app.widgets.multiSelect.noResultFound")}
                placeholder={translate("app.widgets.multiSelect.selectRequiredFields")}
                animation={0}
                // maxCount={10}
                modalPopover={modal}
                isLoading={isLoading}
                addingNew={addingNew}
            />
        </div>
    );
};
