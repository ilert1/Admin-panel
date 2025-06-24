import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { ProvidersDataProvider, TerminalsDataProvider } from "@/data";

const useTerminalPaymentInstrumentFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const providersDataProvider = new ProvidersDataProvider();
    const terminalsDataProvider = new TerminalsDataProvider();
    const translate = useTranslate();

    const [terminalPaymentTypeCode, setTerminalPaymentTypeCode] = useState(
        filterValues?.terminal_payment_type_code || ""
    );
    const [terminalCurrencyCode, setTerminalCurrencyCode] = useState(filterValues?.terminal_currency_code || "");
    const [terminalFinancialInstitutionCode, setTerminalFinancialInstitutionCode] = useState(
        filterValues?.terminal_financial_institution_code || ""
    );
    const [terminalFilterId, setTerminalFilterId] = useState(filterValues?.terminalFilterId || "");
    const [terminalFilterName, setTerminalFilterName] = useState("");
    const [providerName, setProviderName] = useState(filterValues?.provider || "");

    const {
        data: providersData,
        isLoading: isProvidersLoading,
        isFetching: isProvidersFetching
    } = useQuery({
        queryKey: ["providers", "filter"],
        queryFn: () => providersDataProvider.getListWithoutPagination(),
        select: data => data.data
    });

    const {
        data: terminalsData,
        isLoading: isTerminalsLoading,
        isFetching: isTerminalsFetching
    } = useQuery({
        queryKey: ["terminals", "filter", providerName],
        queryFn: () => terminalsDataProvider.getListWithoutPagination(["provider"], [providerName]),
        enabled: !!providerName,
        select: data => data.data
    });

    const providersLoadingProcess = useMemo(
        () => isProvidersLoading || isProvidersFetching,
        [isProvidersFetching, isProvidersLoading]
    );

    const terminalsLoadingProcess = useMemo(
        () => isTerminalsLoading || isTerminalsFetching,
        [isTerminalsFetching, isTerminalsLoading]
    );

    useEffect(() => {
        if (terminalsData) {
            setTerminalFilterName(
                terminalsData?.find(terminal => terminal.terminal_id === filterValues?.terminalFilterId)
                    ?.verbose_name || ""
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalsData]);

    const onPropertySelected = debounce(
        (
            value: string,
            type:
                | "terminal_payment_type_code"
                | "terminal_currency_code"
                | "terminal_financial_institution_code"
                | "terminalFilterId"
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

    const onProviderChanged = (provider: string) => {
        setProviderName(provider);

        setTerminalFilterId("");
        setTerminalFilterName("");
        setTerminalPaymentTypeCode("");
        setTerminalCurrencyCode("");
        setTerminalFinancialInstitutionCode("");

        if (provider) {
            setFilters({ ["provider"]: provider }, displayedFilters, true);
        } else {
            setFilters({}, displayedFilters, true);
        }

        setPage(1);
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

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setTerminalPaymentTypeCode("");
        setTerminalCurrencyCode("");
        setTerminalFinancialInstitutionCode("");
        setTerminalFilterId("");
        setTerminalFilterName("");
        setProviderName("");
    };

    return {
        providersData,
        providersLoadingProcess,
        onClearFilters,
        onProviderChanged,
        translate,
        terminalPaymentTypeCode,
        terminalCurrencyCode,
        terminalFinancialInstitutionCode,
        onTerminalPaymentTypeCodeChanged,
        onTerminalCurrencyCodeChanged,
        onTerminalFinancialInstitutionCodeChanged,
        terminalsLoadingProcess,
        providerName,
        terminalFilterName,
        terminalsData,
        terminalFilterId,
        onTerminalNameChanged,
        onTerminalIdFieldChanged
    };
};

export default useTerminalPaymentInstrumentFilter;
