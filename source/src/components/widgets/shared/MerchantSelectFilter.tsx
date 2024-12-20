import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useState } from "react";
import { useGetList, useTranslate } from "react-admin";

interface MerchantSelectFilterProps {
    merchant: string;
    onMerchantChanged: (merchant: string) => void;
    resource: "accounts" | "merchant";
}

type ResourceData<T> = T extends "accounts" ? Account : Merchant;

export const MerchantSelectFilter = ({ merchant, onMerchantChanged, resource }: MerchantSelectFilterProps) => {
    const translate = useTranslate();

    const { data: merchantData } = useGetList<ResourceData<typeof resource>>(resource, {
        pagination: { perPage: 10000, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const [open, setOpen] = useState(false);

    const merchantName = useCallback(
        (merchant: ResourceData<typeof resource> | undefined) => {
            if (resource === "accounts") {
                return (merchant as Account)?.meta?.caption || (merchant as Account)?.owner_id;
            } else if (resource === "merchant") {
                return (merchant as Merchant)?.name;
            }
        },
        [resource]
    );

    return (
        // <Select
        //     onValueChange={val => (val !== "null" ? onMerchantChanged(val) : onMerchantChanged(""))}
        //     value={merchant}>
        //     <SelectTrigger className="text-ellipsis">
        //         <SelectValue placeholder={translate("resources.transactions.filter.filterAllPlaceholder")} />
        //     </SelectTrigger>

        //     <SelectContent align="start">
        //         <SelectItem value="null">{translate("resources.transactions.filter.showAll")}</SelectItem>

        //         {merchantData?.map(merchant => (
        //             <SelectItem key={merchant.id} value={merchant.id}>
        //                 <p className="truncate max-w-36">{merchantName(merchant)}</p>
        //             </SelectItem>
        //         ))}

        //         {merchantsLoadingProcess && (
        //             <SelectItem value="null" disabled className="flex max-h-8">
        //                 <LoadingAlertDialog className="-scale-[.25]" />
        //             </SelectItem>
        //         )}
        //     </SelectContent>
        // </Select>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {merchant
                        ? merchantName(merchantData?.find(account => account.id === merchant))
                        : translate("resources.transactions.filter.filterAllPlaceholder")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command
                    filter={(value, search) => {
                        const extendValue = merchantName(merchantData?.find(account => account.id === value));
                        if (extendValue && extendValue.toLowerCase().includes(search.toLocaleLowerCase())) return 1;
                        return 0;
                    }}>
                    <CommandInput placeholder={translate("app.ui.actions.search")} />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                value={"null"}
                                onSelect={() => {
                                    onMerchantChanged("");
                                    setOpen(false);
                                }}>
                                {translate("resources.transactions.filter.showAll")}
                            </CommandItem>
                            {merchantData?.map(account => (
                                <CommandItem
                                    key={account.id}
                                    value={account.id}
                                    onSelect={currentValue => {
                                        console.log(currentValue);
                                        onMerchantChanged(currentValue);
                                        setOpen(false);
                                    }}>
                                    {merchantName(account)}
                                    <Check
                                        className={cn("ml-auto", merchant === account.id ? "opacity-100" : "opacity-0")}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
