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
    errorMessage,
    disabled
}: ProviderSelectProps) => {
    const translate = useTranslate();
    return (
        <PopoverSelect
            variants={providers}
            value={value}
            onChange={onChange}
            variantKey={"name"}
            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
            notFoundMessage={translate("resources.direction.noProviders")}
            isError={isError}
            errorMessage={errorMessage}
            disabled={disabled}
        />
    );
};
