import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import useFinancialInstitutionsListFilter from "./useFinancialInstitutionsListFilter";
import { FinancialInstitutionType } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";

interface FinancialInstitutionsListFilterProps {
    handleCreateClicked: () => void;
}

export const FinancialInstitutionsListFilter = (props: FinancialInstitutionsListFilterProps) => {
    const { handleCreateClicked } = props;

    const {
        translate,
        name,
        shortName,
        institutionType,
        countryCode,
        nspkMemberId,
        onShortNameChanged,
        onInstitutionTypeChanged,
        onCountryCodeChanged,
        onNspkMemberIdChanged,
        onClearFilters,
        onNameChanged
    } = useFinancialInstitutionsListFilter();

    const { isLoading: financialInstitutionTypesLoading, data: financialInstitutionTypes } =
        useFetchFinancialInstitutionTypes();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !name && !shortName && !institutionType && !countryCode && !nspkMemberId;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[name, shortName, institutionType, countryCode, nspkMemberId]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />

                    <div className="flex justify-end">
                        <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate("resources.paymentTools.financialInstitution.createFinancialInstitutionBtn")}
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
                                label={translate("resources.paymentTools.financialInstitution.fields.name")}
                                labelSize="title-2"
                                value={name}
                                onChange={onNameChanged}
                                placeholder={translate("resources.paymentTools.financialInstitution.placeholders.name")}
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                label={translate("resources.paymentTools.financialInstitution.fields.short_name")}
                                labelSize="title-2"
                                value={shortName}
                                onChange={onShortNameChanged}
                                placeholder={translate("resources.paymentTools.financialInstitution.fields.short_name")}
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                label={translate("resources.paymentTools.financialInstitution.fields.country_code")}
                                labelSize="title-2"
                                value={countryCode}
                                onChange={onCountryCodeChanged}
                                placeholder={translate(
                                    "resources.paymentTools.financialInstitution.fields.country_code"
                                )}
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                label={translate("resources.paymentTools.financialInstitution.fields.nspk_member_id")}
                                labelSize="title-2"
                                value={nspkMemberId}
                                onChange={onNspkMemberIdChanged}
                                placeholder={translate(
                                    "resources.paymentTools.financialInstitution.fields.nspk_member_id"
                                )}
                            />
                        </div>
                        <div className="w-full">
                            <Label variant={"title-2"}>
                                {translate("resources.paymentTools.financialInstitution.fields.institution_type")}
                            </Label>
                            <Select
                                value={institutionType}
                                onValueChange={value =>
                                    value === "null" ? onInstitutionTypeChanged("") : onInstitutionTypeChanged(value)
                                }>
                                <SelectTrigger
                                    disabled={financialInstitutionTypesLoading}
                                    className="h-[38px] !w-full text-ellipsis">
                                    <SelectValue
                                        placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                    />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="null">
                                            {translate("resources.transactions.filter.showAll")}
                                        </SelectItem>

                                        {financialInstitutionTypes?.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </div>
    );
};
