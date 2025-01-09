import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, readOnly, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                `flex min-h-10 w-full rounded-md !text-neutral-80 border border-neutral-40 dark:border-neutral-60 ${
                    !readOnly ? "hover:border-green-40 active:border-green-50 focus:border-green-50" : ""
                } bg-neutral-0 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:dark:text-neutral-70 placeholder:text-neutral-60 focus:outline-none disabled:border-neutral-40 disabled:bg-neutral-40`,
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
