import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { LoadingAlertDialog } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useTransactionFilter from "@/hooks/useTransactionFilter";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface TranactionListFilterProps {
    typeTabActive: string;
    setTypeTabActive: (type: string) => void;
    // chartOpen: boolean;
    // setChartOpen: (state: boolean) => void;
}

export const TransactionListFilter = ({ typeTabActive, setTypeTabActive }: TranactionListFilterProps) => {
    const {
        translate,
        data,
        adminOnly,
        accountsData,
        accountScrollHandler,
        accountsLoadingProcess,
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
        clearFilters
    } = useTransactionFilter(typeTabActive, setTypeTabActive);
    // const debounced = debounce(setChartOpen, 200);

    // text-neutral-60 dark:text-black
    // text-neutral-70
    return (
        <div className="mb-6">
            <div className="w-full mb-6">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
                    <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start">
                        <span className="md:text-nowrap text-neutral-60 dark:text-neutral-30">
                            {translate("resources.transactions.filter.filterById")}
                        </span>
                        <Input
                            className="flex-1 text-sm placeholder:text-neutral-70"
                            placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                            value={operationId}
                            onChange={onOperationIdChanged}
                        />
                    </label>

                    <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start">
                        <span className="md:text-nowrap text-neutral-60 dark:text-neutral-30">
                            {translate("resources.transactions.filter.filterCustomerPaymentId")}
                        </span>
                        <Input
                            className="flex-1 text-sm placeholder:text-neutral-70"
                            placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                            value={customerPaymentId}
                            onChange={onCustomerPaymentIdChanged}
                        />
                    </label>

                    <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-36">
                        <span className="md:text-nowrap text-neutral-60 dark:text-neutral-30">
                            {translate("resources.transactions.filter.filterByOrderStatus")}
                        </span>

                        <Select
                            onValueChange={val =>
                                val !== "null" ? onOrderStatusChanged(val) : onOrderStatusChanged("")
                            }
                            value={orderStatusFilter}>
                            <SelectTrigger className="text-ellipsis">
                                <SelectValue
                                    placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="null">
                                    {translate("resources.transactions.filter.showAll")}
                                </SelectItem>

                                {data &&
                                    Object.keys(data.states).map(index => (
                                        <SelectItem
                                            key={data.states[index].state_int}
                                            value={data.states[index].state_int.toString()}>
                                            {translate(
                                                `resources.transactions.states.${data?.states?.[
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
                        <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-40">
                            <span className="md:text-nowrap text-neutral-60 dark:text-neutral-30">
                                {translate("resources.transactions.filter.filterByAccount")}
                            </span>

                            <Select
                                onValueChange={val => (val !== "null" ? onAccountChanged(val) : onAccountChanged(""))}
                                value={account}>
                                <SelectTrigger className="text-ellipsis">
                                    <SelectValue
                                        placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                    />
                                </SelectTrigger>

                                <SelectContent
                                    align="start"
                                    onScrollCapture={accountScrollHandler}
                                    onScroll={accountScrollHandler}>
                                    <SelectItem value="null">
                                        {translate("resources.transactions.filter.showAll")}
                                    </SelectItem>

                                    {accountsData?.pages.map(page => {
                                        return page.data.map(account => (
                                            <SelectItem key={account.id} value={account.id}>
                                                <p className="truncate max-w-36">
                                                    {account.meta?.caption ? account.meta.caption : account.owner_id}
                                                </p>
                                            </SelectItem>
                                        ));
                                    })}

                                    {accountsLoadingProcess && (
                                        <SelectItem value="null" disabled className="flex max-h-8">
                                            <LoadingAlertDialog className="-scale-[.25]" />
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Button
                        className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7 text-neutral-70 dark:text-neutral-50 active:text-green-50 hover:text-green-60"
                        onClick={clearFilters}
                        variant="clearBtn"
                        size="default"
                        disabled={
                            !operationId &&
                            !account &&
                            !customerPaymentId &&
                            !startDate &&
                            !typeTabActive &&
                            !orderStatusFilter
                        }>
                        <span>{translate("resources.transactions.filter.clearFilters")}</span>
                        <XIcon className="size-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={
                                    !startDate ||
                                    (adminOnly && !account) ||
                                    (orderStatusFilter && !orderStatusFilter.final)
                                }
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
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className={chooseClassTabActive("")} onClick={clearFilters} disabled={typeTabActive === ""}>
                        {translate("resources.transactions.types.all")}
                    </button>

                    {data?.transactionTypes &&
                        Object.keys(data?.transactionTypes).map(item => {
                            if (
                                data?.transactionTypes?.[item].type === 1 ||
                                data?.transactionTypes?.[item].type === 2
                            ) {
                                return (
                                    <button
                                        key={data?.transactionTypes?.[item].type}
                                        className={chooseClassTabActive(data?.transactionTypes?.[item].type_descr)}
                                        disabled={typeTabActive === data?.transactionTypes?.[item].type_descr}
                                        onClick={() => onTabChanged(data?.transactionTypes?.[item])}>
                                        {translate(
                                            `resources.transactions.types.${data?.transactionTypes?.[
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
        </div>
    );
};
