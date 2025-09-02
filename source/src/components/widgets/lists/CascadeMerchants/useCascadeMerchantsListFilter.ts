import { CascadeMerchantsDataProvider } from "@/data/merchant_cascade";
import { useMerchantsListWithoutPagination } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

export const useCascadeMerchantsListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const translate = useTranslate();
    const dataProvider = new CascadeMerchantsDataProvider();
    const { merchantData, merchantsLoadingProcess } = useMerchantsListWithoutPagination();

    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");
    const [merchantValue, setMerchantValue] = useState("");
    const [cascadeId, setCascadeId] = useState(filterValues?.cascade_id || "");
    const [cascadeValue, setCascadeValue] = useState("");

    const { data: cascadeData, isLoading: cascadesLoadingProcess } = useQuery({
        queryKey: ["Cascades list"],
        queryFn: async () => dataProvider.getMerchantCascades(merchantId),
        enabled: !!merchantId
    });

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.merchant)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const onPropertySelected = debounce((value: string, type: "merchant_id" | "cascade_id") => {
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
        onPropertySelected(merchant, "merchant_id");
    };

    const onCascadeChanged = (merchant: string) => {
        setCascadeId(merchant);
        onPropertySelected(merchant, "cascade_id");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setMerchantId("");
        setMerchantValue("");
        setCascadeId("");
        setCascadeValue("");
    };

    return {
        translate,
        onClearFilters,
        onMerchantChanged,
        onCascadeChanged,
        cascadeValue,
        setCascadeValue,
        cascadeId,
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        merchantId,
        cascadeData,
        cascadesLoadingProcess
    };
};
