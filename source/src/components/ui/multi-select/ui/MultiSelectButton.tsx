import { ButtonHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";
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
    onReorderValues: (fromIndex: number, toIndex: number) => void;
    draggable: boolean;
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
            onReorderValues,
            draggable,
            disabled,
            className,
            ...props
        },
        ref
    ) => {
        const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
        const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [wrapped, setWrapped] = useState(false);

        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const checkWrap = () => {
                const children = Array.from(container.children) as HTMLElement[];
                if (children.length < 2) return;
                const firstTop = children[0].getBoundingClientRect().top;
                const lastTop = children[children.length - 1].getBoundingClientRect().top;
                setWrapped(firstTop !== lastTop);
            };

            const observer = new ResizeObserver(checkWrap);
            observer.observe(container);
            checkWrap();

            return () => observer.disconnect();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [containerRef.current]);

        const handleDragStart = (index: number) => {
            setDraggedIndex(index);
        };

        const handleDragOver = (index: number) => {
            setDragOverIndex(index);
        };

        const handleDragEnd = () => {
            if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
                onReorderValues(draggedIndex, dragOverIndex);
            }
            setDraggedIndex(null);
            setDragOverIndex(null);
        };

        const handleDragLeave = () => {
            setDragOverIndex(null);
        };

        const dragHandlers = draggable
            ? {
                  onDragStart: handleDragStart,
                  onDragOver: handleDragOver,
                  onDragEnd: handleDragEnd,
                  onDragLeave: handleDragLeave,
                  isDragging: draggedIndex,
                  isDragOver: dragOverIndex
              }
            : {
                  onDragStart: () => {},
                  onDragOver: () => {},
                  onDragEnd: () => {},
                  onDragLeave: () => {},
                  isDragging: null,
                  isDragOver: null
              };

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
                                selectedValues.map((value, index) => (
                                    <MultiSelectBadge
                                        key={value}
                                        value={value}
                                        index={index}
                                        localOptions={localOptions}
                                        options={options}
                                        addingNew={addingNew}
                                        variant={variant}
                                        animation={animation}
                                        isAnimating={isAnimating}
                                        onToggle={onToggleOption}
                                        draggable={draggable}
                                        onDragStart={dragHandlers.onDragStart}
                                        onDragOver={dragHandlers.onDragOver}
                                        onDragEnd={dragHandlers.onDragEnd}
                                        onDragLeave={dragHandlers.onDragLeave}
                                        isDragging={dragHandlers.isDragging === index}
                                        isDragOver={dragHandlers.isDragOver === index}
                                    />
                                ))
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-end" ref={containerRef}>
                            <XIcon
                                className="mx-2 h-4 cursor-pointer text-muted-foreground"
                                onClick={event => {
                                    event.stopPropagation();
                                    onClear();
                                }}
                            />
                            {!wrapped && <Separator orientation="vertical" className="flex h-full min-h-6" />}
                            <ChevronDown
                                id="multiSelectToggleIcon"
                                className={cn(
                                    "!pointer-events-none mx-2 h-4 cursor-pointer text-green-50 transition-transform dark:text-green-40",
                                    wrapped && "mt-1"
                                )}
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
