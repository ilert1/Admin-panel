import { currenciesIconsMap } from "@/lib/icons/Currencies/currencies";
import { cn } from "@/lib/utils";

export function CurrencyIcon({
    name,
    textSmall = false,
    className = ""
}: {
    name: string;
    textSmall?: boolean;
    className?: string;
}) {
    const IconComponent = currenciesIconsMap[name];

    if (!IconComponent)
        return (
            <span className={cn(`overflow-hidden text-controlElements`, textSmall ? "" : "text-display-4", className)}>
                {name}
            </span>
        );

    return <IconComponent className={className} />;
}
