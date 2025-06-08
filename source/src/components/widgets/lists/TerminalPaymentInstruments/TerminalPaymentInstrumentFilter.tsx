import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingBalance } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { TerminalSelectFilter } from "../Terminals/TerminalsListFilter/TerminalSelectFilter";
import useTerminalPaymentInstrumentFilter from "./useTerminalPaymentInstrumentFilter";
import { Button } from "@/components/ui/Button";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { PaymentTypeBase } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { useState } from "react";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/Input/input";

interface TerminalPaymentInstrumentFilterProps {
    terminalPaymentTypes?: PaymentTypeBase[] | undefined;
    createFn: () => void;
}

export const TerminalPaymentInstrumentFilter = ({
    createFn,
    terminalPaymentTypes
}: TerminalPaymentInstrumentFilterProps) => {
    const {
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
        terminalFilterId,
        onTerminalIdFieldChanged,
        onTerminalNameChanged
    } = useTerminalPaymentInstrumentFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const terminalsDataProvider = new TerminalPaymentInstrumentsProvider();
    const appToast = useAppToast();

    const handleInit = async () => {
        try {
            await terminalsDataProvider.initialize(
                terminalFilterId,
                terminalPaymentTypes ? terminalPaymentTypes.map(el => el.code) : []
            );
            appToast(
                "success",
                translate("resources.paymentTools.terminalPaymentInstruments.terminalPaymentInstrumentInitialized")
            );
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            }
        }
    };

    const clearDisabled =
        !currentProvider &&
        !terminalFilterId &&
        !terminalPaymentTypeCode &&
        !terminalCurrencyCode &&
        !terminalFinancialInstitutionCode;

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <SyncDisplayedFilters />

                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[
                            currentProvider,
                            terminalFilterId,
                            terminalPaymentTypeCode,
                            terminalCurrencyCode,
                            terminalFinancialInstitutionCode
                        ]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />

                    <div className="flex justify-end">
                        <Button onClick={createFn} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate(
                                    "resources.paymentTools.terminalPaymentInstruments.createTerminalPaymentInstrument"
                                )}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            <AnimatedContainer open={openFiltersClicked}>
                <div className="mb-6">
                    <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:flex-row md:items-end">
                        <div className="md: flex min-w-36 flex-1 flex-col gap-1 sm:max-w-96 md:max-w-60">
                            <Label className="mb-0" variant="title-2">
                                {translate("resources.terminals.selectHeader")}
                            </Label>

                            <Select onValueChange={onProviderChanged} value={currentProvider}>
                                <SelectTrigger className="text-ellipsis">
                                    <SelectValue placeholder={translate("resources.terminals.selectPlaceholder")} />
                                </SelectTrigger>

                                <SelectContent align="start" onScrollCapture={providerScrollHandler}>
                                    <SelectItem key={"Show all"} value={"Show All"}>
                                        <p className="max-w-36 truncate">
                                            {translate("resources.transactions.filter.showAll")}
                                        </p>
                                    </SelectItem>

                                    {providersData?.pages.map(page => {
                                        return page.data.map(provider => (
                                            <SelectItem key={provider.name} value={provider.name}>
                                                <p className="max-w-36 truncate">{provider.name}</p>
                                            </SelectItem>
                                        ));
                                    })}

                                    {(providersLoadingProcess ||
                                        (!providersLoadingProcess && isFetching && !providersData)) && (
                                        <SelectItem value="null" disabled className="h-8">
                                            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                                                <LoadingBalance className="h-[20px] w-[20px] overflow-hidden" />
                                            </div>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col gap-1 sm:max-w-96 md:max-w-[400px]">
                            <Label variant="title-2" className="mb-0 md:text-nowrap">
                                {translate("resources.terminals.filter.filterByName")}
                            </Label>

                            <TerminalSelectFilter
                                currentProvider={currentProvider}
                                onChangeTerminalFilter={onTerminalNameChanged}
                                terminalFilterName={terminalFilterName}
                                disabled={
                                    providersLoadingProcess ||
                                    (!providersLoadingProcess && isFetching && !providersData) ||
                                    currentProvider === "Show All"
                                }
                                setTerminalFilterId={onTerminalIdFieldChanged}
                            />
                        </div>
                        <div className="">
                            <Button
                                onClick={handleInit}
                                disabled={!(Boolean(currentProvider) && Boolean(terminalFilterName))}>
                                {translate("resources.paymentTools.terminalPaymentInstruments.initInstruments")}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                            <div className="w-full">
                                <Input
                                    value={terminalFinancialInstitutionCode}
                                    onChange={onTerminalFinancialInstitutionCodeChanged}
                                    label={translate(
                                        "resources.paymentTools.terminalPaymentInstruments.fields.terminal_financial_institution_code"
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    value={terminalCurrencyCode}
                                    onChange={onTerminalCurrencyCodeChanged}
                                    label={translate(
                                        "resources.paymentTools.terminalPaymentInstruments.fields.terminal_currency_code"
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    value={terminalPaymentTypeCode}
                                    onChange={onTerminalPaymentTypeCodeChanged}
                                    label={translate(
                                        "resources.paymentTools.terminalPaymentInstruments.fields.terminal_payment_type_code"
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </>
    );
};
