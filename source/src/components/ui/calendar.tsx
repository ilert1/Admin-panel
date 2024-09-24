import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({ className, classNames, ...props }: DayPickerProps) {
    return (
        <DayPicker
            captionLayout="dropdown"
            hideWeekdays
            className={cn("p-3 rounded-lg bg-neutral-0", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0",
                month: "text-green-40",
                month_caption: "flex justify-center pt-1 relative items-center",
                dropdown: "hidden",
                months_dropdown: "text-red",
                caption_label: "text-sm font-medium",
                nav: "flex",
                button_previous: cn(
                    buttonVariants({ variant: "textBtn" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 font-bold absolute left-1 z-10"
                ),
                button_next: cn(
                    buttonVariants({ variant: "textBtn" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 font-bold absolute right-1 z-10"
                ),
                selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day: "h-5 w-5 p-0 font-normal text-sm text-neutral-10",
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
                }
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
