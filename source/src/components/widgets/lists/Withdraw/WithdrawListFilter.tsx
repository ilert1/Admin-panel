import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/Input/input";
import useWithdrawFilter from "@/hooks/useWithdrawFilter";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { useState } from "react";
import { motion } from "framer-motion";

export const WithdrawListFilter = () => {
    const {
        dictionaries,
        operationId,
        startDate,
        endDate,
        typeTabActive,
        translate,
        onOperationIdChanged,
        changeDate,
        handleDownloadReport,
        clearFilters,
        chooseClassTabActive,
        onTabChanged
    } = useWithdrawFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !operationId && !startDate && !typeTabActive;

    return (
        <>
            <div className="">
                <div className="flex flex-col gap-2">
                    <FilterButtonGroup
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                        filterList={[operationId, startDate, typeTabActive]}
                        onClearFilters={clearFilters}
                    />
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0, maxHeight: 0, display: "none" }}
                        animate={{
                            opacity: openFiltersClicked ? 1 : 0,
                            height: openFiltersClicked ? "auto" : "",
                            display: openFiltersClicked ? "" : "none",
                            maxHeight: openFiltersClicked ? "100%" : 0,
                            pointerEvents: openFiltersClicked ? "auto" : "none"
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full mb-6 flex flex-col justify-start sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
                        <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start md:max-w-96">
                            <Input
                                className="flex-1 text-sm placeholder:text-neutral-70"
                                placeholder={translate("resources.withdraw.filter.filterByIdPlaceholder")}
                                value={operationId}
                                label={translate("resources.withdraw.filter.filterById")}
                                labelSize="title-2"
                                onChange={onOperationIdChanged}
                            />
                        </div>

                        <DateRangePicker
                            title={translate("resources.withdraw.filter.filterByDate")}
                            placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                            dateRange={{ from: startDate, to: endDate }}
                            onChange={changeDate}
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={!startDate} className="md:ml-auto" variant="default" size="sm">
                                    {translate("resources.withdraw.download.downloadReportButtonText")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-0 border-green-50" align="end">
                                <DropdownMenuItem
                                    className="px-4 py-1.5 text-sm text-neutral-80 dark:text-neutral-80 focus:bg-green-50 focus:text-white focus:dark:text-white rounded-none cursor-pointer"
                                    onClick={() => handleDownloadReport("csv")}>
                                    CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="px-4 py-1.5 text-sm text-neutral-80 dark:text-neutral-80 focus:bg-green-50 focus:text-white focus:dark:text-white rounded-none cursor-pointer"
                                    onClick={() => handleDownloadReport("pdf")}>
                                    PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </div>

                <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3 flex-wrap text-neutral-60 dark:text-neutral-30">
                            <button
                                className={chooseClassTabActive(0)}
                                onClick={() => onTabChanged(0)}
                                disabled={typeTabActive === 0}>
                                {translate("resources.transactions.types.all")}
                            </button>

                            {dictionaries?.transactionTypes &&
                                Object.keys(dictionaries?.transactionTypes).map(item => {
                                    if (
                                        dictionaries?.transactionTypes?.[item].type === 3 ||
                                        dictionaries?.transactionTypes?.[item].type === 4
                                    ) {
                                        return (
                                            <button
                                                key={dictionaries?.transactionTypes?.[item].type}
                                                className={chooseClassTabActive(
                                                    dictionaries?.transactionTypes?.[item].type
                                                )}
                                                disabled={typeTabActive === dictionaries?.transactionTypes?.[item].type}
                                                onClick={() =>
                                                    onTabChanged(dictionaries?.transactionTypes?.[item].type)
                                                }>
                                                {translate(
                                                    `resources.transactions.types.${dictionaries?.transactionTypes?.[
                                                        item
                                                    ].type_descr.toLowerCase()}`
                                                )}
                                            </button>
                                        );
                                    }
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
