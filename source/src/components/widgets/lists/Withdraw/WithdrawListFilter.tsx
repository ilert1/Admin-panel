import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/Input/input";
import useWithdrawFilter from "@/hooks/useWithdrawFilter";

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

    return (
        <>
            <div className="">
                <div className="w-full mb-6 flex flex-col justify-start sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
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

                    <Button
                        className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                        onClick={clearFilters}
                        variant="text_btn_sec"
                        size="default"
                        disabled={!operationId && !startDate && !typeTabActive}>
                        <span>{translate("resources.withdraw.filter.clearFilters")}</span>
                        <XIcon className="size-4" />
                    </Button>

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
