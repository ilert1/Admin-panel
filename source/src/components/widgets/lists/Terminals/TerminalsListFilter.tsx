import { Label } from "@/components/ui/label";
import useTerminalFilter from "@/hooks/useTerminalFilter";
import { ProviderSelect } from "@/components/widgets/components/Selects/ProviderSelect";
import { useState } from "react";
import { SyncDisplayedFilters } from "@/components/widgets/shared/SyncDisplayedFilters";
import { ResourceHeaderTitle } from "@/components/widgets/components/ResourceHeaderTitle";
import { FilterButtonGroup } from "@/components/widgets/components/FilterButtonGroup";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { AnimatedContainer } from "@/components/widgets/components/AnimatedContainer";
import { PopoverSelect } from "@/components/widgets/components/Selects/PopoverSelect";

interface ITerminalsListFilter {
    onCreateDialogOpen: () => void;
}

export const TerminalsListFilter = ({ onCreateDialogOpen }: ITerminalsListFilter) => {
    const {
        providerName,
        onProviderChanged,
        terminalFilterName,
        onTerminalIdFieldChanged,
        onTerminalNameChanged,
        providersData,
        providersLoadingProcess,
        terminalsData,
        terminalsLoadingProcess,
        translate,
        onClearFilters
    } = useTerminalFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !providerName && !terminalFilterName;

    return (
        <>
            <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:flex-row md:items-end">
                <div className="md: flex min-w-36 flex-1 flex-col gap-1 sm:max-w-96 md:max-w-60"></div>

                <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col gap-1 sm:max-w-96 md:max-w-[400px]"></div>
            </div>

            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <SyncDisplayedFilters />

                <ResourceHeaderTitle />

                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[providerName, terminalFilterName]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />

                    <div className="flex justify-end">
                        <Button onClick={onCreateDialogOpen} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">{translate("resources.terminals.create")}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatedContainer open={openFiltersClicked}>
                <div className="mb-6">
                    <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:flex-row md:items-end">
                        <div className="md: flex min-w-36 flex-1 flex-col gap-1 sm:max-w-96 md:max-w-60">
                            <Label className="mb-0" variant="title-2">
                                {translate("resources.terminals.selectHeader")}
                            </Label>

                            <ProviderSelect
                                style="Black"
                                providers={providersData || []}
                                value={providerName}
                                onChange={onProviderChanged}
                                disabled={providersLoadingProcess}
                            />
                        </div>

                        <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col gap-1 sm:max-w-96 md:max-w-[400px]">
                            <Label variant="title-2" className="mb-0 md:text-nowrap">
                                {translate("resources.terminals.filter.filterByName")}
                            </Label>

                            <PopoverSelect
                                style="Black"
                                variants={terminalsData || []}
                                variantKey="verbose_name"
                                value={terminalFilterName}
                                onChange={onTerminalNameChanged}
                                idField="terminal_id"
                                setIdValue={onTerminalIdFieldChanged}
                                disabled={terminalsLoadingProcess || !providerName}
                                commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                notFoundMessage={translate("resources.terminals.notFoundMessage")}
                            />
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </>
    );
};
