import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps, type DayPickerProps, defaultLocale } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button/button";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslate } from "react-admin";
function Calendar({ className, classNames, ...props }: DayPickerProps) {
    const translate = useTranslate();

    return (
        <DayPicker
            locale={{
                localize: {
                    ...defaultLocale.localize,
                    month: n => translate(`datePicker.month.${n}`)
                }
            }}
            autoFocus
            captionLayout="dropdown"
            showOutsideDays
            hideWeekdays
            className={cn(
                "p-4 pb-2 rounded-4 bg-neutral-0 dark:bg-neutral-100 dark:border-green-50 border-green-60 border shadow select-none",
                className
            )}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0",
                month_caption: "flex justify-center items-center [&_svg]:hidden dark:text-green-40 text-green-50",
                months_dropdown:
                    "bg-neutral-0 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-0 border-green-50 border",
                dropdowns: "static flex items-center gap-1",
                caption_label: "flex justify-center text-green-40 items-center",
                nav: "flex",
                button_previous: cn(
                    buttonVariants({ variant: "text_btn" }),
                    "h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100 font-bold absolute left-4 top-[22px] z-10"
                ),
                button_next: cn(
                    buttonVariants({ variant: "text_btn" }),
                    "h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100 font-bold absolute right-4 top-[22px] z-10"
                ),
                selected:
                    "bg-primary dark:bg-black text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day: "p-0 text-sm font-normal dark:text-neutral-10 text-neutral-80 [&.day-range-end]:text-neutral-0 [&.day-range-start]:text-neutral-0 dark:[&.day-range-end]:text-neutral-0 dark:[&.day-range-start]:text-neutral-0 ",
                hidden: "invisible",
                outside: "text-muted-foreground opacity-40",
                disabled: "text-muted-foreground opacity-40",
                day_button: "w-5 h-5 m-2 text-sm font-normal flex items-center justify-center text-inherit",
                today: "relative z-10 [&:not([aria-selected])]:before:absolute [&:not([aria-selected])]:before:outline [&:not([aria-selected])]:before:outline-1 dark:[&:not([aria-selected])]:before:outline-green-40 [&:not([aria-selected])]:before:outline-green-50 [&:not([aria-selected])]:before:rounded-4 [&:not([aria-selected])]:before:top-1 [&:not([aria-selected])]:before:bottom-1 [&:not([aria-selected])]:before:left-1 [&:not([aria-selected])]:before:right-1 [&:not([aria-selected])]:before:-z-10",
                range_middle:
                    "relative after:absolute dark:after:bg-green-20 after:bg-green-0 after:top-1 after:bottom-1 after:left-0 after:right-0 after:-z-10 z-10",
                range_start:
                    "relative z-10 after:absolute after:bg-green-50 after:rounded-4 after:top-1 after:bottom-1 after:left-1 after:right-1 after:-z-10 before:absolute dark:before:bg-green-20 before:bg-green-0 before:top-1 before:bottom-1 before:left-3 before:right-0 before:-z-10 day-range-start",
                range_end:
                    "relative z-10 after:absolute after:bg-green-50 after:rounded-4 after:top-1 after:bottom-1 after:left-1 after:right-1 after:-z-10 before:absolute dark:before:bg-green-20 before:bg-green-0 before:top-1 before:bottom-1 before:left-0 before:right-3 before:-z-10 day-range-end",
                ...classNames
            }}
            components={{
                Chevron: props => {
                    // eslint-disable-next-line react/prop-types
                    if (props.orientation === "left") {
                        return <ChevronLeft className="h-6 w-6" />;
                    }
                    return <ChevronRight className="h-6 w-6" />;
                },
                Dropdown: ({ value, onChange, options }: DropdownProps) => {
                    const [showDropdown, setShowDropdown] = useState(false);
                    const selected = options?.find(child => child.value === value);

                    const renderItems = useMemo(() => {
                        const handleChange = (value: string) => {
                            const changeEvent = {
                                target: { value }
                            } as React.ChangeEvent<HTMLSelectElement>;
                            onChange?.(changeEvent);
                            setShowDropdown(false);
                        };

                        return options?.map((option, id: number) => (
                            <button
                                id={`${option.value}`}
                                onClick={e =>
                                    !option.disabled ? handleChange(String(option.value)) : e.preventDefault()
                                }
                                className={
                                    "text-sm font-medium dark:text-neutral-0 text-neutral-80 rounded-4 px-1 py-1.5 pointer" +
                                    (option.value === value ? " bg-green-50 dark:bg-green-50 !text-neutral-0" : "") +
                                    (option.disabled
                                        ? " text-muted-foreground opacity-40 select-none dark:text-neutral-0"
                                        : "")
                                }
                                key={`${option.value}-${id}`}>
                                {option.label}
                            </button>
                        ));
                    }, [onChange, options, value]);

                    useEffect(() => {
                        if (showDropdown) {
                            document.getElementById(String(value))?.scrollIntoView();
                        }
                    }, [showDropdown, value]);

                    return (
                        <div>
                            <button
                                className="pointer px-4 py-1.5 text-sm font-medium"
                                onClick={() => setShowDropdown(true)}>
                                {selected?.label}
                            </button>

                            {showDropdown && (
                                <div className="absolute overflow-auto top-0 bottom-0 left-0 right-0 grid grid-cols-3 grid-rows-4 bg-neutral-0 dark:bg-neutral-100 z-30 gap-x-1 gap-y-2 p-2 rounded-4">
                                    {renderItems}
                                </div>
                            )}
                        </div>
                    );
                }
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
