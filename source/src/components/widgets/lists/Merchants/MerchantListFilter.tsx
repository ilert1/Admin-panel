import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CreateMerchantDialog } from "./CreateMerchantDialog";
import useMerchantFilter from "@/components/widgets/lists/Merchants/useMerchantFilter";
import { MerchantSelect } from "../../components/Selects/MerchantSelect";

export const MerchantListFilter = () => {
    const {
        translate,
        merchantData,
        merchantsLoadingProcess,
        onMerchantChanged,
        merchantValue,
        setMerchantValue,
        clearFilters
    } = useMerchantFilter();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !merchantValue;

    return (
        <>
            <div className="flex w-full flex-col">
                <div className="mb-4 flex flex-wrap justify-between gap-x-52 gap-y-3 sm:gap-3 md:mb-6">
                    <ResourceHeaderTitle />

                    <div className="flex flex-1 flex-row justify-end gap-2 sm:flex-none sm:gap-6">
                        <Button
                            onClick={() => setCreateDialogOpen(true)}
                            variant="default"
                            className="flex flex-1 items-center gap-1 sm:flex-none">
                            <PlusCircle className="h-[16px] w-[16px]" />
                            <span className="text-title-1">{translate("resources.merchant.createNew")}</span>
                        </Button>

                        <FilterButtonGroup
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            filterList={[merchantValue]}
                            clearButtonDisabled={clearDisabled}
                            onClearFilters={clearFilters}
                        />
                    </div>
                </div>

                <AnimatedContainer open={openFiltersClicked}>
                    <div className="flex-grow-100 mb-4 flex min-w-[150px] max-w-[700px] flex-1 flex-col gap-1 md:mb-6">
                        <Label variant="title-2" className="mb-0 md:text-nowrap">
                            {translate("resources.transactions.filter.filterByAccount")}
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
                </AnimatedContainer>
            </div>

            <CreateMerchantDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
