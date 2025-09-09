import { debounce } from "lodash";
import { useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { DateRange } from "react-day-picker";
import moment from "moment";

const useCallbackListFilter = () => {
    const translate = useTranslate();
    const formattedDate = (date: Date) => moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [startDate, setStartDate] = useState<Date | undefined>(
        filterValues?.createdAfter ? new Date(filterValues?.createdAfter) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filterValues?.createdBefore ? new Date(filterValues?.createdBefore) : undefined
    );

    const onPropertySelected = debounce(
        (value: string | { from: string; to: string } | number, type: "date" | "sortOrder") => {
            if (value) {
                if (type === "date" && typeof value !== "string" && typeof value !== "number") {
                    setFilters(
                        { ...filterValues, ["createdAfter"]: value.from, ["createdBefore"]: value.to },
                        displayedFilters,
                        true
                    );
                } else {
                    setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
                }
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
            }
            setPage(1);
        },
        300
    );

    const changeDate = (date: DateRange | undefined) => {
        if (date) {
            if (date.from && date.to) {
                setStartDate(date.from);
                setEndDate(date.to);
                onPropertySelected({ from: formattedDate(date.from), to: formattedDate(date.to) }, "date");
            }
        } else {
            setStartDate(undefined);
            setEndDate(undefined);
            onPropertySelected({ from: "", to: "" }, "date");
        }
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setStartDate(undefined);
        setEndDate(undefined);
    };

    return {
        translate,
        startDate,
        endDate,

        changeDate,
        onClearFilters
    };
};

export default useCallbackListFilter;
