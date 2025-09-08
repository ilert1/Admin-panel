import { useEffect, useRef, useMemo } from "react";
import { RaRecord, useInfiniteGetList, GetListParams, UseInfiniteGetListHookValue } from "react-admin";

export const useAbortableInfiniteGetList = <RecordType extends RaRecord>(
    resource: string,
    params: Partial<GetListParams>,
    refetchOnWindowFocus: boolean = false
): UseInfiniteGetListHookValue<RecordType> => {
    const abortControllerRef = useRef(new AbortController());

    useEffect(() => {
        const abortController = abortControllerRef.current;
        return () => abortController.abort();
    }, []);

    const infiniteListController = useInfiniteGetList<RecordType>(
        resource,
        {
            ...params,
            filter: {
                ...params.filter,
                signal: abortControllerRef.current.signal // Передаем signal в filter
            }
        },
        { refetchOnWindowFocus: refetchOnWindowFocus, refetchOnMount: refetchOnWindowFocus }
    );

    return useMemo(() => infiniteListController, [infiniteListController]);
};
