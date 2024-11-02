import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { useGetWalletTransactionsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "../../shared";
import { FilterBar } from "./FilterBar";
import { ShowWalletTransactionsDialog } from "./ShowWalletTransactionsDialog";
// import { useState } from "react";

export const WalletTransactionsList = () => {
    const listContext = useListController({ resource: "transaction" });
    const translate = useTranslate();

    const { columns, chosenId, openShowClicked, setOpenShowClicked } = useGetWalletTransactionsColumns();
    const date = new Date();

    const mockData: Cryptotransactions[] = [
        {
            id: "1",
            amount_accuracy: 10,
            amount_quantity: 100,
            created_at: date.toString(),
            src_wallet: "123",
            dst_wallet: "123",
            currency: "123",
            state: "123",
            type: "123",
            merchant_id: "123",
            tx_id: "123",
            updated_at: date.toString(),
            deleted_at: date.toString(),
            blowfish_id: "AA",
            tx_link: "AA",
            total_fee: 1,
            bandwidth_fee: 1
        },
        {
            id: "2",
            amount_accuracy: 10,
            amount_quantity: 100,
            created_at: date.toString(),
            src_wallet: "123",
            dst_wallet: "123",
            currency: "123",
            state: "123",
            type: "123",
            merchant_id: "123",
            tx_id: "123",
            updated_at: date.toString(),
            deleted_at: date.toString(),
            blowfish_id: "AA",
            tx_link: "AA",
            total_fee: 1,
            bandwidth_fee: 1
        },
        {
            id: "3",
            amount_accuracy: 10,
            amount_quantity: 100,
            created_at: date.toString(),
            src_wallet: "123",
            dst_wallet: "123",
            currency: "123",
            state: "123",
            type: "123",
            merchant_id: "123",
            tx_id: "123",
            updated_at: date.toString(),
            deleted_at: date.toString(),
            blowfish_id: "AA",
            tx_link: "AA",
            total_fee: 1,
            bandwidth_fee: 1
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <FilterBar />
                <ShowWalletTransactionsDialog id={chosenId} open={openShowClicked} onOpenChange={setOpenShowClicked} />
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} data={mockData} total={10} />
                </ListContextProvider>
            </>
        );
    }
};
