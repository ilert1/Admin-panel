import { UIEvent, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInfiniteGetList, useTranslate } from "react-admin";
import { LoadingAlertDialog } from "@/components/ui/loading";

export const TerminalsListFilter = ({ selectProvider = () => {} }: { selectProvider: (provider: string) => void }) => {
    const {
        data: providersData,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage: providersNextPage
    } = useInfiniteGetList("provider", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const translate = useTranslate();

    const [providerName, setProviderName] = useState("");
    const providersLoadingProcess = useMemo(() => isFetchingNextPage && hasNextPage, [isFetchingNextPage, hasNextPage]);

    const onProviderChanged = (provider: string) => {
        setProviderName(provider);
        selectProvider(provider);
    };

    const providerScrollHandler = async (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            providersNextPage();
        }
    };

    return (
        <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
            <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-52">
                <span className="md:text-nowrap">{translate("resources.terminals.selectHeader")}</span>

                <Select onValueChange={onProviderChanged} value={providerName}>
                    <SelectTrigger className="text-ellipsis">
                        <SelectValue placeholder={translate("resources.terminals.selectPlaceholder")} />
                    </SelectTrigger>

                    <SelectContent align="start" onScrollCapture={providerScrollHandler}>
                        {providersData?.pages.map(page => {
                            return page.data.map(provider => (
                                <SelectItem key={provider.name} value={provider.name}>
                                    <p className="truncate max-w-36">{provider.name}</p>
                                </SelectItem>
                            ));
                        })}

                        {providersLoadingProcess && (
                            <SelectItem value="null" disabled className="flex max-h-8">
                                <LoadingAlertDialog className="-scale-[.25]" />
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
