import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { useLocaleState, useTranslate } from "react-admin";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TimeInput } from "./time-input";

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
    const [locale] = useLocaleState();
    const translate = useTranslate();

    const [timeShow, setTimeShow] = useState<CheckedState>(false);
    const [openPopover, setOpenPopover] = useState(false);
    const initDate = new Date();

    return (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
                <div className="flex flex-col sm:flex-row items-stretch flex-wrap gap-2 sm:gap-3">
                    <div className="relative flex md:flex-col gap-[4px] items-center md:items-start flex-1">
                        {title && <span className="text-neutral-60 dark:text-neutral-0">{title}</span>}
                        <Button
                            variant={"outline"}
                            className={cn(
                                "flex flex-1 justify-between items-center gap-3 px-3 py-2 min-w-56",
                                "border-neutral-40 focus:border-green-60 active:border-green-60 text-neutral-80 bg-neutral-0",
                                "dark:border-green-50 dark:focus:border-green-50 dark:active:border-green-50 dark:text-neutral-0 dark:bg-neutral-100",
                                "hover:bg-neutral-0 hover:border-green-40",
                                "dark:hover:bg-neutral-100 dark:hover:border-green-40"
                            )}>
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
                                    className={"flex items-center justify-centertext-neutral-60 hover:text-neutral-80"}>
                                    <X className="w-4 h-4" />
                                </span>
                            ) : (
                                <CalendarIcon className="h-4 w-4 text-green-50 mb-0.5" />
                            )}
                        </Button>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 rounded-4 bg-neutral-0 dark:bg-neutral-100 dark:border-green-50 border-green-60 border shadow select-none"
                align="center">
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

                <div className="px-4 pb-2 flex flex-col gap-1 text-sm text-neutral-80 dark:text-neutral-40">
                    <div className="flex items-center gap-2 py-2">
                        <Checkbox checked={timeShow} onCheckedChange={setTimeShow} id="showTime" />
                        <label
                            htmlFor="showTime"
                            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {translate("app.ui.timePickerShow")}
                        </label>
                    </div>

                    {timeShow && (
                        <div className="flex items-center gap-2">
                            <TimeInput></TimeInput>
                            <span>-</span>
                            <TimeInput />
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
