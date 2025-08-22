import { type VariantProps } from "class-variance-authority";
import { XCircle, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { multiSelectVariants, type MultiSelectOption } from "./MultiSelectTypes";

interface MultiSelectBadgeProps extends VariantProps<typeof multiSelectVariants> {
    value: string;
    index: number;
    localOptions: MultiSelectOption[];
    options: MultiSelectOption[];
    addingNew: boolean;
    animation: number;
    isAnimating: boolean;
    draggable: boolean;
    onToggle: (value: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    onDragLeave: () => void;
    isDragging: boolean;
    isDragOver: boolean;
}

export const MultiSelectBadge: React.FC<MultiSelectBadgeProps> = ({
    value,
    index,
    localOptions,
    options,
    addingNew,
    variant,
    animation,
    isAnimating,
    draggable,
    onToggle,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragLeave,
    isDragging,
    isDragOver
}: MultiSelectBadgeProps) => {
    const option = localOptions.find(o => o.value === value);
    const isCustomOption = !options.some(o => o.value === value);
    const IconComponent = option?.icon;

    const handleDragStart = (e: React.DragEvent) => {
        if (!draggable) return;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", "");
        onDragStart(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!draggable) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOver(index);
    };

    const handleDragEnter = (e: React.DragEvent) => {
        if (!draggable) return;
        e.preventDefault();
        onDragOver(index);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (!draggable) return;
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            onDragLeave();
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        if (!draggable) return;
        e.preventDefault();
        onDragEnd();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDragEndGlobal = (_e: React.DragEvent) => {
        if (!draggable) return;
        onDragEnd();
    };

    return (
        <Badge
            onClick={() => {}}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEndGlobal}
            className={cn(
                isAnimating ? "animate-bounce" : "",
                multiSelectVariants({ variant }),
                "my-0 select-none overflow-x-hidden bg-muted font-normal text-neutral-90 dark:text-neutral-0",
                "group flex items-center transition-all duration-200",
                isCustomOption ? "border-dashed border-green-40" : "",
                !option && "border-dashed border-red-40",
                draggable && "cursor-move",
                draggable && isDragging && "z-50 opacity-50 shadow-lg",
                draggable && isDragOver && !isDragging && "scale-95 ring-2 ring-green-40 ring-opacity-50"
            )}
            style={{ animationDuration: `${animation}s` }}>
            {draggable && (
                <GripVertical
                    className={cn(
                        "mr-1 h-3 w-3 flex-shrink-0 opacity-30 transition-all duration-200 group-hover:opacity-60"
                    )}
                />
            )}
            {IconComponent && <IconComponent className="mr-1 h-4 w-4 flex-shrink-0" small />}
            <div className="min-w-0 flex-1">
                {addingNew ? (
                    <span className="flex flex-col overflow-hidden text-ellipsis break-words text-left">
                        <p className="truncate">
                            {isCustomOption ? option?.label : option?.label.split("[")[0].trim()}
                        </p>
                        <p className="truncate text-left text-xs text-neutral-70">{option?.value}</p>
                    </span>
                ) : (
                    <span className="truncate">
                        {!option ? <span className="text-red-40">{`! ${value}`}</span> : option?.label}
                    </span>
                )}
            </div>
            <XCircle
                data-testid="x-circle"
                className="ml-2 h-4 w-4 flex-shrink-0 cursor-pointer rounded-full transition-colors hover:bg-red-40"
                onClick={event => {
                    event.stopPropagation();
                    onToggle(value);
                }}
            />
        </Badge>
    );
};
