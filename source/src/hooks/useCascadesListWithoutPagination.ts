import { CascadesDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCascadesListWithoutPagination = (disabled?: boolean) => {
    const cascadesDataProvider = new CascadesDataProvider();

    const {
        data: cascadesData,
        isLoading: isCascadesLoading,
        isFetching: isCascadesFetching
    } = useQuery({
        queryKey: ["cascades", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await cascadesDataProvider.getListWithoutPagination("cascades", signal),
        enabled: !disabled,
        select: data => data?.data
    });

    const cascadesLoadingProcess = useMemo(
        () => isCascadesLoading || isCascadesFetching,
        [isCascadesFetching, isCascadesLoading]
    );

    return { cascadesData, isCascadesLoading, cascadesLoadingProcess };
};
