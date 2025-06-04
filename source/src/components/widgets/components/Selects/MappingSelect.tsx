import { Provider } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { ProviderWithId } from "@/data/providers";
import { useTranslate } from "react-admin";

interface MappingSelectProps extends IPopoverSelect {
    mappings: ProviderWithId[] | Provider[];
}

export const MappingSelect = ({
    value,
    onChange,
    idField,
    setIdValue,
    mappings,
    isError,
    errorMessage,
    disabled
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
            notFoundMessage={translate("resources.callbridge.history.notFoundMessage")}
            isError={isError}
            errorMessage={errorMessage}
            disabled={disabled}
            style="Black"
        />
    );
};
