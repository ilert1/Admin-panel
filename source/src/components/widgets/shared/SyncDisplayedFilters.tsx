import { useEffect } from "react";
import { useListContext } from "react-admin";

export const SyncDisplayedFilters = () => {
    const { filterValues, displayedFilters, setFilters } = useListContext();

    useEffect(() => {
        if (Object.keys(filterValues).length > 0) {
            setFilters(filterValues, displayedFilters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};
