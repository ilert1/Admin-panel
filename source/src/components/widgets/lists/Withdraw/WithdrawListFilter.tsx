import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import useWithdrawFilter from "@/hooks/useWithdrawFilter";

export const WithdrawListFilter = () => {
    const {
        operationId,
        startDate,
        endDate,
        typeTabActive,
        translate,
        onOperationIdChanged,
        changeDate,
        handleDownloadReport,
        clearFilters,
        clearTypeFilters,
        chooseClassTabActive,
        onTabChanged
    } = useWithdrawFilter();

    return (
        <>
            <div className="">
                <div className="w-full mb-6 flex flex-col justify-start sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
                    <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start md:max-w-96">
                        <span className="md:text-nowrap text-neutral-60 dark:text-white">
                            {translate("resources.withdraw.filter.filterById")}
                        </span>
                        <Input
                            className="flex-1 text-sm placeholder:text-neutral-70"
                            placeholder={translate("resources.withdraw.filter.filterByIdPlaceholder")}
                            value={operationId}
                            onChange={onOperationIdChanged}
                        />
                    </label>

                    <DateRangePicker
                        title={translate("resources.withdraw.filter.filterByDate")}
                        placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                        dateRange={{ from: startDate, to: endDate }}
                        onChange={changeDate}
                    />

                    <Button
                        className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7 text-neutral-70 dark:text-neutral-50 active:text-green-50 hover:text-green-60"
                        onClick={clearFilters}
                        variant="clearBtn"
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
                                className={chooseClassTabActive("")}
                                onClick={clearTypeFilters}
                                disabled={typeTabActive === ""}>
                                {translate("resources.transactions.types.all")}
                            </button>
                            <button
                                key={3}
                                className={chooseClassTabActive("Transfer")}
                                disabled={typeTabActive === "Transfer"}
                                onClick={() =>
                                    onTabChanged({
                                        type: 3,
                                        type_descr: "Transfer"
                                    })
                                }>
                                {translate(`resources.transactions.types.transfer`)}
                            </button>
                            <button
                                key={4}
                                className={chooseClassTabActive("Reward")}
                                disabled={typeTabActive === "Reward"}
                                onClick={() =>
                                    onTabChanged({
                                        type: 4,
                                        type_descr: "Reward"
                                    })
                                }>
                                {translate(`resources.transactions.types.reward`)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
