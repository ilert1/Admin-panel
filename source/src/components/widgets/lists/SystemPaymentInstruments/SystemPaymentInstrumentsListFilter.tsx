import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";
import useSystemPaymentInstrumentsListFilter from "./useSystemPaymentInstrumentsListFilter";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { CurrencySelect } from "../../components/Selects/CurrencySelect";
import { PopoverSelect } from "../../components/Selects/PopoverSelect";

interface SystemPaymentInstrumentsListFilterProps {
    handleCreateClicked: () => void;
}

export const SystemPaymentInstrumentsListFilter = (props: SystemPaymentInstrumentsListFilterProps) => {
    const { handleCreateClicked } = props;

    const {
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
    } = useSystemPaymentInstrumentsListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !name && !currencyCode && !paymentTypeCode;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[name, currencyCode, paymentTypeCode]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />

                    <div className="flex justify-end">
                        <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate("resources.paymentTools.systemPaymentInstruments.createNew")}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            <AnimatedContainer open={openFiltersClicked}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        <div className="w-full">
                            <Input
                                label={translate("resources.paymentTools.systemPaymentInstruments.list.name")}
                                labelSize="title-2"
                                value={name}
                                onChange={onNameChanged}
                            />
                        </div>
                        <div className="w-full">
                            <Label variant={"title-2"}>
                                {translate("resources.paymentTools.systemPaymentInstruments.fields.currency_code")}
                            </Label>
                            <CurrencySelect
                                currencies={currencies ?? []}
                                value={currencyCode}
                                onChange={onCurrencyCodeChanged}
                                disabled={isLoadingCurrencies}
                            />
                        </div>
                        <div className="w-full">
                            <Label variant={"title-2"}>
                                {translate("resources.paymentTools.systemPaymentInstruments.list.paymentType")}
                            </Label>
                            <PopoverSelect
                                variants={paymentTypes ?? []}
                                value={paymentTypeCode}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e: any) => onPaymentTypeCodeChanged(e)}
                                variantKey={"code"}
                                commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                notFoundMessage={translate("resources.paymentTools.noAvailable")}
                                disabled={isLoadingPaymentTypes}
                            />
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </div>
    );
};
