import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { format } from "date-fns";
import { debounce } from "lodash";
import { XIcon } from "lucide-react";
import { ChangeEvent, useCallback, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";

export const FilterBar = () => {
    const data = fetchDictionaries();
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [dateCreate, setDateCreate] = useState<Date | undefined>(
        filterValues?.created_at ? new Date(filterValues?.created_at) : undefined
    );
    const [dateUpdate, setDateUpdate] = useState<Date | undefined>(
        filterValues?.updated_at ? new Date(filterValues?.updated_at) : undefined
    );
    const [transactionId, setTransactionId] = useState(filterValues?.blowfish_id || "");
    const [stateFilter, setStateFilter] = useState(filterValues?.state || "");
    const [typeTabActive, setTypeTabActive] = useState("");

    const formattedDate = (date: Date) => format(date, "yyyy-MM-dd");

    const chooseClassTabActive = useCallback(
        (type: string) => {
            return typeTabActive === type
                ? "text-green-50 dark:text-green-40 border-b-2 dark:border-green-40 border-green-50 pb-1 duration-200"
                : "pb-1 border-b-2 border-transparent duration-200 hover:text-green-40";
        },
        [typeTabActive]
    );

    const onPropertySelected = debounce(
        (value: string, type: "blowfish_id" | "state" | "created_at" | "updated_at") => {
            if (value) {
                setFilters({ ...filterValues, [type]: value }, displayedFilters);
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters);
            }
            setPage(1);
        },
        300
    );

    const onTabChanged = (value: "" | "deleted") => {
        setTypeTabActive(value);
    };

    const onOrderStatusChanged = (state: string) => {
        setStateFilter(state);
        onPropertySelected(state, "state");
    };

    const onTransactionIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setTransactionId(e.target.value);
        onPropertySelected(e.target.value, "blowfish_id");
    };

    const changeDateCreate = (date: DateRange | undefined) => {
        if (date && date.from) {
            setDateCreate(date.from);
            onPropertySelected(formattedDate(date.from), "created_at");
        } else {
            setDateCreate(undefined);
        }
    };

    const changeDateUpdate = (date: DateRange | undefined) => {
        if (date && date.from) {
            setDateUpdate(date.from);
            onPropertySelected(formattedDate(date.from), "updated_at");
        } else {
            setDateUpdate(undefined);
        }
    };

    const clearFilters = () => {
        setDateCreate(undefined);
        setDateUpdate(undefined);
        setTransactionId("");
        setStateFilter("");
        setTypeTabActive("");
    };

    if (!data) return <Loading />;

    return (
        <div className="mb-6">
            <div className="w-full mb-6 flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
                <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start">
                    <span className="md:text-nowrap">
                        {translate("resources.wallet.transactions.filterBar.searchById")}
                    </span>
                    <Input placeholder="ID" value={transactionId} onChange={onTransactionIdChanged} />
                </label>

                <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-36">
                    <span className="md:text-nowrap">
                        {translate("resources.wallet.transactions.filterBar.paymentStatus")}
                    </span>

                    <Select
                        onValueChange={val => (val !== "null" ? onOrderStatusChanged(val) : onOrderStatusChanged(""))}
                        value={stateFilter}>
                        <SelectTrigger className="text-ellipsis">
                            <SelectValue
                                placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                            />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="null">{translate("resources.transactions.filter.showAll")}</SelectItem>

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
                    title={translate("resources.wallet.transactions.filterBar.created_at")}
                    placeholder={translate("resources.wallet.transactions.filterBar.datePlaceholder")}
                    dateRange={{ from: dateCreate, to: dateCreate }}
                    onChange={changeDateCreate}
                />

                <DateRangePicker
                    title={translate("resources.wallet.transactions.filterBar.updated_at")}
                    placeholder={translate("resources.wallet.transactions.filterBar.datePlaceholder")}
                    dateRange={{ from: dateUpdate, to: dateCreate }}
                    onChange={changeDateUpdate}
                />

                <Button
                    className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                    onClick={clearFilters}
                    variant="clearBtn"
                    size="default"
                    disabled={!transactionId && !stateFilter && !dateCreate && !dateUpdate && !typeTabActive}>
                    <span>{translate("resources.transactions.filter.clearFilters")}</span>
                    <XIcon className="size-4" />
                </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        className={chooseClassTabActive("")}
                        onClick={() => onTabChanged("")}
                        disabled={typeTabActive === ""}>
                        {translate("resources.wallet.transactions.allTransactions")}
                    </button>

                    <button
                        className={chooseClassTabActive("deleted")}
                        disabled={typeTabActive === "deleted"}
                        onClick={() => onTabChanged("deleted")}>
                        {translate("resources.wallet.transactions.deletedTransactions")}
                    </button>
                </div>
            </div>
        </div>
    );
};
