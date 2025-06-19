import { CallbackStatusEnum } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useDataProvider, useListContext, useTranslate } from "react-admin";

const useSystemPaymentInstrumentsListFilter = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const [name, setName] = useState(filterValues?.name || "");
    const [currencyCode, setCurrencyCode] = useState(filterValues?.currency_code || "");
    const [paymentTypeCode, setPaymentTypeCode] = useState(filterValues?.payment_type_code || "");

    const { data: currencies, isLoading: isLoadingCurrencies } = useQuery({
        queryKey: ["currencies"],
        queryFn: ({ signal }) => dataProvider.getListWithoutPagination("currency", signal),
        select: data => data.data
    });

    const { data: paymentTypes, isLoading: isLoadingPaymentTypes } = useQuery({
        queryKey: ["paymentTypesForSystemPI"],
        queryFn: () => dataProvider.getListWithoutPagination("payment_type"),
        select: data => data.data
    });

    const onPropertySelected = debounce((value: string, type: "name" | "currency_code" | "payment_type_code") => {
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

    const onCurrencyCodeChanged = (e: string) => {
        setCurrencyCode(e);
        onPropertySelected(e, "currency_code");
    };

    const onPaymentTypeCodeChanged = (value: CallbackStatusEnum | "") => {
        setPaymentTypeCode(value);
        onPropertySelected(value, "payment_type_code");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setName("");
        setCurrencyCode("");
        setPaymentTypeCode("");
    };

    return {
        translate,
        name,
        currencyCode,
        paymentTypeCode,
        currencies,
        isLoadingCurrencies,
        paymentTypes,
        isLoadingPaymentTypes,
        onPaymentTypeCodeChanged,
        onClearFilters,
        onNameChanged,
        onCurrencyCodeChanged
    };
};

export default useSystemPaymentInstrumentsListFilter;
