import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { CurrencyWithId } from "@/data/currencies";
import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CurrencySelectProps {
    value: string;
    onChange: (value: string) => void;
    currencies: CurrencyWithId[] | Currency[];
}

export const CurrencySelect = ({ value, onChange, currencies }: CurrencySelectProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="mt-0">
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {value
                        ? currencies.find((currency: { code: string }) => currency.code === value)?.code
                        : "Select currency..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search currency..." />
                    <CommandList>
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                            {currencies.map(currency => (
                                <CommandItem
                                    key={currency.code}
                                    value={currency.code}
                                    onSelect={currentValue => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}>
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === currency.code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {currency.code}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
