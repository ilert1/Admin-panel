import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const usePaymentTypesListFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [code, setCode] = useState(filterValues?.code || "");
    const [title, setTitle] = useState(filterValues?.title || "");
    const [category, setCategory] = useState(filterValues?.category || "");
    const onPropertySelected = debounce((value: string, type: "code" | "title" | "category") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        onPropertySelected(e.target.value, "code");
    };

    const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        onPropertySelected(e.target.value, "title");
    };

    const onCategoryChanged = (value: string) => {
        setCategory(value);
        onPropertySelected(value, "category");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setCode("");
        setTitle("");
        setCategory("");
    };

    return {
        translate,
        code,
        title,
        category,
        onCategoryChanged,
        onClearFilters,
        onCodeChanged,
        onTitleChanged
    };
};

export default usePaymentTypesListFilter;
