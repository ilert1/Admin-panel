import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, SlidersHorizontal, XIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface FilterButtonProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    filterList: unknown[];
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

    useEffect(() => {
        localStorage.getItem("filterOpened")?.toString() === "true" && onOpenChange(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        open ? localStorage.setItem("filterOpened", "true") : localStorage.setItem("filterOpened", "false");
    }, [open]);

    const fc = filtersCount();

    return (
        <div className={cn("relative flex flex-col justify-end gap-2 sm:flex-row sm:gap-0", className)}>
            <Button
                variant={"outline"}
                className={cn(
                    "relative flex gap-1 rounded-4 border-green-40 text-neutral-80 dark:border-neutral-0 dark:text-neutral-0 dark:hover:text-green-50",
                    fc && "border-green-50 dark:border-green-50",
                    open && "!border-green-50 !text-green-50"
                )}
                onClick={() => onOpenChange(!open)}>
                <SlidersHorizontal className="" />
                <span>{translate("resources.transactions.filter.filters")}</span>

                {open ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}

                {fc ? (
                    <div
                        className="absolute flex h-4 w-4 items-center justify-center rounded-full bg-green-50 text-note-2 !text-neutral-0"
                        style={{
                            transform: "translateX(450%) translateY(-100%)"
                        }}>
                        {fc}
                    </div>
                ) : null}
            </Button>

            <AnimatePresence>
                {!clearButtonDisabled && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        <Button
                            className="ml-0 flex items-center gap-1 px-0 sm:ml-6"
                            onClick={onClearFilters}
                            variant="text_btn_sec"
                            size="default">
                            <span>{translate("resources.transactions.filter.clearFilters")}</span>
                            <XIcon className="size-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
