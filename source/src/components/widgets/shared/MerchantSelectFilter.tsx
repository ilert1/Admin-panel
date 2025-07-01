import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ErrorBadge } from "@/components/ui/Input/ErrorBadge";
import { LoadingBlock } from "@/components/ui/loading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";

interface MerchantSelectFilterProps {
    merchant: string;
    onMerchantChanged: (merchant: string) => void;
    resource: "accounts" | "merchant";
    variant?: "outline";
    isLoading?: (loading: boolean) => void;
    error?: string;
    disabled?: boolean;
    modal?: boolean;
}

type ResourceData<T> = T extends "accounts" ? Account : Merchant;

export const MerchantSelectFilter = ({
    merchant,
    onMerchantChanged,
    resource,
    variant,
    isLoading,
    error,
    disabled = false,
    modal = true
}: MerchantSelectFilterProps) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();

    const {
        data: merchantData,
        isFetching,
        isFetched,
        isLoading: isLoadingMerchants
    } = useQuery({
        queryKey: [resource, "getList", "MerchantSelectFilter"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList<ResourceData<typeof resource>>(resource, {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "name", asc: "ASC" },
                signal
            }),
        select: data => data?.data,
        refetchInterval: 60 * 60 * 60
    });

    useEffect(() => {
        if (isLoading) {
            isLoading(isFetching);
        }
    }, [isFetching, isLoading]);

    useEffect(() => {
        if (isFetched && merchant && !merchantName(merchantData?.find(account => account.id === merchant))) {
            onMerchantChanged("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

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
        <Popover open={open} onOpenChange={setOpen} modal={modal}>
            <PopoverTrigger asChild className="mt-0" disabled={disabled}>
                <Button
                    variant="text_btn"
                    role="combobox"
                    aria-expanded={open}
                    disabled={merchantData === undefined || !merchantData?.length || disabled}
                    className={cn(
                        "!mt-0 flex h-9 w-full min-w-36 flex-1 items-center justify-between rounded-4 border border-neutral-40 bg-neutral-0 px-3 py-2 text-start text-sm font-normal ring-offset-background hover:!border-green-40 focus:outline-none active:border-green-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:!text-neutral-80 dark:border-neutral-60 dark:bg-neutral-100 disabled:dark:bg-neutral-90 disabled:dark:!text-neutral-60 [&:is([data-state='open'])>#selectToggleIcon]:rotate-180 [&:is([data-state='open'])]:border-green-50 [&:is([data-state='open'])_#selectToggleIcon]:rotate-180 [&>span]:line-clamp-1 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70",
                        variant === "outline" && "bg-white dark:bg-muted",
                        error && "border-red-40 dark:border-red-40"
                    )}>
                    {isLoadingMerchants ? (
                        <div className="flex w-full items-center justify-center">
                            <LoadingBlock className="!h-5 !w-5" />
                        </div>
                    ) : merchant ? (
                        <span className="text-neutral-80 hover:!text-neutral-80 focus:!text-neutral-80 active:!text-neutral-80 dark:text-neutral-0">
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
                            className="ml-2 h-4 w-4 cursor-pointer text-green-50 transition-transform dark:text-green-40"
                        />
                        {error && (
                            <ErrorBadge
                                errorMessage={error}
                                className="!flex h-4 items-center justify-center !text-red-40 dark:!text-red-40"
                            />
                        )}
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className={cn(
                    "z-[70] min-w-[8rem] overflow-hidden rounded-4 border border-green-50 bg-white p-0 shadow-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-neutral-100 md:max-h-[--radix-popover-content-available-height] md:w-[--radix-popover-trigger-width]"
                    // isTabletOrMobile ? "!max-h-[100px]" : "",
                )}>
                <Command filter={merchantFilter}>
                    <CommandInput
                        className={cn(
                            "cursor-pointer bg-white",
                            variant === "outline" ? "dark:bg-muted" : "dark:bg-neutral-100"
                        )}
                        placeholder={translate("app.ui.actions.search")}
                    />
                    {/* isTabletOrMobile ? "!max-h-[100px]" : "" */}
                    <CommandList>
                        <CommandEmpty className={cn(variant === "outline" ? "dark:bg-muted" : "dark:bg-neutral-100")}>
                            {translate("resources.merchant.notFoundMessage")}
                        </CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value={"null"}
                                className={cn(
                                    "cursor-pointer bg-white",
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
                                        "cursor-pointer bg-white",
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
