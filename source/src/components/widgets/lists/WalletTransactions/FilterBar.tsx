import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";

export const FilterBar = () => {
    const data = fetchDictionaries();
    console.log(data);
    const translate = useTranslate();

    const [allOperationsClicked, setAllOperationsClicked] = useState(true);
    const [deletedOperationsClicked, setDeletedOperationsClicked] = useState(false);

    const [filterId, setFilterId] = useState("");

    const [startDateCreate, setStartDateCreate] = useState<Date>();
    const [endDateCreate, setEndDateCreate] = useState<Date>();

    const [startDateEdit, setStartDateEdit] = useState<Date>();
    const [endDateEdit, setEndDateEdit] = useState<Date>();

    const [status, setStatus] = useState("all");

    const changeDateCreate = (date: DateRange | undefined) => {
        if (date) {
            if (date.from && date.to) {
                setStartDateCreate(date.from);
                setEndDateCreate(date.to);
            }
        } else {
            setStartDateCreate(undefined);
            setEndDateCreate(undefined);
        }
    };

    const changeDateEdit = (date: DateRange | undefined) => {
        if (date) {
            if (date.from && date.to) {
                setStartDateEdit(date.from);
                setEndDateEdit(date.to);
            }
        } else {
            setStartDateEdit(undefined);
            setEndDateEdit(undefined);
        }
    };

    const clearFilters = () => {
        setStartDateCreate(undefined);
        setEndDateCreate(undefined);
        setStartDateEdit(undefined);
        setEndDateEdit(undefined);
        setFilterId("");
        setStatus("all");
    };

    if (!data) return <Loading />;

    return (
        <>
            <div className="flex gap-[16px] mb-5 items-center">
                <div className="flex flex-col gap-[8px] ">
                    <Label className="text-title-2 text-neutral-100" htmlFor="private">
                        {translate("resources.manageTransactions.filterBar.searchById")}
                    </Label>
                    <Input placeholder="ID" value={filterId} onChange={e => setFilterId(e.target.value)} />
                </div>
                <div className="flex flex-col gap-[8px]">
                    <Label className="text-title-2 text-neutral-100" htmlFor="private">
                        {translate("resources.manageTransactions.filterBar.paymentStatus")}
                    </Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[204px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {Object.entries(data.states).map(el => {
                                console.log(el);
                                return (
                                    <SelectItem key={el[0]} value={el[0]}>
                                        {el[1].state_description}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col">
                    <Label className="text-title-2 text-neutral-100" htmlFor="private">
                        {translate("resources.manageTransactions.filterBar.created_at")}
                    </Label>
                    <DateRangePicker
                        // title={translate("resources.withdraw.filter.filterByDate")}
                        title={""}
                        // placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                        dateRange={{ from: startDateCreate, to: endDateCreate }}
                        onChange={changeDateCreate}
                        placeholder={""}
                    />
                </div>
                <div className="flex flex-col">
                    <Label className="text-title-2 text-neutral-100" htmlFor="private">
                        {translate("resources.manageTransactions.filterBar.updated_at")}
                    </Label>
                    <DateRangePicker
                        // title={translate("resources.withdraw.filter.filterByDate")}
                        title={""}
                        // placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                        dateRange={{ from: startDateEdit, to: endDateEdit }}
                        onChange={changeDateEdit}
                        placeholder={""}
                    />
                </div>
                <div className="flex items-center pb-1 gap-[4px] place-self-end">
                    <Label htmlFor="clear" className="text-title-1 text-neutral-50">
                        {translate("resources.manageTransactions.filterBar.resetFilters")}
                    </Label>
                    <button
                        id="clear"
                        onClick={() => clearFilters()}
                        className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                        <XIcon className="h-[28px] w-[28px]" />
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        className={
                            allOperationsClicked
                                ? "text-green-50 dark:text-green-40 border-b-2 dark:border-green-40 border-green-50 pb-1 duration-200"
                                : "pb-1 border-b-2 border-transparent duration-200 hover:text-green-40"
                        }
                        onClick={() => {
                            setDeletedOperationsClicked(false);
                            setAllOperationsClicked(true);
                        }}>
                        {translate("resources.manageTransactions.allTransactions")}
                    </button>
                    <button
                        className={
                            deletedOperationsClicked
                                ? "text-green-50 dark:text-green-40 border-b-2 dark:border-green-40 border-green-50 pb-1 duration-200"
                                : "pb-1 border-b-2 border-transparent duration-200 hover:text-green-40"
                        }
                        onClick={() => {
                            setAllOperationsClicked(false);
                            setDeletedOperationsClicked(true);
                        }}>
                        {translate("resources.manageTransactions.deletedTransactions")}
                    </button>
                </div>
            </div>
        </>
    );
};
