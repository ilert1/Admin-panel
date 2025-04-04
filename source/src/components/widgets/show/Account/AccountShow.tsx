import { ListContextProvider, usePermissions, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";
// import { useEffect, useState } from "react";
import { uniqueId } from "lodash";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useBalances } from "@/hooks/useBalances";
import { useSheets } from "@/components/providers/SheetProvider";
import { useFetchMerchants } from "@/hooks";
import { useAppToast } from "@/components/ui/toast/useAppToast";
interface AccountShowProps {
    id: string;
}

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const AccountShow = ({ id }: AccountShowProps) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const appToast = useAppToast();
    const { permissions } = usePermissions();

    const { isLoading, merchantsList } = useFetchMerchants();

    const context = useAbortableShowController({ resource: "accounts", id });

    const getMerchantData = (merchantName: string) => {
        const merch = merchantsList.find(el => el.name === merchantName);

        return { id: merch?.id, merchantName: merch?.name };
    };

    const { balances, holds } = useBalances(context.isLoading, context.record?.amounts);
    const { historyColumns } = useGetAccountShowColumns();
    console.log(balances);
    console.log(holds);

    const listContext = useAbortableListController<AccountHistory>({
        resource: "operations",
        filter: { accountId: id },
        disableSyncWithLocation: true
    });

    if (context.isLoading || !context.record || listContext.isLoading || !listContext.data || isLoading) {
        return <LoadingBlock />;
    }

    const { id: merchId = "", merchantName = context.record.meta?.caption } = getMerchantData(
        context.record.meta?.caption
    );

    return (
        <div className="flex h-full min-h-[300px] flex-col p-4 pt-0 md:px-[42px]">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                <div className="flex flex-col gap-1 md:gap-4">
                    <div className="flex items-center gap-2 text-display-2 text-neutral-90 dark:text-neutral-30">
                        <TextField
                            text={context.record.meta?.caption}
                            onClick={
                                permissions === "admin"
                                    ? () => {
                                          merchId
                                              ? openSheet("merchant", { id: merchId ?? "", merchantName })
                                              : appToast(
                                                    "error",
                                                    translate("resources.merchant.errors.notFound", {
                                                        name: merchantName
                                                    })
                                                );
                                      }
                                    : undefined
                            }
                        />

                        <span
                            className={`rounded-20 px-3 py-0.5 text-center text-base font-normal text-white ${styles[context.record.state - 1]}`}>
                            {translate(`resources.accounts.fields.states.${translations[context.record.state - 1]}`)}
                        </span>
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
                    {holds &&
                        holds.length > 0 &&
                        holds.map(hold => {
                            return (
                                <div className="rounded-20 bg-green-50 px-3 py-0.5" key={uniqueId()}>
                                    <span className="text-title-2 text-neutral-0">
                                        {translate("resources.accounts.balance")}: {hold}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>

            <ListContextProvider value={{ ...listContext }}>
                <DataTable columns={historyColumns} />
            </ListContextProvider>
        </div>
    );
};
