import { Provider } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { IProvider } from "@/data/providers";
import { useTranslate } from "react-admin";

interface ProviderSelectProps extends IPopoverSelect {
    providers: IProvider[] | Provider[];
}

export const ProviderSelect = ({
    value,
    onChange,
    providers,
    isError,
    style = "Grey",
    placeholder,
    ...rest
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
            placeholder={placeholder || translate("resources.provider.selectPlaceholder")}
            {...rest}
        />
    );
};
