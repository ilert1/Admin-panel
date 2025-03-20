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
            setFilters({ ...filterValues, [type]: value, order_by: "name", asc: true }, displayedFilters);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters);
        }
        setPage(1);
    }, 300);

    const onAccountChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "merchant");
    };

    const clearFilters = () => {
        setMerchantId("");
        setFilters({}, displayedFilters);
        setPage(1);
    };

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !merchantId;

    return (
        <>
            <div className="w-full flex flex-col">
                <div className="flex gap-x-52 gap-y-3 sm:gap-3 flex-wrap justify-between mb-4 md:mb-6">
                    <ResourceHeaderTitle />

                    <div className="flex flex-row flex-1 sm:flex-none gap-2 sm:gap-6 justify-end">
                        <Button
                            onClick={handleCreateClick}
                            variant="default"
                            className="flex flex-1 sm:flex-none gap-[4px] items-center">
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
                    <div className="flex flex-1 flex-grow-100 min-w-[150px] max-w-[700px] flex-col gap-1 mb-4 md:mb-6">
                        <Label variant="title-2" className="md:text-nowrap mb-0">
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
