import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/Input/input";
import useTransactionFilter from "@/hooks/useTransactionFilter";
import { Button } from "@/components/ui/Button";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";

export const TransactionListFilter = () => {
    const {
        translate,
        dictionaries,
        adminOnly,
        operationId,
        onOperationIdChanged,
        customerPaymentId,
        onCustomerPaymentIdChanged,
        orderStatusFilter,
        onOrderStatusChanged,
        account,
        onAccountChanged,
        startDate,
        endDate,
        changeDate,
        onTabChanged,
        chooseClassTabActive,
        handleDownloadReport,
        clearFilters,
        typeTabActive
    } = useTransactionFilter();
    // const debounced = debounce(setChartOpen, 200);

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const clearDiasbled =
        !operationId && !account && !customerPaymentId && !startDate && !typeTabActive && !orderStatusFilter;

    return (
        <>
            <div className="w-full mb-6 flex flex-col gap-2">
                <FilterButtonGroup
                    open={openFiltersClicked}
                    onOpenChange={setOpenFiltersClicked}
                    filterList={[operationId, account, customerPaymentId, startDate, typeTabActive, orderStatusFilter]}
                    clearButtonDisabled={clearDiasbled}
                    onClearFilters={clearFilters}
                />
                <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: openFiltersClicked ? 1 : 0,
                        height: openFiltersClicked ? "auto" : 0,
                        pointerEvents: openFiltersClicked ? "auto" : "none"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
                    <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start">
                        <Input
                            className="flex-1"
                            label={translate("resources.transactions.filter.filterById")}
                            labelSize="title-2"
                            placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                            value={operationId}
                            onChange={onOperationIdChanged}
                        />
                    </div>
                    <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start">
                        <Input
                            className="flex-1"
                            placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                            value={customerPaymentId}
                            onChange={onCustomerPaymentIdChanged}
                            label={translate("resources.transactions.filter.filterCustomerPaymentId")}
                            labelSize="title-2"
                        />
                    </div>

                    <div className="flex flex-1 md:flex-col items-center gap-2 md:gap-1 md:items-start min-w-36">
                        <Label variant="title-2" className="mb-0">
                            {translate("resources.transactions.filter.filterByOrderStatus")}
                        </Label>

                        <Select
                            onValueChange={val =>
                                val !== "null" ? onOrderStatusChanged(val) : onOrderStatusChanged("")
                            }
                            value={orderStatusFilter}>
                            <SelectTrigger className="text-ellipsis h-[38px]">
                                <SelectValue
                                    placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="null">
                                    {translate("resources.transactions.filter.showAll")}
                                </SelectItem>

                                {dictionaries &&
                                    Object.keys(dictionaries.states).map(index => (
                                        <SelectItem
                                            key={dictionaries.states[index].state_int}
                                            value={dictionaries.states[index].state_int.toString()}>
                                            {translate(
                                                `resources.transactions.states.${dictionaries?.states?.[
                                                    index
                                                ]?.state_description?.toLowerCase()}`
                                            )}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DateRangePicker
                        title={translate("resources.transactions.download.dateTitle")}
                        placeholder={translate("resources.transactions.filter.filterByDate")}
                        dateRange={{ from: startDate, to: endDate }}
                        onChange={changeDate}
                    />

                    {adminOnly && (
                        <div className="flex flex-1 flex-grow-100 md:basis-[500px] md:flex-col gap-2 md:gap-1 items-center md:items-start">
                            <Label className="md:text-nowrap mb-0" variant="title-2">
                                {translate("resources.transactions.filter.filterByAccount")}
                            </Label>

                            <MerchantSelectFilter
                                merchant={account}
                                onMerchantChanged={onAccountChanged}
                                resource="accounts"
                            />
                        </div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={!startDate || (adminOnly && !account)}
                                className="md:ml-auto"
                                variant="default"
                                size="sm">
                                {translate("resources.transactions.download.downloadReportButtonText")}
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

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        className={chooseClassTabActive(0)}
                        onClick={() => onTabChanged(0)}
                        disabled={typeTabActive === 0}>
                        {translate("resources.transactions.types.all")}
                    </button>

                    {dictionaries?.transactionTypes &&
                        Object.keys(dictionaries?.transactionTypes).map(item => {
                            if (
                                dictionaries?.transactionTypes?.[item].type === 1 ||
                                dictionaries?.transactionTypes?.[item].type === 2
                            ) {
                                return (
                                    <button
                                        key={dictionaries?.transactionTypes?.[item].type}
                                        className={chooseClassTabActive(dictionaries?.transactionTypes?.[item].type)}
                                        disabled={typeTabActive === dictionaries?.transactionTypes?.[item].type}
                                        onClick={() => onTabChanged(dictionaries?.transactionTypes?.[item].type)}>
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

                {/* <div className="flex items-center gap-1">
                    <Button onClick={() => debounced(prev => !prev)} variant={"clearBtn"} className="flex gap-1">
                        {translate("resources.transactions.chart")}
                        <img
                            src="/Chart-Icon.svg"
                            alt=""
                            className={`${chartOpen ? "bg-green-50 rounded-[4px] transition-all duration-300" : ""}`}
                        />
                    </Button>
                </div> */}
            </div>
        </>
    );
};
