import { useListController, ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { CryptoTransfer } from "../../components/CryptoTransfer";
import { WithdrawListFilter } from "./WithdrawListFilter";
import { useGetWithdrawColumns } from "./Columns";
import { ShowMerchantSheet } from "../Merchants/ShowMerchantSheet";

export const WithdrawList = () => {
    const listContext = useListController<Transaction.Transaction>();

    const {
        columns,
        repeatData,
        cryptoTransferState,
        isLoading,
        merchantOnly,
        chosenId,
        showMerchants,
        setShowMerchants,
        setCryptoTransferState
    } = useGetWithdrawColumns();

    if (listContext.isLoading || !listContext.data || isLoading) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div
                        className={
                            merchantOnly
                                ? "grid gap-x-6 grid-rows-[auto_auto_1fr] lg:grid-rows-[auto_1fr] grid-cols-1 lg:grid-flow-col h-full min-h-0"
                                : "flex flex-col h-full min-h-0"
                        }>
                        <WithdrawListFilter />

                        <div className="h-full flex flex-col min-h-0">
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
                <ShowMerchantSheet id={chosenId} open={showMerchants} onOpenChange={setShowMerchants} />
            </>
        );
    }
};
