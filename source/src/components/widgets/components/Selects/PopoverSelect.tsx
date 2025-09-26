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
import { LoadingBlock } from "@/components/ui/loading";

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
    idFieldValue?: string;
}

interface PopoverSelectProps extends IPopoverSelect {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variantKey: string | ((variant: any) => string);
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
        setIdValue,
        idFieldValue
    } = props;
    const [open, setOpen] = useState(false);
    const [ttpOpen, setTtpOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const commandList = useRef<HTMLDivElement>(null);
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
        if (currentValue === value) {
            onChange("");
            if (setIdValue) setIdValue("");
            setOpen(false);
            return;
        }

        onChange(currentValue);

        if (setIdValue && idField) {
            const variantId = variants.find(el => {
                if (typeof variantKey === "string") {
                    return el[variantKey] === currentValue;
                } else {
                    return variantKey(el) === currentValue;
                }
            })[idField];
            setIdValue(variantId);
        }

        setOpen(false);
    };

    const customFilter = (value: string, search: string) => {
        if (!search) return 1;

        const lowerValue = value.toLowerCase();
        const lowerSearch = search.toLowerCase();
        const index = lowerValue.indexOf(lowerSearch);

        return index === -1 ? 0 : 1;
    };

    const getFilteredVariants = () => {
        if (!searchValue) return variants;

        const lowerSearch = searchValue.toLowerCase();

        const filteredVariants = variants.filter(variant => {
            const variantValue = typeof variantKey === "string" ? variant[variantKey] : variantKey(variant);
            const searchText = variantTitleKey ? variant[variantTitleKey] : variantValue;
            return searchText.toLowerCase().includes(lowerSearch);
        });

        return filteredVariants.sort((a, b) => {
            const aValue = variantTitleKey
                ? a[variantTitleKey]
                : typeof variantKey === "string"
                  ? a[variantKey]
                  : variantKey(a);
            const bValue = variantTitleKey
                ? b[variantTitleKey]
                : typeof variantKey === "string"
                  ? b[variantKey]
                  : variantKey(b);

            const aIndex = aValue.toLowerCase().indexOf(lowerSearch);
            const bIndex = bValue.toLowerCase().indexOf(lowerSearch);

            return aIndex - bIndex;
        });
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

    const handleInputChange = (val: string) => {
        setSearchValue(val);
        if (val.length === 0 && commandList.current) {
            setTimeout(() => {
                commandList.current?.querySelector("[cmdk-item]")?.scrollIntoView({ block: "nearest" });
            }, 50);
        }
    };

    useEffect(() => {
        if (idFieldValue && setIdValue) {
            setIdValue(idFieldValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!open) {
            setSearchValue("");
        }
    }, [open]);

    const filteredVariants = getFilteredVariants();

    useEffect(() => {
        if (commandList.current) {
            commandList.current.scrollTop = 0;
        }
    }, [searchValue]);

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
                                        ? "bg-black hover:bg-white hover:dark:bg-black"
                                        : "bg-white hover:bg-white dark:bg-muted hover:dark:bg-muted",
                                    "disabled:border-neutral-40 disabled:bg-neutral-20",
                                    `!mt-[0px] flex h-[38px] w-full items-center justify-between rounded-4 border px-3 py-2 text-start text-sm ring-offset-background focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:!text-neutral-80 disabled:dark:bg-neutral-90 disabled:dark:!text-neutral-60 [&>span]:line-clamp-1`,
                                    "[&:is([data-state='open'])]:border-green-50 [&:is([data-state='open'])]:text-neutral-80 [&:is([data-state='open'])]:dark:text-neutral-0 [&:is([data-state='open'])_#selectToggleIcon]:rotate-180 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70",
                                    "border-neutral-40 text-neutral-80 active:border-green-50 dark:border-neutral-60 dark:text-neutral-40",
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
            <PopoverTrigger asChild className="mt-0">
                {/* disabled={disabled} */}
                <Button
                    variant={"outline_gray"}
                    role="combobox"
                    onClick={handleTogglePopover}
                    disabled={disabled}
                    // aria-expanded={open}
                    className={cn(
                        style === "Black"
                            ? "bg-white hover:bg-white dark:bg-black hover:dark:bg-black"
                            : "bg-white hover:bg-white dark:bg-muted hover:dark:bg-muted",
                        `!mt-[0px] flex h-[38px] w-full items-center justify-between rounded-4 border px-3 py-2 text-start text-sm ring-offset-background focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-red-40 disabled:!text-neutral-80 disabled:dark:!bg-neutral-90 disabled:dark:!text-neutral-60 [&>span]:line-clamp-1`,
                        "[&:is([data-state='open'])]:border-green-50 [&:is([data-state='open'])]:text-neutral-80 [&:is([data-state='open'])]:dark:text-neutral-0 [&:is([data-state='open'])_#selectToggleIcon]:rotate-180 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70",
                        "border-neutral-40 text-neutral-80 active:border-green-50 dark:border-neutral-60 dark:text-neutral-40",
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
                <Command filter={customFilter}>
                    <CommandInput onValueChange={handleInputChange} placeholder={commandPlaceholder} />
                    <CommandList
                        ref={commandList}
                        onKeyDown={e => {
                            // предотвращаем cmdk scrollIntoView()
                            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                                e.preventDefault();
                            }
                        }}>
                        <CommandEmpty>{notFoundMessage}</CommandEmpty>
                        <CommandGroup>
                            {filteredVariants.map(variant => {
                                const newVariant = () => {
                                    if (typeof variantKey === "string") {
                                        return variant[variantKey];
                                    } else {
                                        return variantKey(variant);
                                    }
                                };
                                return (
                                    <CommandItem
                                        className={cn(
                                            "cursor-pointer data-[selected=true]:bg-green-50 dark:data-[selected=true]:bg-green-50",
                                            "bg-white hover:bg-green-50 dark:hover:bg-green-50",
                                            "text-neutral-90 hover:text-white dark:text-neutral-0",
                                            style === "Black" ? "dark:bg-black" : "dark:bg-muted"
                                        )}
                                        key={idField ? variant[idField] : newVariant()}
                                        value={newVariant()}
                                        onSelect={onSelectChange}>
                                        <>
                                            {iconForPaymentTypes ? (
                                                <PaymentTypeIcon
                                                    type={newVariant()}
                                                    metaIcon={variant.meta?.["icon"]}
                                                    className="mr-2 min-w-[24px]"
                                                />
                                            ) : undefined}
                                            <p className="truncate">
                                                {variantTitleKey ? variant[variantTitleKey] : newVariant()}
                                            </p>
                                        </>
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-full max-w-4",
                                                value === newVariant() ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
