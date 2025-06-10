import { ChangeEvent, UIEvent, useEffect, useMemo, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { ProviderWithId } from "@/data/providers";
import { useAbortableInfiniteGetList } from "@/hooks/useAbortableInfiniteGetList";
import { debounce } from "lodash";

const useTerminalPaymentInstrumentFilter = () => {
    const {
        data: providersData,
        isFetchingNextPage,
        hasNextPage,
        isFetching,
        isFetched,
        fetchNextPage: providersNextPage
    } = useAbortableInfiniteGetList<ProviderWithId>("provider", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const translate = useTranslate();

    const providersLoadingProcess = useMemo(() => isFetchingNextPage && hasNextPage, [isFetchingNextPage, hasNextPage]);

    const onProviderChanged = (provider: string) => {
        localStorage.setItem("providerInTerminalsPaymenInstrument", provider);
        setCurrentProvider(provider ? provider : "");
        onPropertySelected(provider, "provider");
    };

    useEffect(() => {
        const previousProvider = localStorage.getItem("providerInTerminalsPaymenInstrument");

        if (
            previousProvider &&
            isFetched &&
            providersData?.pages.find(providerItem => providerItem.data.find(item => item.name === previousProvider))
        ) {
            setCurrentProvider(previousProvider);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersLoadingProcess, providersData?.pages]);

    const providerScrollHandler = async (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            providersNextPage();
        }
    };

    const [terminalPaymentTypeCode, setTerminalPaymentTypeCode] = useState(
        filterValues?.terminal_payment_type_code || ""
    );
    const [terminalCurrencyCode, setTerminalCurrencyCode] = useState(filterValues?.terminal_currency_code || "");
    const [terminalFinancialInstitutionCode, setTerminalFinancialInstitutionCode] = useState(
        filterValues?.terminal_financial_institution_code || ""
    );

    const [terminalFilterName, setTerminalFilterName] = useState("");
    const [terminalFilterId, setTerminalFilterId] = useState("");
    const [currentProvider, setCurrentProvider] = useState("");

    const onPropertySelected = debounce(
        (
            value: string,
            type:
                | "terminal_payment_type_code"
                | "terminal_currency_code"
                | "terminal_financial_institution_code"
                | "terminalFilterId"
                | "provider"
        ) => {
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

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setTerminalPaymentTypeCode("");
        setTerminalCurrencyCode("");
        setTerminalFinancialInstitutionCode("");

        setTerminalFilterId("");
        setCurrentProvider("");
        setTerminalFilterName("");
    };

    const onTerminalPaymentTypeCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerminalPaymentTypeCode(value);
        onPropertySelected(value, "terminal_payment_type_code");
    };

    const onTerminalCurrencyCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerminalCurrencyCode(value);
        onPropertySelected(value, "terminal_currency_code");
    };

    const onTerminalFinancialInstitutionCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerminalFinancialInstitutionCode(value);
        onPropertySelected(value, "terminal_financial_institution_code");
    };

    const onTerminalIdFieldChanged = (value: string) => {
        setTerminalFilterId(value);
        onPropertySelected(value, "terminalFilterId");
    };

    const onTerminalNameChanged = (value: string) => {
        setTerminalFilterName(value);
    };

    return {
        providersData,
        isFetching,
        providersLoadingProcess,
        onClearFilters,
        onProviderChanged,
        translate,
        providerScrollHandler,
        terminalPaymentTypeCode,
        terminalCurrencyCode,
        terminalFinancialInstitutionCode,
        onTerminalPaymentTypeCodeChanged,
        onTerminalCurrencyCodeChanged,
        onTerminalFinancialInstitutionCodeChanged,
        currentProvider,
        terminalFilterName,
        setTerminalFilterName,
        terminalFilterId,
        setTerminalFilterId,
        onTerminalIdFieldChanged,
        onTerminalNameChanged
    };
};

export default useTerminalPaymentInstrumentFilter;
