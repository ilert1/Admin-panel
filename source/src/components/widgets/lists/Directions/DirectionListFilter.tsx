import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { Label } from "@/components/ui/label";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { CreateDirectionDialog } from "./CreateDirectionDialog";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import useDirectionsListFilter from "@/components/widgets/lists/Directions/useDirectionsListFilter";
import { ProviderSelect } from "../../components/Selects/ProviderSelect";
import { MerchantSelect } from "../../components/Selects/MerchantSelect";

export const DirectionListFilter = () => {
    const translate = useTranslate();

    const {
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        merchantId,
        onMerchantChanged,
        clearFilters,
        provider,
        onProviderChanged,
        providersData,
        providersLoadingProcess
    } = useDirectionsListFilter();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const clearDisabled = !merchantId && !provider;

    return (
        <>
            <div className="flex w-full flex-col">
                <div className="mb-4 flex flex-wrap justify-between gap-x-52 gap-y-3 sm:gap-3 md:mb-6">
                    <ResourceHeaderTitle />

                    <div className="flex flex-1 flex-col justify-end gap-2 sm:flex-row sm:gap-6">
                        <Button
                            onClick={handleCreateClick}
                            variant="default"
                            className="flex flex-1 items-center gap-[4px] sm:flex-none">
                            <PlusCircle className="h-[16px] w-[16px]" />
                            <span className="text-title-1">{translate("resources.direction.create")}</span>
                        </Button>

                        <FilterButtonGroup
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            filterList={[merchantId, provider]}
                            clearButtonDisabled={clearDisabled}
                            onClearFilters={clearFilters}
                        />
                    </div>
                </div>

                <AnimatedContainer open={openFiltersClicked}>
                    <div className="mb-4 flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                        <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
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

                        <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                            <Label variant="title-2" className="mb-0 md:text-nowrap">
                                {translate("resources.terminals.selectHeader")}
                            </Label>

                            <ProviderSelect
                                providers={providersData || []}
                                value={provider}
                                onChange={onProviderChanged}
                                isLoading={providersLoadingProcess}
                                disabled={providersLoadingProcess}
                                style="Black"
                            />
                        </div>
                    </div>
                </AnimatedContainer>
            </div>
            <CreateDirectionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
