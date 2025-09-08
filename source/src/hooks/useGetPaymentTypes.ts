import { PaymentTypeModel } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useQuery } from "@tanstack/react-query";
import { useDataProvider } from "react-admin";

interface useGetPaymentTypesProps {
    provider?: string;
    merchant?: string;
    terminal?: string;
    disabled?: boolean;
}

export const useGetPaymentTypes = (props: useGetPaymentTypesProps) => {
    const { provider, merchant, terminal, disabled } = props;

    const dataProvider = useDataProvider();

    const { data: merchantPaymentTypes, isLoading: isLoadingMerchantPaymentTypes } = useQuery<PaymentTypeModel[]>({
        queryKey: ["merchant_payment_types", merchant],
        enabled: Boolean(merchant) && !disabled,
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getOne("merchant", { id: merchant, signal });
            return res.data.payment_types as PaymentTypeModel[];
        }
    });

    const { data: terminalPaymentTypes, isLoading: isLoadingTerminalPaymentTypes } = useQuery<PaymentTypeModel[]>({
        queryKey: ["terminal_payment_types", terminal],
        enabled: Boolean(terminal) && !disabled,
        queryFn: async ({ signal }) => {
            const res = await dataProvider.getOne("terminals", { id: terminal, signal });
            return res.data.payment_types ? (res.data.payment_types as PaymentTypeModel[]) : [];
        }
    });

    const { data: providerPaymentTypes, isLoading: isLoadingProviderPaymentTypes } = useQuery<PaymentTypeModel[]>({
        queryKey: ["payment_types", "provider", provider],
        enabled: Boolean(provider) && !disabled,
        queryFn: async ({ signal }) => {
            const data = await dataProvider.getOne("provider", { id: provider, signal });
            const types = data.data.payment_types as PaymentTypeModel[];

            // if (!types || types.length === 0) {
            //     const result = await dataProvider.getListWithoutPagination("payment_type", signal);
            //     return result.data as PaymentTypeModel[];
            // }

            return types ?? [];
        }
    });

    const { data: allPaymentTypes, isLoading: isLoadingAllPaymentTypes } = useQuery<PaymentTypeModel[]>({
        queryKey: ["payment_types", "getListWithoutPagination"],
        enabled: !provider && !merchant && !terminal && !disabled,
        queryFn: async ({ signal }) => {
            const result = await dataProvider.getListWithoutPagination("payment_type", signal);
            return result.data as PaymentTypeModel[];
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
