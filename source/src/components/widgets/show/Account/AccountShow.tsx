import { ListContextProvider, usePermissions, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";
import { uniqueId } from "lodash";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useBalances } from "@/hooks/useBalances";
import { useSheets } from "@/components/providers/SheetProvider";
import { useGetMerchantData } from "@/hooks/useGetMerchantData";
import SnowFlakeIcon from "@/lib/icons/snowflake.svg?react";

interface AccountShowProps {
    id: string;
}

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const AccountShow = ({ id }: AccountShowProps) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const { permissions } = usePermissions();
    const { getMerchantId, isMerchantsLoading } = useGetMerchantData();

    const context = useAbortableShowController<Account>({ resource: "accounts", id });

    const { balances, holds } = useBalances(context.isLoading, context.record?.amounts);
    const { historyColumns } = useGetAccountShowColumns();

    const listContext = useAbortableListController<AccountHistory>({
        resource: "operations",
        filter: { accountId: id },
        disableSyncWithLocation: true
    });

    if (context.isLoading || !context.record || listContext.isLoading || !listContext.data || isMerchantsLoading) {
        return <LoadingBlock />;
    }

    const merchId = getMerchantId(context.record.owner_id);

    return (
        <div className="flex h-full min-h-[300px] flex-col p-4 pt-0 md:px-[42px]">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                <div className="flex flex-col gap-1 md:gap-4">
                    <div className="flex items-center gap-2 text-display-2 text-neutral-90 dark:text-neutral-30">
                        <TextField
                            text={context.record.meta?.caption}
                            onClick={
                                permissions === "admin"
                                    ? merchId
                                        ? () =>
                                              openSheet("merchant", {
                                                  id: merchId ?? "",
                                                  merchantName: context.record.meta?.caption
                                              })
                                        : undefined
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
                    {balances?.length > 0 &&
                        balances.map(balance => {
                            let currentHold;

                            if (holds?.length > 0) {
                                currentHold = holds.find(el => el.split(" ").at(-1) === balance.split(" ").at(-1));
                            }

                            return (
                                <div className="flex flex-col items-start" key={uniqueId()}>
                                    <div className="inline-flex w-full rounded-20 bg-green-50 px-3 py-0.5">
                                        <span className="text-title-2 text-neutral-0">
                                            {translate("resources.accounts.balance")}: {balance}
                                        </span>
                                    </div>
                                    {currentHold && (
                                        <div>
                                            <span className="text-title-3 mx-2 flex items-center gap-[7px] self-start text-extra-7">
                                                <SnowFlakeIcon className="h-5 w-5" />
                                                {translate("resources.accounts.held")}: {currentHold}
                                            </span>
                                        </div>
                                    )}
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
