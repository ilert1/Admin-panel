import { currenciesIconsMap } from "@/lib/icons/Currencies/currencies";

export function CurrencyIcon({ name, textSmall = false }: { name: string; folder?: string; textSmall?: boolean }) {
    const icon = currenciesIconsMap[name];
    if (!icon)
        return (
            <span className={`text-controlElements ${textSmall ? "" : "text-display-4"} overflow-hidden`}>{name}</span>
        );

    return icon;
}
