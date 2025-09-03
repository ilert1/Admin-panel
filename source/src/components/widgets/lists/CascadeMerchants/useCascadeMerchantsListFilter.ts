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
    const [cascadeIdFromInput, setCascadeIdFromInput] = useState("");
    const [state, setState] = useState<string>(filterValues?.state || "");

    const { data: cascadeData, isLoading: cascadesLoadingProcess } = useQuery({
        queryKey: ["Cascades list"],
        queryFn: async () => dataProvider.getMerchantCascades(merchantId),
        enabled: !!merchantId
    });

    useEffect(() => {
        if (merchantData && filterValues?.merchant) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.merchant)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    useEffect(() => {
        if (cascadeData && filterValues?.cascade_id) {
            setCascadeValue(cascadeData?.find(cascade => cascade.id === filterValues?.cascade_id)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cascadeData]);

    const onPropertySelected = debounce((value: string, type: "merchant_id" | "cascade_id" | "state") => {
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
        if (merchant !== filterValues?.merchant) {
            onPropertySelected(merchant, "merchant_id");
        } else {
            onPropertySelected("", "cascade_id");
        }
    };

    const onCascadeChanged = (cascade_id: string) => {
        setCascadeId(cascade_id);
        setCascadeIdFromInput("");
        onPropertySelected(cascade_id, "cascade_id");
    };

    const onStateChanged = (state: string) => {
        setState(state);
        onPropertySelected(state, "state");
    };

    const onCascadeIdFromInputChanged = (cascadeId: string) => {
        setCascadeIdFromInput(cascadeId);
        setCascadeId("");
        setCascadeValue("");
        onPropertySelected(cascadeId, "cascade_id");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setMerchantId("");
        setMerchantValue("");
        setCascadeId("");
        setCascadeValue("");
        setState("");
        setCascadeIdFromInput("");
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
        cascadesLoadingProcess,
        state,
        onStateChanged,
        onCascadeIdFromInputChanged,
        cascadeIdFromInput
    };
};
