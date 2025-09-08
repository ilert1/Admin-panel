import { MerchantSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { useTranslate } from "react-admin";

interface MerchantSelectProps extends IPopoverSelect {
    merchants: MerchantSchema[];
}

export const MerchantSelect = ({
    merchants,
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
}: MerchantSelectProps) => {
    const translate = useTranslate();

    return (
        <PopoverSelect
            variants={merchants}
            value={value}
            onChange={onChange}
            variantKey="name"
            idField="id"
            setIdValue={setIdValue}
            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
            notFoundMessage={translate("resources.merchant.notFoundMessage")}
            isError={isError}
            style={style}
            errorMessage={errorMessage}
            disabled={disabled}
            placeholder={placeholder || translate("resources.merchant.selectPlaceholder")}
            modal={modal}
            isLoading={isLoading}
        />
    );
};
