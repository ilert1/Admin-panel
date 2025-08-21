import { ButtonHTMLAttributes, forwardRef } from "react";
import { type VariantProps } from "class-variance-authority";
import { XIcon, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/Button";
import { LoadingBlock } from "@/components/ui/loading";

import { MultiSelectBadge } from "./MultiSelectBadge";
import { multiSelectVariants, type MultiSelectOption } from "./MultiSelectTypes";

interface MultiSelectButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof multiSelectVariants> {
    selectedValues: string[];
    localOptions: MultiSelectOption[];
    options: MultiSelectOption[];
    placeholder: string;
    isLoading: boolean;
    addingNew: boolean;
    animation: number;
    isAnimating: boolean;
    onToggleOption: (value: string) => void;
    onClear: () => void;
}

export const MultiSelectButton = forwardRef<HTMLButtonElement, MultiSelectButtonProps>(
    (
        {
            selectedValues,
            localOptions,
            options,
            placeholder,
            isLoading,
            addingNew,
            variant,
            animation,
            isAnimating,
            onToggleOption,
            onClear,
            disabled,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <Button
                disabled={disabled}
                ref={ref}
                {...props}
                role="combobox"
                variant={"outline_sec"}
                className={cn(
                    "flex h-auto min-h-[38px] w-full items-center justify-between rounded-4 border border-neutral-40 bg-white p-1 hover:bg-muted dark:border-neutral-60 dark:bg-muted hover:dark:bg-muted dark:active:border-neutral-60 dark:active:bg-muted [&_svg]:pointer-events-auto",
                    "dark:disabled:border-neutral-40 dark:disabled:bg-neutral-90",
                    "[&:is([data-state='open'])_#multiSelectToggleIcon]:rotate-180",
                    className
                )}>
                {selectedValues.length > 0 ? (
                    <div className="flex w-full items-center justify-between">
                        <div className="flex max-h-32 flex-wrap items-center gap-y-1 overflow-y-auto">
                            {isLoading ? (
                                <LoadingBlock className="!h-4 !w-4 overflow-hidden" />
                            ) : (
                                selectedValues.map(value => (
                                    <MultiSelectBadge
                                        key={value}
                                        value={value}
                                        localOptions={localOptions}
                                        options={options}
                                        addingNew={addingNew}
                                        variant={variant}
                                        animation={animation}
                                        isAnimating={isAnimating}
                                        onToggle={onToggleOption}
                                    />
                                ))
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-end">
                            <XIcon
                                className="mx-2 h-4 cursor-pointer text-muted-foreground"
                                onClick={event => {
                                    event.stopPropagation();
                                    onClear();
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
                        {!disabled && (
                            <ChevronDown
                                id="multiSelectToggleIcon"
                                className="!pointer-events-none mx-2 h-4 cursor-pointer text-green-50 transition-transform dark:text-green-40"
                                pointerEvents="none !important"
                            />
                        )}
                    </div>
                )}
            </Button>
        );
    }
);

MultiSelectButton.displayName = "MultiSelectButton";
