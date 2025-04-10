import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { useListContext, usePermissions, useTranslate } from "react-admin";
import fetchDictionaries from "@/helpers/get-dictionaries";

const useAccountFilter = () => {
    const dictionaries = fetchDictionaries();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [merchantId, setMerchantId] = useState<string>(filterValues?.merchantId || "");

    const translate = useTranslate();

    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const onPropertySelected = debounce((value: string, type: "merchantId") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "merchantId");
    };

    const clearFilters = () => {
        setMerchantId("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        dictionaries,
        merchantId,
        translate,
        clearFilters,
        onMerchantChanged,
        adminOnly
    };
};

export default useAccountFilter;
