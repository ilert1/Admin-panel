import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { useTranslate } from "react-admin";

interface CascadeSelectProps extends IPopoverSelect {
    cascades: CascadeSchema[];
}

export const CascadeSelect = ({
    cascades,
    value,
    onChange,
    setIdValue,
    isError,
    style = "Grey",
    errorMessage,
    disabled,
    modal,
    placeholder,
    isLoading
}: CascadeSelectProps) => {
    const translate = useTranslate();

    return (
        <PopoverSelect
            variants={cascades}
            value={value}
            onChange={onChange}
            variantKey="name"
            idField="id"
            setIdValue={setIdValue}
            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
            notFoundMessage={translate("resources.cascadeSettings.select.notFoundMessage")}
            isError={isError}
            style={style}
            errorMessage={errorMessage}
            disabled={disabled}
            placeholder={placeholder || translate("resources.cascadeSettings.select.selectPlaceholder")}
            modal={modal}
            isLoading={isLoading}
        />
    );
};
