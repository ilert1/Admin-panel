import { Button } from "@/components/ui/Button";
import { debounce } from "lodash";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import { Label } from "@/components/ui/label";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CreateMerchantDialogNewFlow } from "./CreateMerchantDialogNewFlow";

export const MerchantListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const translate = useTranslate();

    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");
    const [createDialogNewFlowOpen, setCreateDialogNewFlowOpen] = useState(false);

    const onPropertySelected = debounce((value: string, type: "id") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value, sort: "name", asc: "ASC" }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "id");
    };

    const clearFilters = () => {
        setMerchantId("");
        setFilters({}, displayedFilters, true);
        setPage(1);
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
                            onClick={() => setCreateDialogNewFlowOpen(true)}
                            variant="default"
                            className="flex flex-1 items-center gap-1 sm:flex-none">
                            <PlusCircle className="h-[16px] w-[16px]" />
                            <span className="text-title-1">{translate("resources.merchant.createNew")}</span>
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
                            onMerchantChanged={onMerchantChanged}
                            resource="merchant"
                        />
                    </div>
                </AnimatedContainer>
            </div>

            <CreateMerchantDialogNewFlow open={createDialogNewFlowOpen} onOpenChange={setCreateDialogNewFlowOpen} />
        </>
    );
};
