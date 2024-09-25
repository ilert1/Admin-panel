import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps, type DayPickerProps } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";

function Calendar({ className, classNames, ...props }: DayPickerProps) {
    return (
        <DayPicker
            autoFocus
            captionLayout="dropdown"
            startMonth={new Date(2014, 0)}
            hideWeekdays
            className={cn("p-4 rounded-4 bg-neutral-0 border-green-50 border", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0",
                month_caption: "flex justify-center items-center [&_svg]:hidden text-green-40",
                months_dropdown: "bg-neutral-0 text-neutral-100 border-green-50 border",
                dropdowns: "static flex items-center gap-1",
                caption_label: "flex justify-center text-green-40 items-center",
                nav: "flex",
                button_previous: cn(
                    buttonVariants({ variant: "textBtn" }),
                    "h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100 font-bold absolute left-4 top-5 z-10"
                ),
                button_next: cn(
                    buttonVariants({ variant: "textBtn" }),
                    "h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100 font-bold absolute right-4 top-5 z-10"
                ),
                selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day: "h-5 w-5 p-0 font-normal text-sm text-neutral-10",
                day_hidden: "invisible",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_button: "h-5 w-5 m-2",
                today: "relative z-10 [&:not([aria-selected])]:before:absolute [&:not([aria-selected])]:before:outline [&:not([aria-selected])]:before:outline-1 [&:not([aria-selected])]:before:outline-green-40 [&:not([aria-selected])]:before:rounded-4 [&:not([aria-selected])]:before:top-1 [&:not([aria-selected])]:before:bottom-1 [&:not([aria-selected])]:before:left-1 [&:not([aria-selected])]:before:right-1 [&:not([aria-selected])]:before:-z-10",
                range_middle:
                    "relative after:absolute after:bg-green-20 after:top-1 after:bottom-1 after:left-0 after:right-0 after:-z-10 z-10",
                range_start:
                    "relative z-10 after:absolute after:bg-green-50 after:rounded-4 after:top-1 after:bottom-1 after:left-1 after:right-1 after:-z-10 before:absolute before:bg-green-20 before:top-1 before:bottom-1 before:left-3 before:right-0 before:-z-10",
                range_end:
                    "relative z-10 after:absolute after:bg-green-50 after:rounded-4 after:top-1 after:bottom-1 after:left-1 after:right-1 after:-z-10 before:absolute before:bg-green-20 before:top-1 before:bottom-1 before:left-0 before:right-3 before:-z-10",
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
                                onClick={() => handleChange(String(option.value))}
                                className={
                                    "text-sm font-medium text-neutral-100 rounded-4 px-1 py-1.5 pointer" +
                                    (option.value === value ? " bg-green-50" : "")
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
                                className="pointer py-1 px-1.5 text-sm font-medium"
                                onClick={() => setShowDropdown(true)}>
                                {selected?.label}
                            </button>

                            {showDropdown && (
                                <div className="absolute overflow-auto top-0 bottom-0 left-0 right-0 grid grid-cols-3 bg-neutral-0 z-30 gap-x-1 gap-y-2 p-2 rounded-4">
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
