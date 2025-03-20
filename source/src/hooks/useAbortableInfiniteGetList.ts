import { useEffect, useRef, useMemo } from "react";
import { RaRecord, useInfiniteGetList, GetListParams, UseInfiniteGetListHookValue } from "react-admin";

export const useAbortableInfiniteGetList = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetListParams>
): UseInfiniteGetListHookValue<RecordType> => {
    const abortControllerRef = useRef(new AbortController());

    useEffect(() => {
        return () => abortControllerRef.current.abort();
    }, []);

    const infiniteListController = useInfiniteGetList<RecordType>(resource, {
        ...params,
        filter: {
            ...params.filter,
            signal: abortControllerRef.current.signal // Передаем signal в filter
        }
    });

    return useMemo(() => infiniteListController, [infiniteListController]);
};
