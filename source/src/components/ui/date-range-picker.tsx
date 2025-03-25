import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
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

    const timeFormat = (date: Date) => {
        const two = (num: number) => (num < 10 ? `0${num}` : num);

        return `${two(date.getHours())}:${two(date.getMinutes())}`;
    };

    const [timeShow, setTimeShow] = useState<CheckedState>(() =>
        dateRange?.from && dateRange?.to && dateRange.from.toLocaleString() !== dateRange.to.toLocaleString()
            ? true
            : false
    );
    const [openPopover, setOpenPopover] = useState(false);
    const [startTime, setStartTime] = useState(dateRange?.from ? timeFormat(dateRange?.from) : "00:00");
    const [endTime, setEndTime] = useState(dateRange?.to ? timeFormat(dateRange?.to) : "00:00");
    const initDate = new Date();

    const genereateDateTime = (date: Date, hours: number, minutes: number) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);

    const updateStartTime = (time: string) => {
        if (dateRange?.from && dateRange.to) {
            if (time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
                const [hours, minutes] = time.split(":").map(str => parseInt(str, 10));
                const newDate = genereateDateTime(dateRange.from, hours, minutes);

                if (newDate.getTime() > dateRange.to?.getTime()) {
                    setEndTime(time);
                    onChange({ from: newDate, to: genereateDateTime(dateRange.to, hours, minutes) });
                } else {
                    onChange({ from: newDate, to: dateRange.to });

                    if (!endTime) {
                        setEndTime("00:00");
                    }
                }
            } else {
                const newDate = genereateDateTime(dateRange.from, 0, 0);

                if (newDate.getTime() !== dateRange.from.getTime() && time === "__:__") {
                    setEndTime("__:__");
                    onChange({
                        from: newDate,
                        to: genereateDateTime(dateRange.to, 0, 0)
                    });
                }
            }

            setStartTime(time);
        }
    };

    const updateEndTime = (time: string) => {
        if (dateRange?.from && dateRange.to) {
            if (time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
                const [hours, minutes] = time.split(":").map(str => parseInt(str, 10));

                const newDate = genereateDateTime(dateRange.to, hours, minutes);

                if (newDate.getTime() < dateRange.from?.getTime()) {
                    setStartTime(time);
                    onChange({ from: genereateDateTime(dateRange.from, hours, minutes), to: newDate });
                } else {
                    onChange({ from: dateRange.from, to: newDate });

                    if (!startTime) {
                        setStartTime("00:00");
                    }
                }
            } else {
                const newDate = genereateDateTime(dateRange.to, 0, 0);

                if (
                    newDate.getTime() !== dateRange.to.getTime() &&
                    time === "__:__" &&
                    dateRange.from.getTime() < newDate.getTime()
                ) {
                    onChange({
                        from: dateRange.from,
                        to: newDate
                    });
                }
            }

            setEndTime(time);
        }
    };

    const onSelectDate = (date: DateRange | undefined) => {
        const newDateRange = date ? { from: date.from, to: date.to } : undefined;

        if (startTime && newDateRange?.from) {
            const [hours, minutes] = startTime.split(":").map(str => parseInt(str, 10));
            newDateRange.from = genereateDateTime(newDateRange.from, hours, minutes);
        }

        if (endTime && newDateRange?.to) {
            const [hours, minutes] = endTime.split(":").map(str => parseInt(str, 10));
            newDateRange.to = genereateDateTime(newDateRange.to, hours, minutes);
        }

        onChange(newDateRange);
    };

    const showTimeHandler = () => {
        if (timeShow && dateRange?.from && dateRange?.to) {
            setStartTime("00:00");
            setEndTime("00:00");

            onChange({
                from: genereateDateTime(dateRange.from, 0, 0),
                to: genereateDateTime(dateRange.to, 0, 0)
            });
        } else if (!timeShow) {
            setStartTime("00:00");
            setEndTime("01:00");

            if (dateRange?.from && dateRange?.to) {
                onChange({
                    from: genereateDateTime(dateRange.from, 0, 0),
                    to: genereateDateTime(dateRange.to, 1, 0)
                });
            } else {
                onChange({
                    from: genereateDateTime(initDate, 0, 0),
                    to: genereateDateTime(initDate, 1, 0)
                });
            }
        }

        setTimeShow(!timeShow);
    };

    useEffect(() => {
        if (dateRange?.from === undefined || dateRange?.to === undefined) {
            setTimeShow(false);
            setStartTime("");
            setEndTime("");
        }
    }, [dateRange?.from, dateRange?.to]);

    return (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
                <div className="flex flex-col flex-wrap items-stretch gap-2 sm:gap-3">
                    <div className="relative flex flex-1 flex-col gap-[4px]">
                        {title && <span className="text-neutral-60 dark:text-neutral-0">{title}</span>}
                        <Button
                            variant={"outline"}
                            className={cn(
                                "flex min-w-56 flex-1 items-center justify-between gap-3 px-3 py-2",
                                "border-neutral-40 bg-neutral-0 text-neutral-80 focus:border-green-60 active:border-green-60",
                                "dark:border-green-50 dark:bg-neutral-100 dark:text-neutral-0 dark:focus:border-green-50 dark:active:border-green-50",
                                "hover:border-green-40 hover:bg-neutral-0",
                                "dark:hover:border-green-40 dark:hover:bg-neutral-100"
                            )}>
                            {dateRange?.from ? (
                                dateRange.to &&
                                dateRange.from.toLocaleDateString(locale) !==
                                    dateRange.to.toLocaleDateString(locale) ? (
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
                                    className={"justify-centertext-neutral-60 flex items-center hover:text-neutral-80"}>
                                    <X className="h-4 w-4" />
                                </span>
                            ) : (
                                <CalendarIcon className="mb-0.5 h-4 w-4 text-green-50" />
                            )}
                        </Button>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto select-none rounded-4 border border-green-60 bg-neutral-0 p-0 shadow dark:border-green-50 dark:bg-neutral-100"
                align="center">
                <Calendar
                    timeZone="+00:00"
                    today={initDate}
                    disabled={{ after: initDate }}
                    defaultMonth={initDate}
                    startMonth={new Date(2014, 0, 1)}
                    endMonth={initDate}
                    mode="range"
                    selected={dateRange}
                    onSelect={onSelectDate}
                />

                <div className="px-4 pb-2 text-sm text-neutral-80 dark:text-neutral-40">
                    <div className="mb-1 flex items-center gap-2 py-2">
                        <Checkbox checked={timeShow} onCheckedChange={showTimeHandler} id="showTime" />
                        <label
                            htmlFor="showTime"
                            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {translate("app.ui.timePickerShow")}
                        </label>
                    </div>

                    {timeShow && (
                        <div className="flex flex-col">
                            {dateRange?.from?.toLocaleDateString(locale) !==
                                dateRange?.to?.toLocaleDateString(locale) && (
                                <div className="flex gap-4">
                                    <span className="mb-1 block flex-1 text-xs">
                                        {dateRange?.from?.toLocaleDateString(locale)}
                                    </span>

                                    <span className="mb-1 block flex-1 text-xs">
                                        {dateRange?.to?.toLocaleDateString(locale)}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-baseline gap-2">
                                <TimeInput
                                    error={
                                        (!startTime && !!endTime && !!dateRange?.from && !!dateRange?.to) ||
                                        (startTime === endTime &&
                                            dateRange?.from?.getDate() === dateRange?.to?.getDate())
                                    }
                                    disabled={!dateRange?.from}
                                    time={startTime}
                                    setTime={updateStartTime}
                                />

                                <span className="block py-2">-</span>

                                <TimeInput
                                    error={
                                        (!!startTime && !endTime && !!dateRange?.from && !!dateRange?.to) ||
                                        (startTime === endTime &&
                                            dateRange?.from?.getDate() === dateRange?.to?.getDate())
                                    }
                                    disabled={!dateRange?.to}
                                    time={endTime}
                                    setTime={updateEndTime}
                                />
                            </div>

                            {startTime === endTime && dateRange?.from?.getDate() === dateRange?.to?.getDate() && (
                                <div>
                                    <p className="pt-1 text-center text-xs text-red-50">
                                        {translate("app.ui.timePickerErrorTitle")}
                                    </p>
                                    <p className="text-center text-xs text-red-50">
                                        ({translate("app.ui.timePickerErrorDescription")})
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
