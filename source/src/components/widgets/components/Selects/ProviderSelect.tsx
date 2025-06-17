import { Provider } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { ProviderWithId } from "@/data/providers";
import { useTranslate } from "react-admin";

interface ProviderSelectProps extends IPopoverSelect {
    providers: ProviderWithId[] | Provider[];
}

export const ProviderSelect = ({
    value,
    onChange,
    providers,
    isError,
    style = "Grey",
    errorMessage,
    disabled,
    placeholder,
    modal
}: ProviderSelectProps) => {
    const translate = useTranslate();
    return (
        <PopoverSelect
            variants={providers}
            value={value}
            onChange={onChange}
            variantKey={"name"}
            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
            notFoundMessage={translate("resources.provider.notFoundMessage")}
            isError={isError}
            style={style}
            errorMessage={errorMessage}
            disabled={disabled}
            placeholder={placeholder}
            modal={modal}
        />
    );
};
