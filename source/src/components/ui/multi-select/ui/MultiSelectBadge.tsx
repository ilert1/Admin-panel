import { type VariantProps } from "class-variance-authority";
import { XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { multiSelectVariants, type MultiSelectOption } from "./MultiSelectTypes";

interface MultiSelectBadgeProps extends VariantProps<typeof multiSelectVariants> {
    value: string;
    localOptions: MultiSelectOption[];
    options: MultiSelectOption[];
    addingNew: boolean;
    animation: number;
    isAnimating: boolean;
    onToggle: (value: string) => void;
}

export const MultiSelectBadge: React.FC<MultiSelectBadgeProps> = ({
    value,
    localOptions,
    options,
    addingNew,
    variant,
    animation,
    isAnimating,
    onToggle
}: MultiSelectBadgeProps) => {
    const option = localOptions.find(o => o.value === value);
    const isCustomOption = !options.some(o => o.value === value);
    const IconComponent = option?.icon;

    return (
        <Badge
            className={cn(
                isAnimating ? "animate-bounce" : "",
                multiSelectVariants({ variant }),
                "my-0 overflow-x-hidden bg-muted font-normal text-neutral-90 dark:text-neutral-0",
                isCustomOption ? "border-dashed border-green-40" : "",
                !option && "border-dashed border-red-40"
            )}
            style={{ animationDuration: `${animation}s` }}>
            {IconComponent && <IconComponent className="mr-1 h-4 w-4" small />}
            {addingNew ? (
                <span className="flex max-w-48 flex-col overflow-hidden text-ellipsis break-words text-left">
                    <p>{isCustomOption ? option?.label : option?.label.split("[")[0].trim()}</p>
                    <p className="text-left text-xs text-neutral-70">{option?.value}</p>
                </span>
            ) : (
                <span className="max-w-48 overflow-hidden text-ellipsis break-words">
                    {!option ? <span className="text-red-40">{`! ${value}`}</span> : option?.label}
                </span>
            )}
            <XCircle
                className="ml-2 h-4 w-4 cursor-pointer rounded-full transition-colors hover:bg-red-40"
                onClick={event => {
                    event.stopPropagation();
                    onToggle(value);
                }}
            />
        </Badge>
    );
};
