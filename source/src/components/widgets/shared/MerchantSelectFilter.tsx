import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { useGetList, useTranslate } from "react-admin";

interface MerchantSelectFilterProps {
    merchant: string;
    onMerchantChanged: (merchant: string) => void;
    resource: "accounts" | "merchant";
    className?: string;
}

type ResourceData<T> = T extends "accounts" ? Account : Merchant;

export const MerchantSelectFilter = ({
    merchant,
    onMerchantChanged,
    resource,
    className = ""
}: MerchantSelectFilterProps) => {
    const translate = useTranslate();

    const { data: merchantData, isFetching } = useGetList<ResourceData<typeof resource>>(
        resource,
        {
            pagination: { perPage: 10000, page: 1 },
            filter: { sort: "name", asc: "ASC" }
        },
        { refetchInterval: 60 * 60 }
    );

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

    const merchantFilter = (value: string, search: string) => {
        const extendValue = merchantName(merchantData?.find(account => account.id === value));
        if (extendValue && extendValue.toLowerCase().includes(search.toLocaleLowerCase())) return 1;
        return 0;
    };

    const onSelectMerchant = (currentValue: string) => {
        onMerchantChanged(currentValue);
        setOpen(false);
    };

    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="clearBtn"
                    role="combobox"
                    aria-expanded={open}
                    disabled={isFetching}
                    className={
                        "w-full font-normal justify-between flex h-9 flex-1 items-center text-start border border-neutral-40 dark:border-neutral-60 rounded-4 hover:border-green-20 bg-neutral-0 px-3 py-2 text-sm ring-offset-background [&:is([data-state='open'])]:border-green-50 active:border-green-50 disabled:cursor-not-allowed [&>span]:line-clamp-1 focus:outline-none [&[data-placeholder]]:dark:text-neutral-70 [&[data-placeholder]]:text-neutral-60 [&:is([data-state='open'])>#selectToggleIcon]:rotate-180 " +
                        className
                    }>
                    {merchant ? (
                        <span className="text-neutral-80 hover:!text-neutral-80 focus:!text-neutral-80 active:!text-neutral-80">
                            {merchantName(merchantData?.find(account => account.id === merchant))}
                        </span>
                    ) : (
                        <span className="text-neutral-70 hover:!text-neutral-70 focus:!text-neutral-70 active:!text-neutral-70">
                            {translate("resources.transactions.filter.filterAllPlaceholder")}
                        </span>
                    )}
                    <ChevronDown
                        id="selectToggleIcon"
                        className="h-4 w-4 text-green-50 dark:text-green-40 transition-transform"
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className={
                    "md:w-[--radix-popover-trigger-width] md:max-h-[--radix-popover-content-available-height] p-0 z-[70] min-w-[8rem] overflow-hidden rounded-4 border border-green-50 bg-white dark:bg-neutral-0 shadow-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 " +
                    className
                }>
                <Command className="" filter={merchantFilter}>
                    <CommandInput className="" placeholder={translate("app.ui.actions.search")} />

                    <CommandList className="">
                        <CommandGroup>
                            <CommandItem
                                value={"null"}
                                onSelect={() => {
                                    onMerchantChanged("");
                                    setOpen(false);
                                }}>
                                {translate("resources.transactions.filter.showAll")}
                                <Check
                                    className={cn(
                                        "ml-auto mr-1 h-4 w-4",
                                        merchant === "" ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>

                            {merchantData?.map(account => (
                                <CommandItem key={account.id} value={account.id} onSelect={onSelectMerchant}>
                                    {merchantName(account)}
                                    <Check
                                        className={cn(
                                            "ml-auto mr-1 h-4 w-4",
                                            merchant === account.id ? "opacity-100" : "opacity-0"
                                        )}
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
