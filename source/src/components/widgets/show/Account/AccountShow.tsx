import { ListContextProvider, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";
// import { useEffect, useState } from "react";
import { useEffect } from "react";
import { ShowTransactionSheet } from "../../lists/Transactions/ShowTransactionSheet";
import { uniqueId } from "lodash";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useBalances } from "@/hooks/useBalances";
interface AccountShowProps {
    id: string;
}

export const AccountShow = ({ id }: AccountShowProps) => {
    const translate = useTranslate();

    const context = useAbortableShowController({ resource: "accounts", id });

    const { balances } = useBalances(context.isLoading, context.record?.amounts);

    const { historyColumns, chosenId, transcationInfoOpen, setTransactionInfoOpen } = useGetAccountShowColumns();

    const listContext = useAbortableListController<AccountHistory>({
        resource: "operations",
        filter: { accountId: id },
        disableSyncWithLocation: true
    });

    useEffect(() => {
        if (chosenId) {
            setTransactionInfoOpen(true);
        }
    }, [chosenId, setTransactionInfoOpen]);

    if (context.isLoading || !context.record || listContext.isLoading || !listContext.data) {
        return <LoadingBlock />;
    }

    return (
        <div className="flex h-full min-h-[300px] flex-col p-4 pt-0 md:p-[42px]">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                <div className="flex flex-col gap-1 md:gap-4">
                    <div className="text-display-2 text-neutral-90 dark:text-neutral-30">
                        <span>{context.record.meta.caption}</span>
                    </div>

                    <TextField text={id} copyValue className="text-neutral-90 dark:text-neutral-30" />
                </div>
                <div className="flex flex-wrap content-end justify-end gap-2">
                    {balances.length > 0 &&
                        balances.map(balance => (
                            <div className="rounded-20 bg-green-50 px-3 py-0.5" key={uniqueId()}>
                                <span className="text-title-2 text-neutral-0">
                                    {translate("resources.accounts.balance")}: {balance}
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            <ShowTransactionSheet id={chosenId} open={transcationInfoOpen} onOpenChange={setTransactionInfoOpen} />

            <ListContextProvider value={{ ...listContext }}>
                <DataTable columns={historyColumns} />
            </ListContextProvider>
        </div>
    );
};
