import { ListContextProvider, useListController, useShowController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";
import { useEffect, useState } from "react";
import { ShowTransactionSheet } from "../../lists/Transactions/ShowTransactionSheet";

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
        if (!context.isLoading && context.record.amounts[0]) {
            setBalance(
                String(
                    context.record.amounts[0]?.value.quantity == 0
                        ? "0"
                        : context.record.amounts[0]?.value.quantity / context.record.amounts[0]?.value.accuracy
                ).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            );
        } else {
            setBalance("0");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            <ShowTransactionSheet id={chosenId} open={transcationInfoOpen} onOpenChange={setTransactionInfoOpen} />

            <ListContextProvider value={{ ...listContext }}>
                <DataTable columns={historyColumns} />
            </ListContextProvider>
        </div>
    );
};
