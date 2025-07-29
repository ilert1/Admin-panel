import { ButtonHTMLAttributes, FC, forwardRef, KeyboardEvent, useEffect, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon, WandSparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import { Button } from "@/components/ui/Button";
import { useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { AddCustomDialog } from "./AddCustomDialog";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva("m-1 transition ease-out duration-150", {
    variants: {
        variant: {
            default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
            secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            inverted: "inverted"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof multiSelectVariants> {
    /**
     * An array of option objects to be displayed in the multi-select component.
     * Each option object has a label, value, and an optional icon.
     */
    options: {
        /** The text to display for the option. */
        label: string;
        /** The unique value associated with the option. */
        value: string;
        /** Optional icon component to display alongside the option. */
        // icon?: ComponentType<{ className?: string }>;
        icon?: FC<{ className?: string; small?: boolean }>;
        // icon?: ReactNode;
    }[];

    /**
     * Callback function triggered when the selected values change.
     * Receives an array of the new selected values.
     */
    onValueChange: (value: string[]) => void;

    /**
     * Placeholder text to be displayed when no values are selected.
     * Optional, defaults to "Select options".
     */
    placeholder?: string;

    /**
     * Animation duration in seconds for the visual effects (e.g., bouncing badges).
     * Optional, defaults to 0 (no animation).
     */
    animation?: number;

    /**
     * Maximum number of items to display. Extra selected items will be summarized.
     * Optional, defaults to 3.
     */
    // maxCount?: number;

    /**
     * The modality of the popover. When set to true, interaction with outside elements
     * will be disabled and only popover content will be visible to screen readers.
     * Optional, defaults to false.
     */
    modalPopover?: boolean;

    /**
     * Additional class names to apply custom styles to the multi-select component.
     * Optional, can be used to add custom styles.
     */
    className?: string;
    // Current array values
    selectedValues: string[];

    notFoundMessage?: string;
    isLoading?: boolean;
    addingNew?: boolean;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
    (
        {
            selectedValues,
            onValueChange,
            options,
            variant,
            placeholder = "Select options",
            animation = 0,
            // maxCount = 3,
            modalPopover = false,
            notFoundMessage,
            className,
            isLoading = false,
            addingNew = false,
            ...props
        },
        ref
    ) => {
        const appToast = useAppToast();

        const commandList = useRef<HTMLDivElement>(null);

        const [localOptions, setLocalOptions] = useState(options);
        const [isPopoverOpen, setIsPopoverOpen] = useState(false);
        const [isAnimating, setIsAnimating] = useState(false);
        const [inputValue, setInputValue] = useState("");
        const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

        useEffect(() => {
            const mergedOptions = [
                ...options,
                ...localOptions.filter(localOpt => !options.some(opt => opt.value === localOpt.value))
            ];
            setLocalOptions(mergedOptions);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [options]);

        const translate = useTranslate();

        const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            }
        };

        const handleInputChange = (val: string) => {
            setInputValue(val);

            if (val.length === 0 && commandList.current) {
                setTimeout(() => {
                    commandList.current?.querySelector("[cmdk-item]")?.scrollIntoView({ block: "nearest" });
                }, 50);
            }
        };

        const toggleOption = (option: string) => {
            const isSelected = selectedValues.includes(option);
            const isCustomOption = !options.some(o => o.value === option);

            if (isSelected) {
                const newSelected = selectedValues.filter(v => v !== option);
                onValueChange(newSelected);

                if (isCustomOption) {
                    setLocalOptions(prev => prev.filter(o => o.value !== option));
                }
            } else {
                const newSelected = [...selectedValues, option];
                onValueChange(newSelected);
            }
        };

        const handleAddCustom = () => {
            setLocalOptions(prev => [...prev, { label: inputValue, value: inputValue }]);
            const newSelectedValues = [...selectedValues, inputValue];
            onValueChange(newSelectedValues);
            setInputValue("");
            appToast("success", translate("app.widgets.multiSelect.confirmDialog.optionAdded"));
        };

        const handleClear = () => {
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen(prev => !prev);
        };

        const toggleAll = () => {
            const originalValues = localOptions.map(option => option.value);
            const areAllSelected = originalValues.every(val => selectedValues.includes(val));

            if (areAllSelected) {
                onValueChange([]);
                setLocalOptions(options);
            } else {
                onValueChange(originalValues);
            }
        };

        const areAllSelected = selectedValues.length === localOptions.length;
        const showButton = addingNew && inputValue.length > 0;

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={open => {
                    setIsPopoverOpen(open);
                }}
                modal={modalPopover}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        role="combobox"
                        onClick={handleTogglePopover}
                        variant={"outline_sec"}
                        className={cn(
                            "flex h-auto min-h-[38px] w-full items-center justify-between rounded-4 border border-neutral-40 bg-white p-1 hover:bg-muted dark:border-neutral-60 dark:bg-muted hover:dark:bg-muted dark:active:border-neutral-60 dark:active:bg-muted [&_svg]:pointer-events-auto",
                            "[&:is([data-state='open'])_#multiSelectToggleIcon]:rotate-180",
                            className
                        )}>
                        {selectedValues.length > 0 ? (
                            <div className="flex w-full items-center justify-between">
                                <div className="flex max-h-32 flex-wrap items-center gap-y-1 overflow-y-auto">
                                    {isLoading ? (
                                        <LoadingBlock className="!h-4 !w-4 overflow-hidden" />
                                    ) : (
                                        selectedValues
                                            // .slice(0, maxCount)
                                            .map(value => {
                                                const option = localOptions.find(o => o.value === value);
                                                const isCustomOption = !options.some(o => o.value === value);
                                                const IconComponent = option?.icon;

                                                return (
                                                    <Badge
                                                        key={value}
                                                        className={cn(
                                                            isAnimating ? "animate-bounce" : "",
                                                            multiSelectVariants({ variant }),
                                                            "my-0 overflow-x-hidden bg-muted font-normal text-neutral-90 dark:text-neutral-0",
                                                            isCustomOption ? "border-dashed border-green-40" : ""
                                                        )}
                                                        style={{ animationDuration: `${animation}s` }}>
                                                        {IconComponent && (
                                                            <IconComponent className="mr-1 h-4 w-4" small />
                                                        )}
                                                        {addingNew ? (
                                                            <span className="flex max-w-48 flex-col overflow-hidden text-ellipsis break-words">
                                                                <p>
                                                                    {isCustomOption
                                                                        ? option?.label
                                                                        : option?.label.split("[")[0].trim()}
                                                                </p>
                                                                <p className="text-left text-xs text-neutral-70">
                                                                    {option?.value}
                                                                </p>
                                                            </span>
                                                        ) : (
                                                            <span className="max-w-48 overflow-hidden text-ellipsis break-words">
                                                                {option?.label}
                                                            </span>
                                                        )}
                                                        <XCircle
                                                            className="ml-2 h-4 w-4 cursor-pointer rounded-full transition-colors hover:bg-red-40"
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                                toggleOption(value);
                                                            }}
                                                        />
                                                    </Badge>
                                                );
                                            })
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center justify-end">
                                    <XIcon
                                        className="mx-2 h-4 cursor-pointer text-muted-foreground"
                                        onClick={event => {
                                            event.stopPropagation();
                                            handleClear();
                                        }}
                                    />
                                    <Separator orientation="vertical" className="flex h-full min-h-6" />
                                    <ChevronDown
                                        id="multiSelectToggleIcon"
                                        className="!pointer-events-none mx-2 h-4 cursor-pointer text-green-50 transition-transform dark:text-green-40"
                                        pointerEvents="none !important"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto flex w-full items-center justify-between">
                                <span className="mx-3 text-sm text-neutral-60 dark:text-neutral-70">{placeholder}</span>
                                <ChevronDown
                                    id="multiSelectToggleIcon"
                                    className="!pointer-events-none mx-2 h-4 cursor-pointer text-green-50 transition-transform dark:text-green-40"
                                    pointerEvents="none !important"
                                />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                    onCloseAutoFocus={e => {
                        e.preventDefault();
                        setInputValue("");
                    }}>
                    <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                        <CommandInput
                            value={inputValue}
                            onValueChange={handleInputChange}
                            placeholder={
                                addingNew
                                    ? translate("app.widgets.multiSelect.searchOrAddPlaceholder")
                                    : translate("app.widgets.multiSelect.searchPlaceholder")
                            }
                            onKeyDown={handleInputKeyDown}
                        />
                        <CommandList ref={commandList}>
                            {/* <CommandEmpty>
                                {addingNew ? (
                                    <div className="h-full w-full">
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                if (!inputValue.match(/^[a-z0-9_]+$/)) {
                                                    appToast(
                                                        "error",
                                                        translate("app.widgets.multiSelect.reqFieldRegex")
                                                    );
                                                    return;
                                                }
                                                if (selectedValues.includes(inputValue)) {
                                                    appToast(
                                                        "error",
                                                        translate("app.widgets.multiSelect.optionAlreadyExists")
                                                    );
                                                    return;
                                                }
                                                setLocalOptions(prev => [
                                                    ...prev,
                                                    { label: inputValue, value: inputValue }
                                                ]);

                                                const newSelectedValues = [...selectedValues, inputValue];
                                                onValueChange(newSelectedValues);
                                                setInputValue("");
                                            }}>
                                            {translate("app.widgets.multiSelect.addNew")}
                                        </Button>
                                    </div>
                                ) : (
                                    notFoundMessage || translate("app.widgets.multiSelect.noResultFound")
                                )}
                            </CommandEmpty> */}
                            {!addingNew && (
                                <CommandEmpty>
                                    {notFoundMessage || translate("app.widgets.multiSelect.noResultFound")}
                                </CommandEmpty>
                            )}
                            <CommandGroup>
                                {options.length > 0 && (
                                    <CommandItem
                                        key="all"
                                        onSelect={toggleAll}
                                        className="cursor-pointer bg-muted hover:!bg-neutral-60 data-[selected=true]:bg-neutral-50 dark:hover:!bg-neutral-90 dark:data-[selected=true]:bg-neutral-80">
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-4 border border-neutral-60 bg-white dark:bg-black",
                                                areAllSelected
                                                    ? "border-transparent bg-green-50 text-white dark:bg-green-50"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}>
                                            <CheckIcon className="h-4 w-4" />
                                        </div>
                                        <span className="text-neutral-90 dark:text-neutral-0">
                                            ({translate("app.widgets.multiSelect.selectAll")})
                                        </span>
                                    </CommandItem>
                                )}
                                {options.map(option => {
                                    const isSelected = selectedValues.includes(option.value);
                                    return (
                                        <CommandItem
                                            onKeyDownCapture={event => {
                                                event.preventDefault();
                                            }}
                                            key={option.value}
                                            onSelect={() => toggleOption(option.value)}
                                            className="cursor-pointer bg-muted hover:!bg-neutral-60 data-[selected=true]:bg-neutral-50 dark:hover:!bg-neutral-90 dark:data-[selected=true]:bg-neutral-80">
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-4 border border-neutral-60 bg-white dark:bg-black",
                                                    isSelected
                                                        ? "border-transparent bg-green-50 text-white dark:bg-green-50"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}>
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            {option.icon && <option.icon className="mr-2 text-muted-foreground" />}
                                            <span className="text-neutral-90 dark:text-neutral-0">{option.label}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                        </CommandList>
                        {showButton && (
                            <div className="p-2">
                                <Button
                                    className="w-full rounded-none"
                                    onClick={() => {
                                        if (!inputValue.match(/^[a-z0-9_]+$/)) {
                                            appToast("error", translate("app.widgets.multiSelect.reqFieldRegex"));
                                            return;
                                        }
                                        if (selectedValues.includes(inputValue)) {
                                            appToast("error", translate("app.widgets.multiSelect.optionAlreadyExists"));
                                            return;
                                        }
                                        setConfirmDialogOpen(true);
                                        // setLocalOptions(prev => [
                                        //     ...prev,
                                        //     { label: inputValue, value: inputValue }
                                        // ]);
                                        // const newSelectedValues = [...selectedValues, inputValue];
                                        // onValueChange(newSelectedValues);
                                        // setInputValue("");
                                    }}>
                                    {translate("app.widgets.multiSelect.addNew")}
                                </Button>
                            </div>
                        )}
                    </Command>
                </PopoverContent>
                {animation > 0 && selectedValues.length > 0 && (
                    <WandSparkles
                        className={cn(
                            "my-2 h-3 w-3 cursor-pointer bg-background text-foreground",
                            isAnimating ? "" : "text-muted-foreground"
                        )}
                        onClick={() => setIsAnimating(!isAnimating)}
                    />
                )}
                <AddCustomDialog
                    open={confirmDialogOpen}
                    onOpenChange={setConfirmDialogOpen}
                    onConfirm={handleAddCustom}
                    localOptions={localOptions}
                    code={inputValue}
                />
            </Popover>
        );
    }
);

MultiSelect.displayName = "MultiSelect";
