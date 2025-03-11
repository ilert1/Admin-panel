import { Button } from "@/components/ui/Button";
import { debounce } from "lodash";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import { Label } from "@/components/ui/label";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { motion } from "framer-motion";
import { CreateDirectionDialog } from "./CreateDirectionDialog";

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
            {/* TODO FIX THE HEIGHT BUG */}
            <div className="w-full flex flex-col gap-2">
                <div className="flex gap-6 justify-end">
                    <Button onClick={handleCreateClick} variant="default" className="flex gap-[4px] items-center">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        <span className="text-title-1">{translate("resources.direction.create")}</span>
                    </Button>
                    <FilterButtonGroup
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        filterList={[clearDisabled]}
                        clearButtonDisabled={clearDisabled}
                        onClearFilters={clearFilters}
                    />
                </div>

                <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: openFiltersClicked ? 1 : 0,
                        height: openFiltersClicked ? "auto" : 0,
                        pointerEvents: openFiltersClicked ? "auto" : "none"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-1 flex-grow-100 min-w-[500px] max-w-[700px] md:flex-col gap-1 items-center md:items-start">
                    <Label variant="title-2" className="md:text-nowrap mb-0">
                        {translate("resources.transactions.filter.filterByAccount")}
                    </Label>

                    <MerchantSelectFilter
                        merchant={merchantId}
                        onMerchantChanged={onAccountChanged}
                        resource="merchant"
                    />
                </motion.div>
            </div>
            <CreateDirectionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
