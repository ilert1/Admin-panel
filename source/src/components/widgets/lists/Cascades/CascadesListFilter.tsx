import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import useCascadesListFilter from "./useCascadesListFilter";

export const CascadesListFilter = ({ handleCreateClicked }: { handleCreateClicked: () => void }) => {
    const { translate, type, currency, onClearFilters, onTypeChanged, onCurrencyChanged } = useCascadesListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !type && !currency;

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <FilterButtonGroup
                            filterList={[type, currency]}
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
                            <Input
                                label={translate("resources.cascadeSettings.cascades.fields.type")}
                                labelSize="title-2"
                                value={type}
                                onChange={onTypeChanged}
                                className="min-w-40"
                                placeholder={translate("resources.cascadeSettings.cascades.placeholders.type")}
                            />

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
                    </div>
                </div>
            </AnimatedContainer>
        </>
    );
};
