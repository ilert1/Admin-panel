import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, readOnly, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                `flex min-h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none !mt-0`,
                "!text-neutral-80 placeholder:text-neutral-60 border-neutral-40 bg-neutral-0",
                "dark:!text-neutral-30 dark:bg-neutral-100 dark:border-neutral-60 placeholder:dark:text-neutral-70 dark:hover:border-green-40 dark:focus:border-green-50 ",
                "disabled:border-neutral-40 disabled:bg-neutral-20 dark:disabled:bg-neutral-90",
                !readOnly ? "hover:border-green-40 active:border-green-50 focus:border-green-50" : "",
                className
            )}
            readOnly={readOnly}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
