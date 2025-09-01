import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { useCascadeMerchantsListFilter } from "./useCascadeMerchantsListFilter";
import { MerchantSelect } from "../../components/Selects/MerchantSelect";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormMessage } from "@/components/ui/form";

const CASCADE_KIND = ["sequential", "fanout"];
const CASCADE_TYPE = ["deposit", "withdrawal"];

export const CascadeMerchantListFilter = ({ handleCreateClicked }: { handleCreateClicked: () => void }) => {
    const {
        translate,
        cascadeKind,
        currency,
        onClearFilters,
        onKindChanged,
        onCurrencyChanged,
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        merchantId,
        onMerchantChanged,
        onTypeChanged,
        cascadeType
    } = useCascadeMerchantsListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !merchantId && !cascadeKind && !currency;

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <FilterButtonGroup
                            filterList={[merchantId, cascadeKind, currency]}
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
                                {translate("resources.cascadeSettings.cascadeMerchants.createNew")}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            {/* Мерчант Тип каскада Валюта каскада Вид каскада */}
            <AnimatedContainer open={openFiltersClicked}>
                <div className="mb-6">
                    <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:flex-row md:items-end">
                        <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
                            <div className="flex min-w-36 flex-1 flex-col items-start md:min-w-56">
                                <Label variant={"title-2"} className="md:text-nowrap">
                                    {translate("resources.cascadeSettings.cascadeMerchants.fields.merchant")}
                                </Label>
                                <MerchantSelect
                                    merchants={merchantData || []}
                                    value={merchantValue}
                                    onChange={setMerchantValue}
                                    setIdValue={onMerchantChanged}
                                    disabled={merchantsLoadingProcess}
                                    isLoading={merchantsLoadingProcess}
                                    style="Black"
                                />
                            </div>
                            <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                                <Input
                                    label={translate("resources.cascadeSettings.cascades.fields.src_currency_code")}
                                    labelSize="title-2"
                                    value={currency}
                                    onChange={onCurrencyChanged}
                                    className="min-w-40"
                                    placeholder={translate(
                                        "resources.cascadeSettings.cascades.placeholders.src_currency_code"
                                    )}
                                />
                            </div>
                            <div className="flex min-w-36 flex-1 flex-col items-start md:min-w-56">
                                <Label variant={"title-2"} className="md:text-nowrap">
                                    {translate("resources.cascadeSettings.cascadeMerchants.fields.kind")}
                                </Label>
                                <Select value={cascadeKind} onValueChange={onKindChanged}>
                                    <SelectTrigger errorMessage={<FormMessage />}>
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.cascadeSettings.cascadeMerchants.fields.kind"
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {CASCADE_KIND.map(kind => (
                                                <SelectItem value={kind} key={kind}>
                                                    {translate(`resources.cascadeSettings.cascades.kinds.${kind}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex min-w-36 flex-1 flex-col items-start md:min-w-56">
                                <Label variant={"title-2"} className="md:text-nowrap">
                                    {translate("resources.cascadeSettings.cascadeMerchants.fields.type")}
                                </Label>
                                <Select value={cascadeType} onValueChange={onTypeChanged}>
                                    <SelectTrigger errorMessage={<FormMessage />}>
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.cascadeSettings.cascadeMerchants.fields.type"
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {CASCADE_TYPE.map(type => (
                                                <SelectItem value={type} key={type}>
                                                    {translate(`resources.cascadeSettings.cascades.types.${type}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </>
    );
};
