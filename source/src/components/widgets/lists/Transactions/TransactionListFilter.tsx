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
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { MerchantSelectFilter } from "../../shared/MerchantSelectFilter";
import { Label } from "@/components/ui/label";

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

    return (
        <div className="mb-6">
            <div className="w-full mb-6">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
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

                    <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-36">
                        <Label>{translate("resources.transactions.filter.filterByOrderStatus")}</Label>

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
                        <div className="flex flex-1 flex-grow-100 md:basis-[500px] md:flex-col gap-2 items-center md:items-start">
                            <Label className="md:text-nowrap">
                                {translate("resources.transactions.filter.filterByAccount")}
                            </Label>

                            <MerchantSelectFilter
                                merchant={account}
                                onMerchantChanged={onAccountChanged}
                                resource="accounts"
                            />
                        </div>
                    )}

                    <Button
                        className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                        onClick={clearFilters}
                        variant="text_btn_sec"
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
