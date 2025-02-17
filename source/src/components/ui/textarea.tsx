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
            <div className="relative flex flex-col gap-[4px] h-full">
                <textarea
                    className={cn(
                        `flex min-h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none !mt-0`,
                        "!text-neutral-80 placeholder:text-neutral-60 border-neutral-40 bg-neutral-0",
                        "dark:!text-neutral-30 dark:bg-neutral-100 dark:border-neutral-60 placeholder:dark:text-neutral-70 dark:hover:border-green-40 dark:focus:border-green-50 ",
                        "disabled:border-neutral-40 disabled:bg-neutral-20 dark:disabled:bg-neutral-90",
                        !readOnly ? "hover:border-green-40 active:border-green-50 focus:border-green-50" : "",
                        error ? "!border-red-40 dark:!border-red-40" : "",
                        className
                    )}
                    readOnly={readOnly}
                    ref={ref}
                    {...props}
                />
                {error && <ErrorBadge className="absolute right-2 top-3 p-0 h-auto" errorMessage={errorMessage} />}
                {error && errorMessage && <span className="!text-note-1 inline text-red-40">{errorMessage}</span>}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
