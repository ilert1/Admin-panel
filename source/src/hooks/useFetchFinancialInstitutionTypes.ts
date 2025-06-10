import { FinancialInstitutionProvider } from "@/data/financialInstitution";
import { useQuery } from "@tanstack/react-query";

export const useFetchFinancialInstitutionTypes = () => {
    const financialInstitutionProvider = new FinancialInstitutionProvider();

    const { isLoading, data } = useQuery({
        queryKey: ["financialInstitutionTypes"],
        queryFn: async ({ signal }) =>
            await financialInstitutionProvider.getFinancialInstitutionTypes("financialInstitution", { signal }),
        select: data => data.data
    });

    return { data, isLoading };
};
