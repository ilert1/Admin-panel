import { Button } from "@/components/ui/Button";
import { debounce } from "lodash";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import { Label } from "@/components/ui/label";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { CreateDirectionDialog } from "./CreateDirectionDialog";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const DirectionListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const translate = useTranslate();

    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const onPropertySelected = debounce((value: string, type: "merchant") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value, order_by: "name", asc: true }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onAccountChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "merchant");
    };

    const clearFilters = () => {
        setMerchantId("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !merchantId;

    return (
        <>
            <div className="flex w-full flex-col">
                <div className="mb-4 flex flex-wrap justify-between gap-x-52 gap-y-3 sm:gap-3 md:mb-6">
                    <ResourceHeaderTitle />

                    <div className="flex flex-1 flex-row justify-end gap-2 sm:flex-none sm:gap-6">
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
                            filterList={[merchantId]}
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

                        <MerchantSelectFilter
                            merchant={merchantId}
                            onMerchantChanged={onAccountChanged}
                            resource="merchant"
                        />
                    </div>
                </AnimatedContainer>
            </div>
            <CreateDirectionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
