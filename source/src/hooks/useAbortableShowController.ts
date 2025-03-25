import { useEffect, useMemo, useRef } from "react";
import { useShowController, ShowControllerProps, ShowControllerResult, RaRecord } from "react-admin";

export const useAbortableShowController = <RecordType extends RaRecord>(
    props: ShowControllerProps<RecordType>
): ShowControllerResult<RecordType> => {
    const abortControllerRef = useRef(new AbortController());

    useEffect(() => {
        const abortController = abortControllerRef.current;
        return () => abortController.abort();
    }, []);

    const showController = useShowController<RecordType>({
        ...props,
        queryOptions: {
            ...props.queryOptions,
            meta: {
                ...(props.queryOptions?.meta || {}),
                signal: abortControllerRef.current.signal
            }
        }
    });

    return useMemo(() => showController, [showController]);
};
