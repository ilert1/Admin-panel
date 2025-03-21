import { useEffect, useMemo, useRef } from "react";
import { useListController, ListControllerProps, ListControllerResult, RaRecord } from "react-admin";

export const useAbortableListController = <RecordType extends RaRecord>(
    props: ListControllerProps<RecordType> = {}
): ListControllerResult<RecordType> => {
    const abortControllerRef = useRef(new AbortController());

    useEffect(() => {
        const abortController = abortControllerRef.current;
        return () => abortController.abort();
    }, []);

    const listController = useListController<RecordType>({
        ...props,
        filter: {
            ...props.filter,
            signal: abortControllerRef.current.signal
        }
    });

    return useMemo(() => listController, [listController]);
};
