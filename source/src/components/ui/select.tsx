/* eslint-disable react/prop-types */
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { ErrorBadge } from "./Input/ErrorBadge";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

export enum SelectType {
    DEFAULT = "default",
    GRAY = "gray"
}

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
    variant?: string;
    isError?: boolean;
    errorMessage?: string | React.ReactNode;
}

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
    ({ className, children, variant = SelectType.DEFAULT, isError = false, errorMessage = "", ...props }, ref) => {
        return (
            <>
                <SelectPrimitive.Trigger
                    ref={ref}
                    className={cn(
                        "bg-neutral-0 dark:bg-neutral-100",
                        variant === SelectType.GRAY ? "bg-white dark:bg-muted" : "",
                        `!mt-[0px] flex h-[38px] w-full items-center justify-between rounded-4 border px-3 py-2 text-start text-sm ring-offset-background focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:!text-neutral-80 disabled:dark:bg-neutral-90 disabled:dark:!text-neutral-60 [&>span]:line-clamp-1`,
                        "[&:is([data-state='open'])]:border-green-50 [&:is([data-state='open'])]:text-neutral-80 [&:is([data-state='open'])]:dark:text-neutral-0 [&:is([data-state='open'])_#selectToggleIcon]:rotate-180 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70",
                        "border-neutral-40 text-neutral-80 hover:!border-green-20 active:border-green-50 dark:border-neutral-60 dark:text-neutral-40",
                        "",
                        isError ? "!border-red-40 dark:!border-red-40" : "",
                        className
                    )}
                    {...props}>
                    {children}
                    <SelectPrimitive.Icon asChild>
                        <div className="flex items-center gap-2">
                            <ChevronDown
                                id="selectToggleIcon"
                                className="h-4 w-4 text-green-50 transition-transform dark:text-green-40"
                            />
                            {isError && (
                                <ErrorBadge
                                    errorMessage={errorMessage}
                                    className="!flex h-4 items-center justify-center"
                                />
                            )}
                        </div>
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                {isError && <span className="!mt-[4px] block !text-note-1 sm:!hidden">{errorMessage}</span>}
            </>
        );
    }
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
    const [maxHeight, setMaxHeight] = React.useState<string>("400");
    const selectRef = React.useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const calculateMaxHeight = () => {
            setIsLoading(true);
            if (selectRef.current) {
                const viewportHeight = window.innerHeight;
                const selectRect = selectRef.current.getBoundingClientRect();
                const topSpace = selectRect.top;
                const bottomSpace = viewportHeight - selectRect.bottom;
                const availableSpace = Math.max(topSpace, bottomSpace) - 15;
                setMaxHeight(Math.min(availableSpace, 400).toString());
            }
            setIsLoading(false);
        };

        calculateMaxHeight();
        window.addEventListener("resize", calculateMaxHeight);
        return () => window.removeEventListener("resize", calculateMaxHeight);
        // eslint-disable-next-line no-sparse-arrays
    }, [, selectRef.current?.clientHeight]);

    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                avoidCollisions
                ref={selectRef}
                className={cn(
                    "relative z-[60] min-w-[8rem] overflow-hidden rounded-4 border border-green-50 bg-white dark:bg-neutral-100",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
                    className
                )}
                position={position}
                style={{ maxHeight: `${maxHeight}px`, transition: "max-height 0.3s ease-out" }}
                {...props}>
                <ScrollArea className="h-full overflow-auto">
                    <SelectPrimitive.Viewport
                        className={cn(
                            "p-0",
                            position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]"
                        )}>
                        {children}
                    </SelectPrimitive.Viewport>
                </ScrollArea>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => <SelectPrimitive.Label ref={ref} className={className} {...props} />);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
    variant?: string;
}

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, SelectItemProps>(
    ({ className, children, variant = SelectType.DEFAULT, ...props }, ref) => (
        <SelectPrimitive.Item
            ref={ref}
            className={cn(
                `${
                    variant === SelectType.GRAY ? "bg-white dark:bg-muted" : ""
                } relative flex w-full cursor-pointer select-none items-center py-2 pl-8 pr-2 text-sm text-neutral-80 outline-none focus:bg-green-50 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:text-neutral-30 dark:hover:bg-green-50 dark:hover:text-neutral-0 dark:focus:bg-green-50`,
                className
            )}
            {...props}>
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                </SelectPrimitive.ItemIndicator>
            </span>

            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator };
