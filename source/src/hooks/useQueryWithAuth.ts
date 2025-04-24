import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useCheckAuth } from "react-admin";

type QueryWithAuthOptions<TData = unknown, TError = Error, TSelected = TData> = Omit<
    UseQueryOptions<TData, TError, TSelected>,
    "queryFn"
> & {
    queryFn: (context: { signal?: AbortSignal }) => Promise<TData>;
};

export function useQueryWithAuth<TData = unknown, TError = Error, TSelected = TData>(
    options: QueryWithAuthOptions<TData, TError, TSelected>
) {
    const { queryFn, select, enabled = true, retry = 1, ...queryOptions } = options;
    const checkAuth = useCheckAuth();

    const wrappedQueryFn = async (context: { signal?: AbortSignal }) => {
        if (!enabled) {
            throw new Error("Query is disabled");
        }

        try {
            await checkAuth();
            return await queryFn(context);
        } catch (error) {
            if (isUnauthorizedError(error)) {
                await checkAuth({ forceRefresh: true });
                return await queryFn(context);
            }
            throw error;
        }
    };

    return useQuery({
        ...queryOptions,
        queryFn: wrappedQueryFn,
        select,
        enabled,
        retry
    });
}

// Вспомогательные функции
function isUnauthorizedError(error: unknown): boolean {
    return (
        (error as any)?.status === 401 ||
        (error as any)?.code === "UNAUTHORIZED" ||
        (error as any)?.response?.status === 401
    );
}
