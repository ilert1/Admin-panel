import { Label } from "@/components/ui/label";
import useTerminalPaymentInstrumentFilter from "../../../../hooks/useTerminalPaymentInstrumentFilter";
import { Button } from "@/components/ui/Button";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { useState } from "react";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/Input/input";
import { ProviderSelect } from "../../components/Selects/ProviderSelect";
import { PopoverSelect } from "../../components/Selects/PopoverSelect";
import { InitializeTerminalPaymentInstrumentsDialog } from "./InitializeTerminalPaymentInstrumentsDialog";

interface TerminalPaymentInstrumentFilterProps {
    createFn: () => void;
}

export const TerminalPaymentInstrumentFilter = ({ createFn }: TerminalPaymentInstrumentFilterProps) => {
    const {
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
    } = useTerminalPaymentInstrumentFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(true);
    const [showInitializeDialog, setShowInitializeDialog] = useState(false);

    const clearDisabled =
        !providerName &&
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
                            providerName,
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
                                    "resources.paymentSettings.terminalPaymentInstruments.createTerminalPaymentInstrument"
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

                            <ProviderSelect
                                style="Black"
                                providers={providersData || []}
                                value={providerName}
                                onChange={onProviderChanged}
                                disabled={providersLoadingProcess}
                            />
                        </div>

                        <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col gap-1 sm:max-w-96 md:max-w-[400px]">
                            <Label variant="title-2" className="mb-0 md:text-nowrap">
                                {translate("resources.terminals.filter.filterByName")}
                            </Label>

                            <PopoverSelect
                                style="Black"
                                variants={terminalsData || []}
                                variantKey="verbose_name"
                                value={terminalFilterName}
                                onChange={onTerminalNameChanged}
                                idField="terminal_id"
                                setIdValue={onTerminalIdFieldChanged}
                                disabled={terminalsLoadingProcess || !providerName}
                                placeholder={translate("resources.terminals.selectPlaceholder")}
                                commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                notFoundMessage={translate("resources.terminals.notFoundMessage")}
                            />
                        </div>

                        <Button
                            onClick={() => setShowInitializeDialog(true)}
                            disabled={!terminalFilterId || terminalsLoadingProcess || !providerName}>
                            {translate("resources.paymentSettings.terminalPaymentInstruments.initInstruments")}
                        </Button>
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                            <div className="w-full">
                                <Input
                                    labelSize="title-2"
                                    value={terminalFinancialInstitutionCode}
                                    onChange={onTerminalFinancialInstitutionCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    labelSize="title-2"
                                    value={terminalCurrencyCode}
                                    onChange={onTerminalCurrencyCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    labelSize="title-2"
                                    value={terminalPaymentTypeCode}
                                    onChange={onTerminalPaymentTypeCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContainer>

            <InitializeTerminalPaymentInstrumentsDialog
                terminal={terminalsData?.find(item => item.terminal_id === terminalFilterId)}
                open={showInitializeDialog}
                onOpenChange={setShowInitializeDialog}
            />
        </>
    );
};
