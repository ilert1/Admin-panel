import { BaseDataProvider } from "@/data";
import { useEffect, useState } from "react";

export const useGetAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        const dataProvider = new BaseDataProvider();
        const getAccounts = async () => {
            try {
                const data = await dataProvider.getListWithoutPagination("account");
                setAccounts(data.data);
                setIsLoading(false);
            } catch (error) {}
        };
        getAccounts();
    }, []);

    return { isLoading, accounts };
};
