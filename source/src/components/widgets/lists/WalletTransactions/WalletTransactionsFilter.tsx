import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { debounce } from "lodash";
import moment from "moment";
import { ChangeEvent, useCallback, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const WalletTransactionsFilter = () => {
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

    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

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
                setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
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
        if (date && date.from && date.to) {
            const changedDate = date.from !== dateCreate ? date.from : date.to;
            setDateCreate(changedDate);
            onPropertySelected(formattedDate(changedDate), "created_at");
        } else {
            setDateCreate(undefined);
            onPropertySelected("", "created_at");
        }
    };

    const changeDateUpdate = (date: DateRange | undefined) => {
        if (date && date.from && date.to) {
            const changedDate = date.from !== dateUpdate ? date.from : date.to;
            setDateUpdate(changedDate);
            onPropertySelected(formattedDate(changedDate), "updated_at");
        } else {
            setDateUpdate(undefined);
            onPropertySelected("", "updated_at");
        }
    };

    const clearFilters = () => {
        setDateCreate(undefined);
        setDateUpdate(undefined);
        setTransactionId("");
        setStateFilter("");
        setTypeTabActive("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !transactionId && !stateFilter && !dateCreate && !dateUpdate && !typeTabActive;

    if (!data) return <Loading />;

    return (
        <div className="">
            <div className="flex flex-col">
                <div className="mb-6 flex flex-wrap justify-between gap-2">
                    <ResourceHeaderTitle />

                    <FilterButtonGroup
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        filterList={[transactionId, stateFilter, dateCreate, dateUpdate, typeTabActive]}
                        clearButtonDisabled={clearDisabled}
                        onClearFilters={clearFilters}
                    />
                </div>
                <AnimatedContainer open={openFiltersClicked}>
                    <div className="mb-6 flex w-full flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:items-end">
                        <div className="flex flex-1 items-center gap-2 md:flex-col md:items-start">
                            <Input
                                label={translate("resources.wallet.transactions.filterBar.searchById")}
                                labelSize="title-2"
                                placeholder="ID"
                                value={transactionId}
                                onChange={onTransactionIdChanged}
                            />
                        </div>

                        <div className="flex min-w-36 flex-1 items-center gap-1 md:flex-col md:items-start">
                            <Label className="mb-0" variant="title-2">
                                {translate("resources.wallet.transactions.filterBar.paymentStatus")}
                            </Label>

                            <Select
                                onValueChange={val =>
                                    val !== "null" ? onOrderStatusChanged(val) : onOrderStatusChanged("")
                                }
                                value={stateFilter}>
                                <SelectTrigger className="h-[38px] text-ellipsis">
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
                            title={translate("resources.wallet.transactions.filterBar.created_at")}
                            placeholder={translate("resources.wallet.transactions.filterBar.datePlaceholder")}
                            dateRange={{ from: dateCreate, to: dateCreate }}
                            onChange={changeDateCreate}
                        />

                        <DateRangePicker
                            title={translate("resources.wallet.transactions.filterBar.updated_at")}
                            placeholder={translate("resources.wallet.transactions.filterBar.datePlaceholder")}
                            dateRange={{ from: dateUpdate, to: dateUpdate }}
                            onChange={changeDateUpdate}
                        />
                    </div>
                </AnimatedContainer>
            </div>

            {/* <div className="flex flex-wrap items-center justify-between gap-3">
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
            </div> */}
        </div>
    );
};
