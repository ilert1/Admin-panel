import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { useCascadeMerchantsListFilter } from "./useCascadeMerchantsListFilter";
import { MerchantSelect } from "../../components/Selects/MerchantSelect";
import { Label } from "@/components/ui/label";
import { CascadeSelect } from "../../components/Selects/CascadeSelect";

export const CascadeMerchantListFilter = ({ handleCreateClicked }: { handleCreateClicked: () => void }) => {
    const {
        translate,
        onClearFilters,
        onMerchantChanged,
        onCascadeChanged,
        cascadeValue,
        setCascadeValue,
        cascadeId,
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        merchantId,
        cascadeData,
        cascadesLoadingProcess
    } = useCascadeMerchantsListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !merchantId && !cascadeId;

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <FilterButtonGroup
                            filterList={[merchantId, cascadeId]}
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
                            <div className="flex min-w-36 flex-1 flex-col items-start md:min-w-56">
                                <Label variant={"title-2"} className="md:text-nowrap">
                                    {translate("resources.cascadeSettings.cascadeMerchants.fields.cascade")}
                                </Label>
                                <CascadeSelect
                                    cascades={cascadeData ?? []}
                                    value={cascadeValue}
                                    onChange={setCascadeValue}
                                    setIdValue={onCascadeChanged}
                                    disabled={cascadesLoadingProcess || !merchantId}
                                    isLoading={cascadesLoadingProcess}
                                    style="Black"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </>
    );
};
