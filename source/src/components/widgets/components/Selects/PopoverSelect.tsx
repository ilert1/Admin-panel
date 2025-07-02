import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/Button";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ErrorBadge } from "@/components/ui/Input/ErrorBadge";
import { PaymentTypeIcon } from "../PaymentTypeIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loading, LoadingBlock } from "@/components/ui/loading";

export interface IPopoverSelect {
    value: string;
    setIdValue?: (value: string) => void;
    idField?: string;
    onChange: (value: string) => void;
    isError?: boolean;
    errorMessage?: string | ReactNode;
    disabled?: boolean;
    style?: "Grey" | "Black";
    placeholder?: string;
    modal?: boolean;
    isLoading?: boolean;
}

interface PopoverSelectProps extends IPopoverSelect {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: any[];
    variantKey: string;
    variantTitleKey?: string;

    notFoundMessage: string;
    commandPlaceholder?: string;
    iconForPaymentTypes?: boolean;
}

export const PopoverSelect = (props: PopoverSelectProps) => {
    const {
        value,
        idField,
        variants,
        variantKey,
        variantTitleKey,
        notFoundMessage,
        placeholder,
        isError,
        errorMessage = "",
        disabled = false,
        commandPlaceholder = "",
        style = "Grey",
        iconForPaymentTypes = false,
        modal = false,
        isLoading = false,
        onChange,
        setIdValue
    } = props;
    const [open, setOpen] = useState(false);
    const [ttpOpen, setTtpOpen] = useState(false);

    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => setTtpOpen(true), 200);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => setTtpOpen(false), 200);
    };
    const onSelectChange = (currentValue: string) => {
        onChange(currentValue === value ? "" : currentValue);

        if (setIdValue && idField) {
            const variantId = variants.find(el => el[variantKey] === currentValue)[idField];
            setIdValue(variantId);
        }

        setOpen(false);
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const handleTogglePopover = () => {
        setOpen(prev => !prev);
    };

    if (disabled)
        return (
            <TooltipProvider>
                <Tooltip open={ttpOpen} onOpenChange={setTtpOpen}>
                    <TooltipTrigger asChild className="!mt-0" role="none">
                        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-full">
                            <Button
                                disabled
                                variant="outline_gray"
                                className={cn(
                                    style === "Black"
                                        ? "bg-black hover:!bg-white hover:dark:!bg-black"
                                        : "!bg-white hover:!bg-white dark:!bg-muted hover:dark:!bg-muted",
                                    `!mt-[0px] flex h-[38px] w-full items-center justify-between rounded-4 border px-3 py-2 text-start text-sm ring-offset-background focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:!text-neutral-80 disabled:dark:!bg-neutral-90 disabled:dark:!text-neutral-60 [&>span]:line-clamp-1`,
                                    "[&:is([data-state='open'])]:border-green-50 [&:is([data-state='open'])]:text-neutral-80 [&:is([data-state='open'])]:dark:text-neutral-0 [&:is([data-state='open'])_#selectToggleIcon]:rotate-180 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70",
                                    "border-neutral-40 bg-neutral-0 text-neutral-80 active:border-green-50 dark:border-neutral-60 dark:bg-neutral-100 dark:text-neutral-40",
                                    "hover:!border-green-20 dark:hover:text-neutral-40",
                                    isError ? "!border-red-40 dark:!border-red-40" : ""
                                )}>
                                {isLoading ? (
                                    <div className="flex w-full items-center justify-center">
                                        <LoadingBlock className="!h-4 !w-4" />
                                    </div>
                                ) : (
                                    <span className="truncate text-neutral-60 dark:text-neutral-70">{placeholder}</span>
                                )}
                            </Button>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{placeholder}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

    return (
        <Popover open={open} onOpenChange={setOpen} modal={modal}>
            <PopoverTrigger asChild className="mt-0" disabled={disabled}>
                <Button
                    variant={"outline_gray"}
                    role="combobox"
                    onClick={handleTogglePopover}
                    // aria-expanded={open}
                    className={cn(
                        style === "Black"
                            ? "bg-black hover:!bg-white hover:dark:!bg-black"
                            : "!bg-white hover:!bg-white dark:!bg-muted hover:dark:!bg-muted",
                        `!mt-[0px] flex h-[38px] w-full items-center justify-between rounded-4 border px-3 py-2 text-start text-sm ring-offset-background focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:!text-neutral-80 disabled:dark:!bg-neutral-90 disabled:dark:!text-neutral-60 [&>span]:line-clamp-1`,
                        "[&:is([data-state='open'])]:border-green-50 [&:is([data-state='open'])]:text-neutral-80 [&:is([data-state='open'])]:dark:text-neutral-0 [&:is([data-state='open'])_#selectToggleIcon]:rotate-180 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70",
                        "border-neutral-40 bg-neutral-0 text-neutral-80 active:border-green-50 dark:border-neutral-60 dark:bg-neutral-100 dark:text-neutral-40",
                        "hover:!border-green-20 dark:hover:text-neutral-40",
                        isError ? "!border-red-40 dark:!border-red-40" : ""
                    )}>
                    <div className="flex w-full items-center justify-between">
                        {value ? (
                            <div className="block max-w-[80%] flex-wrap items-center overflow-hidden text-ellipsis break-words">
                                {value}
                            </div>
                        ) : (
                            <div className="overflow-hidden text-ellipsis break-words">
                                <div className="flex flex-wrap items-center !overflow-hidden">
                                    <span className="truncate text-neutral-60 dark:text-neutral-70">{placeholder}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            {value && (
                                <>
                                    <XIcon
                                        className="mx-2 h-4 cursor-pointer text-muted-foreground"
                                        onClick={event => {
                                            event.stopPropagation();

                                            onChange("");

                                            if (setIdValue) {
                                                setIdValue("");
                                            }
                                        }}
                                    />
                                    <Separator orientation="vertical" className="flex h-full min-h-6" />{" "}
                                </>
                            )}
                            <ChevronDown
                                id="selectToggleIcon"
                                className="ml-2 h-4 w-4 cursor-pointer text-green-50 transition-transform dark:text-green-40"
                            />
                            {isError && (
                                <ErrorBadge
                                    errorMessage={errorMessage}
                                    className="ml-2 !flex h-4 items-center justify-center"
                                />
                            )}
                        </div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" onEscapeKeyDown={() => setOpen(false)}>
                <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                    <CommandInput placeholder={commandPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{notFoundMessage}</CommandEmpty>
                        <CommandGroup>
                            {variants.map(variant => (
                                <CommandItem
                                    className="flex items-center gap-2 bg-muted"
                                    key={variant[variantKey]}
                                    value={variant[variantKey]}
                                    onSelect={onSelectChange}>
                                    <CheckIcon
                                        className={cn(
                                            "h-4 w-full max-w-4",
                                            value === variant[variantKey] ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <>
                                        {iconForPaymentTypes ? (
                                            <PaymentTypeIcon
                                                type={variant[variantKey]}
                                                metaIcon={variant.meta?.["icon"]}
                                                metaIconMargin
                                                className="min-w-[24px]"
                                            />
                                        ) : undefined}
                                        <p>{variantTitleKey ? variant[variantTitleKey] : variant[variantKey]}</p>
                                    </>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
