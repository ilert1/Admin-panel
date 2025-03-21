import * as React from "react";

import { cn } from "@/lib/utils";
import { ErrorBadge } from "./Input/ErrorBadge";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean | string;
    errorMessage?: string | React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, readOnly, error, errorMessage, ...props }, ref) => {
        return (
            <div className="relative flex h-full w-full flex-col gap-[4px]">
                <textarea
                    className={cn(
                        `!mt-0 flex min-h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none`,
                        "border-neutral-40 bg-neutral-0 !text-neutral-80 placeholder:text-neutral-60",
                        "dark:border-neutral-60 dark:bg-neutral-100 dark:!text-neutral-30 placeholder:dark:text-neutral-70 dark:hover:border-green-40 dark:focus:border-green-50",
                        "disabled:border-neutral-40 disabled:bg-neutral-20 dark:disabled:bg-neutral-90",
                        !readOnly ? "hover:border-green-40 focus:border-green-50 active:border-green-50" : "",
                        error ? "!border-red-40 dark:!border-red-40" : "",
                        className
                    )}
                    readOnly={readOnly}
                    ref={ref}
                    {...props}
                />
                {error && <ErrorBadge className="absolute right-2 top-3 h-auto p-0" errorMessage={errorMessage} />}
                {error && errorMessage && <span className="inline !text-note-1 text-red-40">{errorMessage}</span>}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
