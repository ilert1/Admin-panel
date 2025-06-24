import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useFinancialInstitutionsListFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const [name, setName] = useState(filterValues?.name || "");
    const [code, setCode] = useState(filterValues?.code || "");
    const [institutionType, setInstitutionType] = useState(filterValues?.institution_type || "");
    const [countryCode, setCountryCode] = useState(filterValues?.country_code || "");
    const [nspkMemberId, setNspkMemberId] = useState(filterValues?.nspk_member_id || "");

    const onPropertySelected = debounce(
        (value: string, type: "name" | "code" | "institution_type" | "country_code" | "nspk_member_id") => {
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

    const onNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        onPropertySelected(e.target.value, "name");
    };

    const onCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        onPropertySelected(e.target.value, "code");
    };

    const onInstitutionTypeChanged = (value: string) => {
        setInstitutionType(value);
        onPropertySelected(value, "institution_type");
    };
    const onCountryCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCountryCode(value);
        onPropertySelected(value, "country_code");
    };
    const onNspkMemberIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNspkMemberId(value);
        onPropertySelected(value, "nspk_member_id");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setName("");
        setCode("");
        setInstitutionType("");
        setCountryCode("");
        setNspkMemberId("");
    };

    return {
        translate,
        name,
        code,
        institutionType,
        countryCode,
        nspkMemberId,
        onCodeChanged,
        onInstitutionTypeChanged,
        onCountryCodeChanged,
        onNspkMemberIdChanged,
        onClearFilters,
        onNameChanged
    };
};

export default useFinancialInstitutionsListFilter;
