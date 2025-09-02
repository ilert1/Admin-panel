import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import useCascadeTerminalsListFilter from "./useCascadeTerminalsListFilter";
import { Label } from "@/components/ui/label";
import { PopoverSelect } from "../../components/Selects/PopoverSelect";
import { ProviderSelect } from "../../components/Selects/ProviderSelect";

export const CascadeTerminalsListFilter = ({ handleCreateClicked }: { handleCreateClicked: () => void }) => {
    const {
        translate,
        onClearFilters,
        cascadesData,
        isCascadesLoading,
        providersData,
        providersLoadingProcess,
        terminalsData,
        terminalsLoadingProcess,
        cascadeName,
        setCascadeName,
        onCascadeIdChanged,
        providerName,
        onProviderChanged,
        terminalName,
        setTerminalName,
        onTerminalIdChanged
    } = useCascadeTerminalsListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !providerName && !terminalName && !cascadeName;

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <FilterButtonGroup
                            filterList={[providerName, terminalName, cascadeName]}
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
                                {translate("resources.cascadeSettings.cascadeTerminals.createNew")}
                            </span>
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
                                disabled={providersLoadingProcess || !!cascadeName}
                                isLoading={providersLoadingProcess}
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
                                value={terminalName}
                                onChange={setTerminalName}
                                idField="terminal_id"
                                setIdValue={onTerminalIdChanged}
                                disabled={terminalsLoadingProcess || !providerName || !!cascadeName}
                                placeholder={translate("resources.terminals.selectPlaceholder")}
                                commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                notFoundMessage={translate("resources.terminals.notFoundMessage")}
                                isLoading={terminalsLoadingProcess}
                            />
                        </div>

                        <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col gap-1 sm:max-w-96 md:max-w-[400px]">
                            <Label className="mb-0" variant="title-2">
                                {translate("resources.cascadeSettings.cascades.cascade")}
                            </Label>

                            <PopoverSelect
                                style="Black"
                                variants={cascadesData || []}
                                value={cascadeName}
                                idField="id"
                                setIdValue={onCascadeIdChanged}
                                onChange={setCascadeName}
                                variantKey="name"
                                placeholder={translate("resources.cascadeSettings.cascades.selectPlaceholder")}
                                commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                notFoundMessage={translate("resources.cascadeSettings.cascades.notFoundMessage")}
                                disabled={isCascadesLoading || !!terminalName || !!providerName}
                                isLoading={isCascadesLoading}
                            />
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
        </>
    );
};
