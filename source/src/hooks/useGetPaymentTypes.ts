import { PaymentTypeRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
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

    const { data: merchantPaymentTypes, isLoading: isLoadingMerchantPaymentTypes } = useQuery<PaymentTypeRead[]>({
        queryKey: ["merchant_payment_types", merchant],
        enabled: Boolean(merchant),
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getOne("merchant", { id: merchant, signal });
            return res.data.payment_types as PaymentTypeRead[];
        }
    });

    const { data: terminalPaymentTypes, isLoading: isLoadingTerminalPaymentTypes } = useQuery<PaymentTypeRead[]>({
        queryKey: ["terminal_payment_types", terminal],
        enabled: Boolean(terminal),
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getOne("terminal", { id: terminal, signal });
            return res.data.payment_types as PaymentTypeRead[];
        }
    });

    const { data: providerPaymentTypes, isLoading: isLoadingProviderPaymentTypes } = useQuery<PaymentTypeRead[]>({
        queryKey: ["payment_types", "provider", provider],
        enabled: Boolean(provider),
        queryFn: async ({ signal }) => {
            const data = await dataProvider.getOne("provider", { id: provider, signal });
            const types = data.data.payment_types as PaymentTypeRead[];

            if (!types || types.length === 0) {
                const result = await dataProvider.getList("payment_type", {
                    pagination: { perPage: 10000, page: 1 },
                    filter: { sort: "code", asc: "ASC" },
                    signal
                });
                return result.data as PaymentTypeRead[];
            }

            return types;
        }
    });

    const { data: allPaymentTypes, isLoading: isLoadingAllPaymentTypes } = useQuery<PaymentTypeRead[]>({
        queryKey: ["payment_types", "useGetPaymentTypes"],
        enabled: !provider && !merchant && !terminal,
        queryFn: async ({ signal }) => {
            const result = await dataProvider.getList("payment_type", {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "code", asc: "ASC" },
                signal
            });
            return result.data as PaymentTypeRead[];
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
