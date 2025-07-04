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
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MerchantSelect } from "../../components/Selects/MerchantSelect";

export const WithdrawListFilter = () => {
    const {
        dictionaries,
        operationId,
        operationTrc20,
        endDate,
        startDate,
        merchantData,
        merchantsLoadingProcess,
        merchantId,
        merchantValue,
        setMerchantValue,
        onMerchantChanged,
        statusFilter,
        typeTabActive,
        translate,
        onOperationIdChanged,
        onOperationTrc20Changed,
        changeDate,
        handleDownloadReport,
        clearFilters,
        chooseClassTabActive,
        onTabChanged,
        onStatusFilterChanged,
        adminOnly
    } = useWithdrawFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled =
        !operationId && !operationTrc20 && !startDate && !typeTabActive && !merchantId && !statusFilter;

    return (
        <div>
            <div className="flex flex-col">
                <div className="mb-6 flex flex-wrap justify-between gap-4">
                    <ResourceHeaderTitle />

                    <FilterButtonGroup
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                        filterList={[operationId, operationTrc20, startDate, merchantId, statusFilter, typeTabActive]}
                        onClearFilters={clearFilters}
                    />
                </div>
                <AnimatedContainer open={openFiltersClicked}>
                    <div className="mb-4 flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                        <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                            <Input
                                className="flex-1 text-sm placeholder:text-neutral-70"
                                placeholder={translate("resources.withdraw.filter.filterByIdPlaceholder")}
                                value={operationId}
                                label={translate("resources.withdraw.filter.filterById")}
                                labelSize="title-2"
                                onChange={onOperationIdChanged}
                            />
                        </div>

                        <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                            <Input
                                className="flex-1 text-sm placeholder:text-neutral-70"
                                placeholder={translate("resources.withdraw.filter.filterByIdPlaceholder")}
                                value={operationTrc20}
                                label={translate("resources.withdraw.filter.filterByTrc20")}
                                labelSize="title-2"
                                onChange={onOperationTrc20Changed}
                            />
                        </div>

                        <DateRangePicker
                            title={translate("resources.withdraw.filter.filterByDate")}
                            placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                            dateRange={{ from: startDate, to: endDate }}
                            onChange={changeDate}
                        />

                        <div className="flex min-w-36 flex-1 flex-col gap-1 lg:max-w-80">
                            <Label variant="title-2" className="mb-0">
                                {translate("resources.transactions.filter.filterByOrderStatus")}
                            </Label>

                            <Select
                                onValueChange={val =>
                                    val !== "null" ? onStatusFilterChanged(val) : onStatusFilterChanged("")
                                }
                                value={statusFilter}>
                                <SelectTrigger className="h-[38px] text-ellipsis">
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

                        {adminOnly && (
                            <div className="flex-grow-100 flex flex-1 flex-col gap-1 md:basis-[350px] md:gap-1">
                                <Label variant="title-2" className="mb-0 md:text-nowrap">
                                    {translate("resources.transactions.filter.filterByAccount")}
                                </Label>

                                <MerchantSelect
                                    merchants={merchantData || []}
                                    value={merchantValue}
                                    onChange={setMerchantValue}
                                    setIdValue={onMerchantChanged}
                                    disabled={merchantsLoadingProcess}
                                    isLoading={merchantsLoadingProcess}
                                    style="Black"
                                />
                            </div>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    disabled={!startDate}
                                    className="mt-1 sm:mt-0 md:ml-auto"
                                    variant="default"
                                    size="sm">
                                    {translate("resources.withdraw.download.downloadReportButtonText")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="border-green-50 p-0" align="end">
                                <DropdownMenuItem
                                    className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-neutral-80 focus:dark:text-white"
                                    onClick={() => handleDownloadReport("csv")}>
                                    CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-neutral-80 focus:dark:text-white"
                                    onClick={() => handleDownloadReport("pdf")}>
                                    PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </AnimatedContainer>
            </div>

            <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-neutral-60 dark:text-neutral-30">
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
                </div>
            </div>
        </div>
    );
};
