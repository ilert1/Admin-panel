import { UIEvent, useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslate } from "react-admin";
import { LoadingBalance } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { ProviderWithId } from "@/data/providers";
import { useAbortableInfiniteGetList } from "@/hooks/useAbortableInfiniteGetList";

export const TerminalsListFilter = ({ selectProvider = () => {} }: { selectProvider: (provider: string) => void }) => {
    const {
        data: providersData,
        isFetchingNextPage,
        hasNextPage,
        isFetching,
        isFetched,
        fetchNextPage: providersNextPage
    } = useAbortableInfiniteGetList<ProviderWithId>("provider", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const translate = useTranslate();

    const [providerName, setProviderName] = useState(localStorage.getItem("providerInTerminals") || "");
    const providersLoadingProcess = useMemo(() => isFetchingNextPage && hasNextPage, [isFetchingNextPage, hasNextPage]);

    const onProviderChanged = (provider: string) => {
        localStorage.setItem("providerInTerminals", provider);
        setProviderName(provider);
        selectProvider(provider);
    };

    useEffect(() => {
        if (
            isFetched &&
            providersData?.pages.find(providerItem => providerItem.data.find(item => item.name === providerName))
        ) {
            selectProvider(providerName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersLoadingProcess, providersData?.pages]);

    const providerScrollHandler = async (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            providersNextPage();
        }
    };

    return (
        <div className="flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:items-end">
            <div className="flex min-w-36 flex-1 flex-col gap-1">
                <Label className="mb-0" variant="title-2">
                    {translate("resources.terminals.selectHeader")}
                </Label>

                <Select onValueChange={onProviderChanged} value={providerName}>
                    <SelectTrigger className="text-ellipsis">
                        <SelectValue placeholder={translate("resources.terminals.selectPlaceholder")} />
                    </SelectTrigger>

                    <SelectContent align="start" onScrollCapture={providerScrollHandler}>
                        {providersData?.pages.map(page => {
                            return page.data.map(provider => (
                                <SelectItem key={provider.name} value={provider.name}>
                                    <p className="max-w-36 truncate">{provider.name}</p>
                                </SelectItem>
                            ));
                        })}

                        {(providersLoadingProcess || (!providersLoadingProcess && isFetching && !providersData)) && (
                            <SelectItem value="null" disabled className="h-8">
                                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                                    <LoadingBalance className="h-[20px] w-[20px] overflow-hidden" />
                                </div>
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
