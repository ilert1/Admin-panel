import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TransactionListFilter } from "./TransactionListFilter";
import { useGetTransactionColumns } from "./Columns";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";

export const TransactionList = () => {
    const listContext = useAbortableListController<Transaction.TransactionView>({ resource: "transactions/view" });
    const { columns, isMerchantsLoading } = useGetTransactionColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <SyncDisplayedFilters />

                <div className="mb-4">
                    <TransactionListFilter
                    // setChartOpen={setChartOpen}
                    // chartOpen={chartOpen}
                    />
                </div>
                {/* <div className="w-full mb-6 overflow-y-hidden">
                        <BarChart
                            startDate={startDate}
                            endDate={endDate}
                            typeTabActive={typeTabActive}
                            open={chartOpen}    
                        />
                    </div> */}

                {listContext.isLoading || isMerchantsLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
