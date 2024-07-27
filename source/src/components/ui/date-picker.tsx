import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";

export function DatePicker(props: { placeholder: string; date?: Date; onChange?: (date: Date) => void }) {
    const [date, setDate] = useState<Date>();

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
                <Button variant={"outline"} className={cn(!date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd.MM.yyyy") : <span>{props.placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
        </Popover>
    );
}
