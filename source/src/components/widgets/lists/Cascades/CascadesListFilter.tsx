import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import useCascadesListFilter from "./useCascadesListFilter";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CASCADE_KIND, CASCADE_STATE, CASCADE_TYPE } from "@/data/cascades";
import { PopoverSelect } from "../../components/Selects/PopoverSelect";
import { CurrencySelect } from "../../components/Selects/CurrencySelect";

export const CascadesListFilter = ({ handleCreateClicked }: { handleCreateClicked: () => void }) => {
    const {
        translate,
        cascadesData,
        isCascadesLoading,
        name,
        onNameChanged,
        type,
        onTypeChanged,
        cascadeKind,
        onCascadeKindChanged,
        state,
        onStateChanged,
        currenciesData,
        currenciesLoadingProcess,
        srcCurrencyCode,
        onSrcCurrencyCodeChanged,
        onClearFilters
    } = useCascadesListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !srcCurrencyCode && !name && !type && !cascadeKind && !state;

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <FilterButtonGroup
                            filterList={[name, type, cascadeKind, state, srcCurrencyCode]}
                            onClearFilters={onClearFilters}
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            clearButtonDisabled={clearDisabled}
                        />
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate("resources.cascadeSettings.cascades.createNew")}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatedContainer open={openFiltersClicked}>
                <div className="mb-6">
                    <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:flex-row md:items-end">
                        <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
                            <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col gap-1 sm:max-w-96 md:max-w-[400px]">
                                <Label className="mb-0" variant="title-2">
                                    {translate("resources.cascadeSettings.cascades.cascade")}
                                </Label>

                                <PopoverSelect
                                    style="Black"
                                    variants={cascadesData || []}
                                    value={name}
                                    onChange={onNameChanged}
                                    variantKey="name"
                                    placeholder={translate("resources.cascadeSettings.cascades.selectPlaceholder")}
                                    commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                    notFoundMessage={translate("resources.cascadeSettings.cascades.notFoundMessage")}
                                    disabled={isCascadesLoading}
                                    isLoading={isCascadesLoading}
                                />
                            </div>

                            <div className="flex min-w-48 flex-1 flex-col gap-1">
                                <Label variant="title-2" className="mb-0">
                                    {translate("resources.cascadeSettings.cascades.fields.type")}
                                </Label>

                                <Select
                                    value={type}
                                    onValueChange={val => {
                                        return val !== "null" ? onTypeChanged(val) : onTypeChanged("");
                                    }}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.cascadeSettings.cascades.placeholders.type"
                                            )}
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="null">
                                                {translate("resources.cascadeSettings.cascades.placeholders.showAll")}
                                            </SelectItem>

                                            {CASCADE_TYPE.map(type => (
                                                <SelectItem value={type} key={type}>
                                                    {translate(`resources.cascadeSettings.cascades.types.${type}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex min-w-48 flex-1 flex-col gap-1">
                                <Label variant="title-2" className="mb-0">
                                    {translate("resources.cascadeSettings.cascades.fields.cascade_kind")}
                                </Label>

                                <Select
                                    value={cascadeKind}
                                    onValueChange={val => {
                                        return val !== "null" ? onCascadeKindChanged(val) : onCascadeKindChanged("");
                                    }}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.cascadeSettings.cascades.placeholders.cascade_kind"
                                            )}
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="null">
                                                {translate("resources.cascadeSettings.cascades.placeholders.showAll")}
                                            </SelectItem>

                                            {CASCADE_KIND.map(kind => (
                                                <SelectItem value={kind} key={kind}>
                                                    {translate(`resources.cascadeSettings.cascades.kinds.${kind}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex min-w-48 flex-1 flex-col gap-1">
                                <Label variant="title-2" className="mb-0">
                                    {translate("resources.cascadeSettings.cascades.fields.state")}
                                </Label>

                                <Select
                                    value={state}
                                    onValueChange={val => {
                                        return val !== "null" ? onStateChanged(val) : onStateChanged("");
                                    }}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.cascadeSettings.cascades.placeholders.state"
                                            )}
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="null">
                                                {translate("resources.cascadeSettings.cascades.placeholders.showAll")}
                                            </SelectItem>

                                            {CASCADE_STATE.map(state => (
                                                <SelectItem value={state} key={state}>
                                                    {translate(`resources.cascadeSettings.cascades.state.${state}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex min-w-36 flex-1 flex-col">
                                <Label variant={"title-2"}>
                                    {translate(
                                        "resources.paymentSettings.systemPaymentInstruments.fields.currency_code"
                                    )}
                                </Label>
                                <CurrencySelect
                                    currencies={currenciesData ?? []}
                                    value={srcCurrencyCode}
                                    onChange={onSrcCurrencyCodeChanged}
                                    disabled={currenciesLoadingProcess}
                                    style="Black"
                                    placeholder={translate(
                                        "resources.paymentSettings.systemPaymentInstruments.placeholders.currencyCode"
                                    )}
                                    isLoading={currenciesLoadingProcess}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </>
    );
};
