import { ListContextProvider, useListController, useShowController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";
import { useEffect, useState } from "react";
import { TransactionShowDialog } from "./TransactionShowDialog";

interface AccountShowProps {
    id: string;
}

export const AccountShow = ({ id }: AccountShowProps) => {
    const translate = useTranslate();

    const context = useShowController({ resource: "accounts", id });

    const { historyColumns, chosenId, transcationInfoOpen, setTransactionInfoOpen } = useGetAccountShowColumns();
    const [balance, setBalance] = useState<string>("");

    const listContext = useListController<AccountHistory>({
        resource: "operations",
        filter: { accountId: id },
        disableSyncWithLocation: true
    });

    useEffect(() => {
        const contextData = listContext.data;
        if (!context.isLoading && contextData && contextData.at(0)) {
            setBalance(listContext.data[0].amount_value);
        } else {
            setBalance("0");
        }
    }, [context.isLoading, listContext.data]);

    useEffect(() => {
        if (chosenId) {
            setTransactionInfoOpen(true);
        }
    }, [chosenId, setTransactionInfoOpen]);

    if (context.isLoading || !context.record || listContext.isLoading || !listContext.data) {
        return <LoadingBlock />;
    }

    return (
        <div className="mx-6 h-full min-h-[300px] flex flex-col">
            <div className="flex justify-between px-[20px] mb-6">
                <TextField text={id} copyValue className="text-neutral-90 dark:text-neutral-30" />
                <div className="bg-green-50 px-3 py-0.5 rounded-20">
                    <span className="text-title-2">
                        {translate("resources.accounts.balance")}: {balance}
                    </span>
                </div>
            </div>
            <TransactionShowDialog id={chosenId} open={transcationInfoOpen} onOpenChange={setTransactionInfoOpen} />

            <ListContextProvider value={{ ...listContext }}>
                <DataTable columns={historyColumns} />
            </ListContextProvider>
        </div>
    );
};
