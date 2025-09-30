import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { RefreshCw } from "lucide-react";
import { useLoading, useRefresh } from "react-admin";
import clsx from "clsx";
import { MerchantSelect } from "../../components/Selects/MerchantSelect";
import useTransactionFilter from "./useTransactionFilter";
import { ProviderSelect } from "../../components/Selects/ProviderSelect";

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
        orderIngressStatusFilter,
        onOrderIngressStatusChanged,
        merchantData,
        merchantsLoadingProcess,
        merchantId,
        onMerchantChanged,
        merchantValue,
        setMerchantValue,
        startDate,
        endDate,
        changeDate,
        typeTabActive,
        onTabChanged,
        chooseClassTabActive,
        handleDownloadReport,
        clearFilters,
        providerNameFilter,
        onProviderNameChanged,
        providersData,
        providersLoadingProcess
    } = useTransactionFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);

    const refresh = useRefresh();
    const loading = useLoading();

    const clearDisabled =
        !operationId &&
        !merchantId &&
        !customerPaymentId &&
        !startDate &&
        !typeTabActive &&
        !providerNameFilter &&
        (adminOnly ? !orderStatusFilter && !orderIngressStatusFilter : !orderIngressStatusFilter);

    return (
        <>
            <div className="flex w-full flex-col">
                <div className="mb-4 flex flex-wrap justify-between gap-4 md:mb-6">
                    <ResourceHeaderTitle />

                    <FilterButtonGroup
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        filterList={[
                            operationId,
                            merchantId,
                            customerPaymentId,
                            startDate,
                            typeTabActive,
                            providerNameFilter,
                            orderIngressStatusFilter,
                            ...(adminOnly ? [orderStatusFilter] : [])
                        ]}
                        clearButtonDisabled={clearDisabled}
                        onClearFilters={clearFilters}
                    />
                </div>
                <AnimatedContainer open={openFiltersClicked}>
                    <div className="mb-4 flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                        <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                            <Input
                                className="flex-1"
                                label={translate("resources.transactions.filter.filterById")}
                                labelSize="title-2"
                                placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                                value={operationId}
                                onChange={onOperationIdChanged}
                            />
                        </div>

                        <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                            <Input
                                className="flex-1"
                                placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                                value={customerPaymentId}
                                onChange={onCustomerPaymentIdChanged}
                                label={translate("resources.transactions.filter.filterCustomerPaymentId")}
                                labelSize="title-2"
                            />
                        </div>
                        {adminOnly && (
                            <div className="flex min-w-36 flex-1 flex-col items-start md:min-w-56">
                                <Label variant="title-2" className="">
                                    {translate("resources.transactions.filter.filterByProvider")}
                                </Label>
                                <ProviderSelect
                                    providers={providersData ?? []}
                                    placeholder={translate(
                                        "resources.transactions.filter.filterByProviderNamePlaceholder"
                                    )}
                                    value={providerNameFilter}
                                    onChange={onProviderNameChanged}
                                    isLoading={providersLoadingProcess}
                                    modal={false}
                                    style="Black"
                                    customSearch={true}
                                    customSearchHandler={onProviderNameChanged}
                                />
                            </div>
                        )}
                        {adminOnly && (
                            <div className="flex min-w-48 flex-1 flex-col gap-1">
                                <Label variant="title-2" className="mb-0">
                                    {translate("resources.transactions.filter.filterByOrderStatus")}
                                </Label>

                                <Select
                                    onValueChange={val => {
                                        return val !== "null" ? onOrderStatusChanged(val) : onOrderStatusChanged("");
                                    }}
                                    value={orderStatusFilter}>
                                    <SelectTrigger className="h-[38px] text-ellipsis">
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.transactions.filter.filterAllPlaceholder"
                                            )}
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="null">
                                            {translate("resources.transactions.filter.showAll")}
                                        </SelectItem>

                                        {dictionaries &&
                                            dictionaries.states &&
                                            Object.keys(dictionaries.states).map(index => (
                                                <SelectItem
                                                    key={dictionaries.states[index]?.state_int}
                                                    value={dictionaries.states[index]?.state_int?.toString() || ""}>
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
                        )}

                        <div className="flex min-w-48 flex-1 flex-col gap-1">
                            <Label variant="title-2" className="mb-0">
                                {adminOnly
                                    ? translate("resources.transactions.filter.filterByIngressOrderStatus")
                                    : translate("resources.transactions.filter.filterByOrderStatus")}
                            </Label>

                            <Select
                                onValueChange={val => {
                                    return val !== "null"
                                        ? onOrderIngressStatusChanged(val)
                                        : onOrderIngressStatusChanged("");
                                }}
                                value={orderIngressStatusFilter}>
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
                                        dictionaries.ingressStates &&
                                        Object.keys(dictionaries.ingressStates).map(index => (
                                            <SelectItem key={index} value={index?.toString() || ""}>
                                                {translate(
                                                    `resources.transactions.merchantStates.${index?.toString()}`
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
                            <div className="flex-grow-100 flex max-w-80 flex-1 flex-col gap-1 md:basis-[350px] md:gap-1">
                                <Label className="mb-0 md:text-nowrap" variant="title-2">
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
                                    {translate("resources.transactions.download.downloadReportButtonText")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="border-green-50 p-0" align="end">
                                <DropdownMenuItem
                                    className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-white focus:dark:text-white"
                                    onClick={() => handleDownloadReport("csv")}>
                                    CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-white focus:dark:text-white"
                                    onClick={() => handleDownloadReport("pdf")}>
                                    PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </AnimatedContainer>
            </div>

            <div className="flex flex-col flex-wrap items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                <div className="mt-2 flex flex-wrap items-center gap-3">
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

                <Button
                    onClick={refresh}
                    disabled={loading}
                    className="-order-1 flex flex-1 items-center justify-center gap-1 font-normal sm:order-1 sm:flex-none">
                    <RefreshCw className={clsx(loading && "animate-spin")} width={16} height={16} />
                    <span>{translate("app.ui.actions.refresh")}</span>
                </Button>
            </div>
        </>
    );
};
