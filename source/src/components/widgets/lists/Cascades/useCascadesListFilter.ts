import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useCascadesListFilter = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [name, setName] = useState(filterValues?.name || "");
    const [type, setType] = useState(filterValues?.type || "");
    const [cascadeKind, setCascadeKind] = useState(filterValues?.cascade_kind || "");
    const [state, setState] = useState(filterValues?.state || "");

    const onPropertySelected = debounce((value: string, type: "name" | "type" | "cascade_kind" | "state") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        onPropertySelected(e.target.value, "name");
    };

    const onTypeChanged = (type: string) => {
        setType(type);
        onPropertySelected(type, "type");
    };

    const onCascadeKindChanged = (kind: string) => {
        setCascadeKind(kind);
        onPropertySelected(kind, "cascade_kind");
    };

    const onStateChanged = (state: string) => {
        setState(state);
        onPropertySelected(state, "state");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setName("");
        setType("");
        setCascadeKind("");
        setState("");
    };

    return {
        translate,
        name,
        onNameChanged,
        type,
        onTypeChanged,
        cascadeKind,
        onCascadeKindChanged,
        state,
        onStateChanged,
        onClearFilters
    };
};

export default useCascadesListFilter;
