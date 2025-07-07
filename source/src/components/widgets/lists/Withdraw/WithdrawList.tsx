import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { CryptoTransfer } from "../../components/CryptoTransfer";
import { WithdrawListFilter } from "./WithdrawListFilter";
import { useGetWithdrawColumns } from "./Columns";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";

export const WithdrawList = () => {
    const listContext = useAbortableListController<Transaction.Transaction>();

    const { columns, repeatData, cryptoTransferState, isMerchantsLoading, merchantOnly, setCryptoTransferState } =
        useGetWithdrawColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <SyncDisplayedFilters />

                <div
                    className={
                        merchantOnly
                            ? "grid h-full min-h-0 grid-cols-1 grid-rows-[auto_auto_1fr] gap-x-6 lg:grid-flow-col lg:grid-rows-[auto_1fr]"
                            : "flex h-full min-h-0 flex-col"
                    }>
                    <WithdrawListFilter />
                    {listContext.isLoading || !listContext.data || isMerchantsLoading ? (
                        <LoadingBlock />
                    ) : (
                        <>
                            <div className="flex h-full min-h-0 flex-col">
                                <DataTable columns={columns} data={[]} />
                            </div>

                            {merchantOnly && (
                                <div className="row-start-1 mb-6 max-w-80 lg:col-start-2 lg:row-start-2">
                                    <CryptoTransfer
                                        cryptoTransferState={cryptoTransferState}
                                        setCryptoTransferState={setCryptoTransferState}
                                        repeatData={repeatData}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </ListContextProvider>
        </>
    );
};
