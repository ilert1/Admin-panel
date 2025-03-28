import { UIEvent, useEffect, useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { useAbortableInfiniteGetList } from "./useAbortableInfiniteGetList";
import { ProviderWithId } from "@/data/providers";

const useTerminalFilter = ({
    selectProvider = () => {}
}: {
    selectProvider: React.Dispatch<React.SetStateAction<string>>;
}) => {
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

    return {
        providersData,
        isFetching,
        providersLoadingProcess,
        providerName,
        onProviderChanged,
        translate,
        providerScrollHandler
    };
};

export default useTerminalFilter;
