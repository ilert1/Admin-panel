import { useQuery } from "@tanstack/react-query";
import { useDataProvider } from "react-admin";

interface UseGetPaymentTypesProps {
    resource: "direction" | "terminal" | "merchant" | "provider";
}

export const useGetPaymentTypes = (props: UseGetPaymentTypesProps) => {
    // const { resource } = props;

    const dataProvider = useDataProvider();

    const { data, isLoading } = useQuery({
        queryKey: ["payment_types", "useGetPaymentTypes"],
        queryFn: async ({ signal }) => {
            return await dataProvider.getList("payment_type", {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "code", asc: "ASC" },
                signal
            });
        }
    });

    console.log(data);

    return { data, isLoading };
};
