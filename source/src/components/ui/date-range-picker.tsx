import { CalendarIcon, X } from "lucide-react";
import { addDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslate } from "react-admin";

export function DateRangePicker(props: {
    placeholder: string;
    date?: DateRange;
    onChange?: (date: DateRange) => void;
}) {
    const translate = useTranslate();
    const initFromDate = new Date();
    initFromDate.setHours(0, 0, 0, 0);
    const initToDate = addDays(new Date(), 0);
    initToDate.setHours(0, 0, 0, 0);

    const [date, setDate] = useState<DateRange | undefined>({
        from: initFromDate,
        to: initToDate
    });

    useEffect(() => {
        if (date) {
            setDate(date);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.onChange && date) {
            props.onChange(date);
        }
    }, [date, props.onChange]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="flex flex-col sm:flex-row items-stretch flex-wrap gap-2 sm:gap-3">
                    <div className="relative flex gap-2 items-center flex-1">
                        <span>{translate("resources.transactions.download.dateTitle")}</span>
                        <Button
                            variant={"outline"}
                            className={
                                "flex flex-1 justify-between items-center gap-3 text-neutral-100 duration-200 px-3 py-2 border-green-40 min-w-52"
                            }>
                            {date?.from ? (
                                date.to && date.from.getTime() !== date.to.getTime() ? (
                                    <>
                                        {format(date.from, "dd.MM.yyyy")} - {format(date.to, "dd.MM.yyyy")}
                                    </>
                                ) : (
                                    format(date.from, "dd.MM.yyyy")
                                )
                            ) : (
                                <span className="mr-2">{props.placeholder}</span>
                            )}
                            {date?.from?.getUTCDate() === initFromDate.getUTCDate() &&
                            date?.to?.getUTCDate() === initToDate.getUTCDate() ? (
                                <CalendarIcon className="h-4 w-4 text-green-50 mb-0.5" />
                            ) : (
                                <button
                                    type="button"
                                    onClick={e => {
                                        e.preventDefault();
                                        setDate({ from: initFromDate, to: initToDate });
                                    }}
                                    tabIndex={-1}
                                    className={
                                        "flex items-center justify-center text-neutral-60 hover:text-neutral-80 transition-colors duration-200"
                                    }>
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </Button>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar defaultMonth={date?.from} mode="range" selected={date} onSelect={setDate} />
            </PopoverContent>
        </Popover>
    );
}
