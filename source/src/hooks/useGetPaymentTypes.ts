import { useQuery } from "@tanstack/react-query";
import { useDataProvider } from "react-admin";

interface useGetPaymentTypesProps {
    provider?: string;
    merchant?: string;
    terminal?: string;
}

export const useGetPaymentTypes = (props: useGetPaymentTypesProps) => {
    const { provider, merchant, terminal } = props;
    const dataProvider = useDataProvider();

    const { data: merchantPaymentTypes, isLoading: isLoadingMerchantPaymentTypes } = useQuery({
        queryKey: ["merchant_payment_types", merchant],
        enabled: Boolean(merchant),
        queryFn: async ({ signal }) => await dataProvider.getOne("merchant", { id: merchant, signal }),
        select: data => data.data.payment_types
    });

    const { data: terminalPaymentTypes, isLoading: isLoadingTerminalPaymentTypes } = useQuery({
        queryKey: ["terminal_payment_types", terminal],
        enabled: Boolean(terminal),
        queryFn: async ({ signal }) => await dataProvider.getOne("terminal", { id: terminal, signal }),
        select: data => data.data.payment_types
    });

    const { data: providerPaymentTypes, isLoading: isLoadingProviderPaymentTypes } = useQuery({
        queryKey: ["payment_types", "provider", provider],
        enabled: Boolean(provider),
        queryFn: async ({ signal }) => {
            await dataProvider.getOne("provider", { id: provider, signal }).then(async data => {
                const types = data.data.payment_types;

                if (!types || types.length === 0) {
                    // fallback
                    const result = await dataProvider.getList("payment_type", {
                        pagination: { perPage: 10000, page: 1 },
                        filter: { sort: "code", asc: "ASC" },
                        signal
                    });

                    return result.data ?? [];
                }

                return types ?? [];
            });
        }
    });
    console.log(providerPaymentTypes);

    const { data: allPaymentTypes, isLoading: isLoadingAllPaymentTypes } = useQuery({
        queryKey: ["payment_types", "useGetPaymentTypes"],
        enabled: !provider && !merchant && !terminal,
        queryFn: async ({ signal }) => {
            return await dataProvider.getList("payment_type", {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "code", asc: "ASC" },
                signal
            });
        }
    });

    return {
        merchantPaymentTypes,
        isLoadingMerchantPaymentTypes,
        terminalPaymentTypes,
        isLoadingTerminalPaymentTypes,
        providerPaymentTypes,
        isLoadingProviderPaymentTypes,
        allPaymentTypes,
        isLoadingAllPaymentTypes
    };
};
