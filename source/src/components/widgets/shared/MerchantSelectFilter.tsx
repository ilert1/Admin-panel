import { LoadingAlertDialog } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useMemo } from "react";
import { useInfiniteGetList, useTranslate } from "react-admin";

interface MerchantSelectFilterProps {
    merchant: string;
    onMerchantChanged: (account: string) => void;
    resource: "accounts" | "merchant";
}

type ResourceData<T> = T extends "accounts" ? Account : Merchant;

export const MerchantSelectFilter = ({ merchant, onMerchantChanged, resource }: MerchantSelectFilterProps) => {
    const translate = useTranslate();

    const {
        data: merchantData,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage: merchantNextPage
    } = useInfiniteGetList<ResourceData<typeof resource>>(resource, {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const accountsLoadingProcess = useMemo(() => isFetchingNextPage && hasNextPage, [isFetchingNextPage, hasNextPage]);

    const accountScrollHandler = async (e: React.FormEvent) => {
        const target = e.target as HTMLElement;

        if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1) {
            merchantNextPage();
        }
    };

    const merchantName = useCallback(
        (merchant: ResourceData<typeof resource>) => {
            if (resource === "accounts") {
                return (merchant as Account).meta?.caption || (merchant as Account).owner_id;
            } else if (resource === "merchant") {
                return (merchant as Merchant).name;
            }
        },
        [resource]
    );

    return (
        <Select
            onValueChange={val => (val !== "null" ? onMerchantChanged(val) : onMerchantChanged(""))}
            value={merchant}>
            <SelectTrigger className="text-ellipsis">
                <SelectValue placeholder={translate("resources.transactions.filter.filterAllPlaceholder")} />
            </SelectTrigger>

            <SelectContent align="start" onScrollCapture={accountScrollHandler} onScroll={accountScrollHandler}>
                <SelectItem value="null">{translate("resources.transactions.filter.showAll")}</SelectItem>

                {merchantData?.pages.map(page => {
                    return page.data.map(merchant => (
                        <SelectItem key={merchant.id} value={merchant.id}>
                            <p className="truncate max-w-36">{merchantName(merchant)}</p>
                        </SelectItem>
                    ));
                })}

                {accountsLoadingProcess && (
                    <SelectItem value="null" disabled className="flex max-h-8">
                        <LoadingAlertDialog className="-scale-[.25]" />
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};
