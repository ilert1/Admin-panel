import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { useLocaleState } from "react-admin";

export function DateRangePicker({
    title,
    placeholder,
    dateRange,
    onChange
}: {
    title?: string;
    placeholder: string;
    dateRange: DateRange | undefined;
    onChange: (date: DateRange | undefined) => void;
}) {
    const [openPopover, setOpenPopover] = useState(false);
    const initDate = new Date();
    const [locale] = useLocaleState();

    return (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
                <div className="flex flex-col sm:flex-row items-stretch flex-wrap gap-2 sm:gap-3">
                    <div className="relative flex md:flex-col gap-2 items-center md:items-start flex-1">
                        {title && <span>{title}</span>}
                        <Button
                            variant={"outline"}
                            className={
                                "flex flex-1 justify-between items-center gap-3 text-neutral-100 duration-200 px-3 py-2 border-green-40 min-w-56"
                            }>
                            {dateRange?.from ? (
                                dateRange.to && dateRange.from !== dateRange.to ? (
                                    <>
                                        {`${dateRange.from.toLocaleDateString(
                                            locale
                                        )} - ${dateRange.to.toLocaleDateString(locale)}`}
                                    </>
                                ) : (
                                    dateRange.from.toLocaleDateString(locale)
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
                    startMonth={new Date(2014, 0, 1)}
                    endMonth={new Date(initDate)}
                    mode="range"
                    selected={dateRange}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    );
}
