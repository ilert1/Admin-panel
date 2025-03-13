import { UIEvent, useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInfiniteGetList, useTranslate } from "react-admin";
import { LoadingBalance } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { ProviderWithId } from "@/data/providers";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";

export const TerminalsListFilter = ({ selectProvider = () => {} }: { selectProvider: (provider: string) => void }) => {
    const {
        data: providersData,
        isFetchingNextPage,
        hasNextPage,
        isFetching,
        isFetched,
        fetchNextPage: providersNextPage
    } = useInfiniteGetList<ProviderWithId>("provider", {
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
        <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
            <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-52">
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
                                    <p className="truncate max-w-36">{provider.name}</p>
                                </SelectItem>
                            ));
                        })}

                        {(providersLoadingProcess || (!providersLoadingProcess && isFetching && !providersData)) && (
                            <SelectItem value="null" disabled className="h-8">
                                <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                                    <LoadingBalance className=" w-[20px] h-[20px] overflow-hidden" />
                                </div>
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
