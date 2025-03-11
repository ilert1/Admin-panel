import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, SlidersHorizontal, XIcon } from "lucide-react";
import { useTranslate } from "react-admin";

interface FilterButtonProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    filterList: any[];
    onClearFilters: () => void;
    clearButtonDisabled: boolean;
    className?: string;
}

export const FilterButtonGroup = (props: FilterButtonProps) => {
    const { open, onOpenChange, filterList, onClearFilters, clearButtonDisabled, className } = props;
    const translate = useTranslate();

    const filtersCount = () => {
        const activeFiltersCount = filterList.filter(Boolean).length;
        return activeFiltersCount;
    };

    const fc = filtersCount();

    return (
        <div className={cn("flex justify-end gap-6 relative", className)}>
            <Button
                variant={"outline"}
                className={cn(
                    "text-neutral-80 dark:text-neutral-0 border-green-40 dark:border-neutral-0 dark:hover:text-green-50 relative flex gap-1 rounded-4",
                    fc && "border-green-50 dark:border-green-50"
                )}
                onClick={() => onOpenChange(!open)}>
                <SlidersHorizontal className="" />
                <span>{translate("resources.transactions.filter.filters")}</span>

                {open ? <ChevronUp className="w-6 h-6 " /> : <ChevronDown className="w-6 h-6 " />}

                {fc ? (
                    <div
                        className="absolute w-4 h-4 bg-green-50 rounded-full flex items-center justify-center !text-neutral-0 text-note-2"
                        style={{
                            transform: "translateX(450%) translateY(-100%)"
                        }}>
                        {fc}
                    </div>
                ) : null}
            </Button>

            <Button
                className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                onClick={onClearFilters}
                variant="text_btn_sec"
                size="default"
                disabled={clearButtonDisabled}>
                <span>{translate("resources.transactions.filter.clearFilters")}</span>
                <XIcon className="size-4" />
            </Button>
        </div>
    );
};
