import { ListContextProvider, useListController, usePermissions } from "react-admin";
import { useGetWalletTransactionsColumns } from "./Columns";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletTransactionsFilter } from "./WalletTransactionsFilter";
import { ConfirmDialog } from "./ConfirmDialog";

export const WalletTransactionsList = () => {
    const { permissions } = usePermissions();

    const listContext = useListController({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction",
        queryOptions: {
            refetchInterval: 10000
        }
    });

    const { columns, chosenId, confirmOpen, setConfirmOpen } = useGetWalletTransactionsColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <WalletTransactionsFilter />
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
            <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} id={chosenId} />
        </>
    );
};

// const [elem, setElem] = useState<ReactNode>(undefined);
// setTimeout(() => {
//     setElem(<DataTable columns={columns} />);
// }, 3000);
// console.log(elem);
// {listContext.isLoading || !elem ? <LoadingBlock /> : elem}
