import { useTranslate, useListController, ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { TransactionShow } from "@/components/widgets/show";
import { TextField } from "@/components/ui/text-field";
import { Loading } from "@/components/ui/loading";
import { TransactionListFilter } from "./TransactionListFilter";
import { useState } from "react";
import { useGetTransactionColumns } from "./Columns";

export const TransactionList = () => {
    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();

    const [typeTabActive, setTypeTabActive] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get("filter") ? JSON.parse(params.get("filter") as string).order_type : "";
    });

    const { columns, isLoading, showOpen, setShowOpen, showTransactionId } = useGetTransactionColumns();

    if (listContext.isLoading || !listContext.data || isLoading) {
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

                    <DataTable data={[]} columns={columns} />
                </ListContextProvider>

                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col border-0"
                        tabIndex={-1}
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                        close={false}>
                        <SheetHeader className="p-[42px] pb-[24px] flex-shrink-0">
                            <div>
                                <div className="flex justify-between items-center pb-2">
                                    <SheetTitle className="text-display-1">
                                        {translate("app.ui.transactionHistory")}
                                    </SheetTitle>
                                    <button
                                        onClick={() => setShowOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                        <XIcon className="h-[28px] w-[28px]" />
                                    </button>
                                </div>
                                <TextField text={showTransactionId} copyValue />
                            </div>
                        </SheetHeader>

                        <div className="flex-1 overflow-auto" tabIndex={-1}>
                            <SheetDescription></SheetDescription>
                            <TransactionShow id={showTransactionId} type="compact" />
                        </div>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
