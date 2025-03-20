import { useListController, ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TransactionListFilter } from "./TransactionListFilter";
import { useGetTransactionColumns } from "./Columns";

export const TransactionList = () => {
    const listContext = useListController<Transaction.TransactionView>({ resource: "transactions/view" });
    const { columns } = useGetTransactionColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <div className="mb-4 mt-5">
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

                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
