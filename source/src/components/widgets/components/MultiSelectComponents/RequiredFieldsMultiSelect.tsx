import { RequiredFieldItem } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { MultiSelect } from "@/components/ui/multi-select";
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
    if (value) {
        modifiedOptions.push(...value.map(val => ({ label: val, value: val })));
    }

    // const defaultOptions = value
    //     ?.filter(val => !options?.some(opt => opt.value === val)) // исключаем уже существующие
    //     .map(val => ({ label: val, value: val, icon: null }));

    const onValueChange = (values: string[]) => {
        onChange(values);
    };

    if (isLoading) {
        return <Loading />;
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
                maxCount={10}
                modalPopover={modal}
                isLoading={isLoading}
                addingNew={addingNew}
            />
        </div>
    );
};
