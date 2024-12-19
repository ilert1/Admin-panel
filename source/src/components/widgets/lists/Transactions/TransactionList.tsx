import { useListController, ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { TransactionListFilter } from "./TransactionListFilter";
import { useState } from "react";
import { useGetTransactionColumns } from "./Columns";
import { ShowTransactionSheet } from "./ShowTransactionSheet";

export const TransactionList = () => {
    const listContext = useListController<Transaction.TransactionView>({ resource: "transactions/view" });

    const [typeTabActive, setTypeTabActive] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get("filter") ? JSON.parse(params.get("filter") as string).order_type : "";
    });

    const { columns, showOpen, setShowOpen, showTransactionId } = useGetTransactionColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div className="mb-6 mt-5">
                        <TransactionListFilter
                            typeTabActive={typeTabActive}
                            setTypeTabActive={setTypeTabActive}
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

                    <DataTable columns={columns} />
                </ListContextProvider>

                <ShowTransactionSheet id={showTransactionId} open={showOpen} onOpenChange={setShowOpen} />
            </>
        );
    }
};
