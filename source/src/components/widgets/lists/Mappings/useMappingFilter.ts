import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useMappingFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [nameValue, setNameValue] = useState(filterValues?.name || "");
    const [descriptionValue, setDescriptionValue] = useState(filterValues?.description || "");
    const [extPathValue, setExtPathValue] = useState(filterValues?.external_path || "");
    const [intPathValue, setIntPathValue] = useState(filterValues?.internal_path || "");

    const onPropertySelected = debounce(
        (value: string, type: "name" | "description" | "external_path" | "internal_path") => {
            if (value) {
                setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
            }
            setPage(1);
        },
        300
    );

    const onNameValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setNameValue(e.target.value);
        onPropertySelected(e.target.value, "name");
    };

    const onDescriptionValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setDescriptionValue(e.target.value);
        onPropertySelected(e.target.value, "description");
    };

    const onExtPathValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setExtPathValue(e.target.value);
        onPropertySelected(e.target.value, "external_path");
    };

    const onIntPathValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setIntPathValue(e.target.value);
        onPropertySelected(e.target.value, "internal_path");
    };

    const onClearFilters = () => {
        setNameValue("");
        setDescriptionValue("");
        setExtPathValue("");
        setIntPathValue("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        translate,
        nameValue,
        descriptionValue,
        extPathValue,
        intPathValue,
        onNameValueChanged,
        onDescriptionValueChanged,
        onExtPathValueChanged,
        onIntPathValueChanged,
        onClearFilters
    };
};

export default useMappingFilter;
