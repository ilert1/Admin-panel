import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { useTranslate } from "react-admin";
import { CallbackMappingRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

interface MappingSelectProps extends IPopoverSelect {
    mappings: CallbackMappingRead[];
}

export const MappingSelect = ({
    value,
    onChange,
    idField,
    setIdValue,
    mappings,
    isError,
    errorMessage,
    disabled,
    placeholder,
    style = "Black",
    modal
}: MappingSelectProps) => {
    const translate = useTranslate();

    return (
        <PopoverSelect
            variants={mappings}
            setIdValue={setIdValue}
            idField={idField}
            value={value}
            onChange={onChange}
            variantKey={"name"}
            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
            notFoundMessage={translate("resources.callbridge.history.notFoundMessage")}
            isError={isError}
            errorMessage={errorMessage}
            disabled={disabled}
            style={style}
            placeholder={placeholder}
            modal={modal}
        />
    );
};
