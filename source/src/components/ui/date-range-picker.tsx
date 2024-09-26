import { CalendarIcon, X } from "lucide-react";
import { format, subYears } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useTranslate } from "react-admin";
import { useState } from "react";

export function DateRangePicker({
    placeholder,
    dateRange,
    onChange
}: {
    placeholder: string;
    dateRange: DateRange | undefined;
    onChange: (date: DateRange | undefined) => void;
}) {
    const [openPopover, setOpenPopover] = useState(false);
    const translate = useTranslate();
    const initDate = new Date();

    return (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
                <div className="flex flex-col sm:flex-row items-stretch flex-wrap gap-2 sm:gap-3">
                    <div className="relative flex gap-2 items-center flex-1">
                        <span>{translate("resources.transactions.download.dateTitle")}</span>
                        <Button
                            variant={"outline"}
                            className={
                                "flex flex-1 justify-between items-center gap-3 text-neutral-100 duration-200 px-3 py-2 border-green-40 min-w-52"
                            }>
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "dd.MM.yyyy")} - {format(dateRange.to, "dd.MM.yyyy")}
                                    </>
                                ) : (
                                    format(dateRange.from, "dd.MM.yyyy")
                                )
                            ) : (
                                <span className="text-neutral-80 dark:text-neutral-70">{placeholder}</span>
                            )}

                            {openPopover && dateRange?.from && dateRange?.to ? (
                                <span
                                    onClick={e => {
                                        e.preventDefault();
                                        onChange(undefined);
                                    }}
                                    tabIndex={-1}
                                    className={
                                        "flex items-center justify-center text-neutral-60 hover:text-neutral-80 transition-colors duration-200"
                                    }>
                                    <X className="w-4 h-4" />
                                </span>
                            ) : (
                                <CalendarIcon className="h-4 w-4 text-green-50 mb-0.5" />
                            )}
                        </Button>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                    today={initDate}
                    disabled={{ after: initDate }}
                    defaultMonth={initDate}
                    startMonth={subYears(new Date(), 10)}
                    endMonth={new Date(initDate)}
                    mode="range"
                    selected={dateRange}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    );
}
