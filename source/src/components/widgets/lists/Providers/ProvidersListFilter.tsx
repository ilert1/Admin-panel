import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import useProvidersFilter from "@/components/widgets/lists/Providers/useProvidersFilter";
import { CreateProviderDialog } from "./CreateProviderDialog";
import { ProviderSelect } from "../../components/Selects/ProviderSelect";

export const ProvidersListFilter = () => {
    const {
        translate,
        providersData,
        providersLoadingProcess,
        providerId,
        onProviderIdChanged,
        providerName,
        onProviderNameChanged,
        clearFilters
    } = useProvidersFilter();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDisabled = !providerId;

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
                            <span className="text-title-1">{translate("resources.provider.createNew")}</span>
                        </Button>

                        <FilterButtonGroup
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            filterList={[providerId]}
                            clearButtonDisabled={clearDisabled}
                            onClearFilters={clearFilters}
                        />
                    </div>
                </div>

                <AnimatedContainer open={openFiltersClicked}>
                    <div className="flex-grow-100 mb-4 flex min-w-[150px] max-w-[700px] flex-1 flex-col gap-1 md:mb-6">
                        <Label variant="title-2" className="mb-0 md:text-nowrap">
                            {translate("resources.transactions.filter.filterByProvider")}
                        </Label>

                        <ProviderSelect
                            providers={providersData || []}
                            value={providerName}
                            onChange={onProviderNameChanged}
                            disabled={providersLoadingProcess}
                            isLoading={providersLoadingProcess}
                            idField="id"
                            setIdValue={onProviderIdChanged}
                            idFieldValue={providerId}
                            style="Black"
                        />
                    </div>
                </AnimatedContainer>
            </div>

            <CreateProviderDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
