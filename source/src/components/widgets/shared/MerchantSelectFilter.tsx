import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ErrorBadge } from "@/components/ui/Input/ErrorBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useGetList, useTranslate } from "react-admin";

interface MerchantSelectFilterProps {
    merchant: string;
    onMerchantChanged: (merchant: string) => void;
    resource: "accounts" | "merchant";
    variant?: "outline";
    isLoading?: (loading: boolean) => void;
    error?: string;
    disabled?: boolean;
}

type ResourceData<T> = T extends "accounts" ? Account : Merchant;

export const MerchantSelectFilter = ({
    merchant,
    onMerchantChanged,
    resource,
    variant,
    isLoading,
    error,
    disabled = false
}: MerchantSelectFilterProps) => {
    const translate = useTranslate();

    const { data: merchantData, isFetching } = useGetList<ResourceData<typeof resource>>(
        resource,
        {
            pagination: { perPage: 10000, page: 1 },
            filter: { sort: "name", asc: "ASC" }
        },
        { refetchInterval: 60 * 60 * 60 }
    );

    useEffect(() => {
        if (isLoading) {
            isLoading(isFetching);
        }
    }, [isFetching, isLoading]);

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
            <PopoverTrigger asChild className="mt-0" disabled={disabled}>
                <Button
                    variant="text_btn"
                    role="combobox"
                    aria-expanded={open}
                    disabled={merchantData === undefined || !merchantData.length}
                    className={cn(
                        "hover:!border-green-40 w-full font-normal justify-between flex h-9 flex-1 items-center text-start border border-neutral-40 dark:border-neutral-60 rounded-4 bg-neutral-0 dark:bg-neutral-100 px-3 py-2 text-sm ring-offset-background [&:is([data-state='open'])]:border-green-50 active:border-green-50 disabled:cursor-not-allowed [&>span]:line-clamp-1 focus:outline-none [&[data-placeholder]]:dark:text-neutral-70 [&[data-placeholder]]:text-neutral-60 [&:is([data-state='open'])>#selectToggleIcon]:rotate-180 !mt-0 ",
                        variant === "outline" && "bg-white dark:bg-muted",
                        error && "border-red-40 dark:border-red-40"
                    )}>
                    {merchant ? (
                        <span className="text-neutral-80 dark:text-neutral-0 hover:!text-neutral-80 focus:!text-neutral-80 active:!text-neutral-80">
                            {merchantName(merchantData?.find(account => account.id === merchant))}
                        </span>
                    ) : (
                        <span className="text-neutral-70 hover:!text-neutral-70 focus:!text-neutral-70 active:!text-neutral-70">
                            {translate("resources.transactions.filter.filterAllPlaceholder")}
                        </span>
                    )}
                    <div className="flex items-center gap-2">
                        <ChevronDown
                            id="selectToggleIcon"
                            className="h-4 w-4 text-green-50 dark:text-green-40 transition-transform"
                        />
                        {error && (
                            <ErrorBadge
                                errorMessage={error}
                                className="!flex items-center justify-center h-4 !text-red-40 dark:!text-red-40"
                            />
                        )}
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className={cn(
                    "md:w-[--radix-popover-trigger-width] md:max-h-[--radix-popover-content-available-height] p-0 z-[70] min-w-[8rem] overflow-hidden rounded-4 border border-green-50 bg-white dark:bg-neutral-100 shadow-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    // isTabletOrMobile ? "!max-h-[100px]" : "",
                )}>
                <Command filter={merchantFilter}>
                    <CommandInput
                        className={cn(
                            "bg-white cursor-pointer",
                            variant === "outline" ? "dark:bg-muted" : "dark:bg-neutral-100"
                        )}
                        placeholder={translate("app.ui.actions.search")}
                    />
                    {/* isTabletOrMobile ? "!max-h-[100px]" : "" */}
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                value={"null"}
                                className={cn(
                                    "bg-white cursor-pointer",
                                    variant === "outline" ? "dark:bg-muted" : "dark:bg-neutral-100"
                                )}
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
                                <CommandItem
                                    key={account.id}
                                    value={account.id}
                                    onSelect={onSelectMerchant}
                                    className={cn(
                                        "bg-white cursor-pointer",
                                        variant === "outline" ? "dark:bg-muted" : "dark:bg-neutral-100"
                                    )}>
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
