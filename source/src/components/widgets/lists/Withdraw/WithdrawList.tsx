import { useListController, ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { CryptoTransfer } from "../../components/CryptoTransfer";
import { WithdrawListFilter } from "./WithdrawListFilter";
import { useGetWithdrawColumns } from "./Columns";

export const WithdrawList = () => {
    const listContext = useListController<Transaction.Transaction>();

    const { columns, repeatData, cryptoTransferState, setCryptoTransferState, isLoading, merchantOnly } =
        useGetWithdrawColumns();

    if (listContext.isLoading || !listContext.data || isLoading) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div
                        className={
                            merchantOnly
                                ? "grid gap-x-6 lg:grid-cols-1 [grid-template-rows: auto 1fr 1fr;] grid-cols-1 lg:grid-rows-1 lg:grid-flow-col"
                                : "flex flex-col"
                        }>
                        <div>
                            <WithdrawListFilter />
                        </div>

                        <div>
                            <DataTable columns={columns} data={[]} />
                        </div>

                        {merchantOnly && (
                            <div className="max-w-80 mb-6 row-start-1 lg:col-start-2 lg:row-start-2">
                                <CryptoTransfer
                                    cryptoTransferState={cryptoTransferState}
                                    setCryptoTransferState={setCryptoTransferState}
                                    repeatData={repeatData}
                                />
                            </div>
                        )}
                    </div>
                </ListContextProvider>
            </>
        );
    }
};
