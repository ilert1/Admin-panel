import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { useState } from "react";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle, TestEnvText } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import useAccountFilter from "@/hooks/useAccountFilter";

export const AccountListFilter = () => {
    const { merchantId, onMerchantChanged, translate, clearFilters, adminOnly } = useAccountFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !merchantId;

    return (
        <div>
            <TestEnvText />
            <div className="flex flex-col">
                <div className="mb-6 flex flex-wrap justify-between gap-4">
                    <ResourceHeaderTitle />

                    {adminOnly && (
                        <FilterButtonGroup
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            clearButtonDisabled={clearDisabled}
                            filterList={[merchantId]}
                            onClearFilters={clearFilters}
                        />
                    )}
                </div>
                {adminOnly && (
                    <AnimatedContainer open={openFiltersClicked}>
                        <div className="mb-4 flex w-full flex-col flex-wrap justify-start gap-2 sm:mb-6 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                            <div className="flex-grow-100 flex min-w-[150px] max-w-[700px] flex-1 flex-col gap-1">
                                <Label variant="title-2" className="mb-0 md:text-nowrap">
                                    {translate("resources.transactions.filter.filterByAccount")}
                                </Label>

                                <MerchantSelectFilter
                                    merchant={merchantId}
                                    onMerchantChanged={onMerchantChanged}
                                    resource="merchant"
                                />
                            </div>
                        </div>
                    </AnimatedContainer>
                )}
            </div>
        </div>
    );
};
