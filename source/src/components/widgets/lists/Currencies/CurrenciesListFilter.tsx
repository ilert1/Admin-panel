import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CreateCurrencyDialog } from "./CreateCurrencyDialog";
import useCurrenciesListFilter from "./useCurrenciesListFilter";
import { Label } from "@/components/ui/label";
import { CurrencySelect } from "../../components/Selects/CurrencySelect";

export const CurrenciesListFilter = () => {
    const { translate, currenciesData, currenciesLoadingProcess, currencyCode, onCurrencyCodeChanged, onClearFilters } =
        useCurrenciesListFilter();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !currencyCode;

    return (
        <>
            <div className="flex w-full flex-col">
                <div className="mb-4 flex flex-wrap justify-between gap-x-52 gap-y-3 sm:gap-3 md:mb-6">
                    <ResourceHeaderTitle />

                    <div className="flex flex-1 flex-col justify-end gap-2 sm:flex-row sm:gap-6">
                        <Button
                            onClick={() => setCreateDialogOpen(true)}
                            variant="default"
                            className="flex flex-1 items-center gap-[4px] sm:flex-none">
                            <PlusCircle className="h-[16px] w-[16px]" />
                            <span className="text-title-1">{translate("resources.currency.create")}</span>
                        </Button>

                        <FilterButtonGroup
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            filterList={[currencyCode]}
                            clearButtonDisabled={clearDisabled}
                            onClearFilters={onClearFilters}
                        />
                    </div>
                </div>

                <AnimatedContainer open={openFiltersClicked}>
                    <div className="mb-4 flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                        <div className="flex min-w-36 flex-1 flex-col">
                            <Label variant={"title-2"}>
                                {translate("resources.paymentSettings.systemPaymentInstruments.fields.currency_code")}
                            </Label>
                            <CurrencySelect
                                currencies={currenciesData ?? []}
                                value={currencyCode}
                                onChange={onCurrencyCodeChanged}
                                disabled={currenciesLoadingProcess}
                                style="Black"
                                placeholder={translate(
                                    "resources.paymentSettings.systemPaymentInstruments.placeholders.currencyCode"
                                )}
                                isLoading={currenciesLoadingProcess}
                            />
                        </div>
                    </div>
                </AnimatedContainer>
            </div>

            <CreateCurrencyDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
