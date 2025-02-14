import { Button } from "@/components/ui/Button";
import { debounce } from "lodash";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import { Label } from "@/components/ui/label";

export const DirectionListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const translate = useTranslate();

    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");

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

    return (
        <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
            <div className="flex flex-1 flex-grow-100 min-w-[500px] md:flex-col gap-1 items-center md:items-start">
                <Label variant="title-2" className="md:text-nowrap mb-0">
                    {translate("resources.transactions.filter.filterByAccount")}
                </Label>

                <MerchantSelectFilter merchant={merchantId} onMerchantChanged={onAccountChanged} resource="merchant" />
            </div>

            <Button
                className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                onClick={clearFilters}
                variant="text_btn_sec"
                size="default"
                disabled={!merchantId}>
                <span>{translate("resources.transactions.filter.clearFilters")}</span>
                <XIcon className="size-4" />
            </Button>
        </div>
    );
};
