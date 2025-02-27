import { ListContextProvider, useListController, useShowController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";

interface AccountShowProps {
    id: string;
}

export const AccountShow = ({ id }: AccountShowProps) => {
    const translate = useTranslate();

    const context = useShowController({ resource: "accounts", id });

    const { historyColumns } = useGetAccountShowColumns();

    const listContext = useListController<AccountHistory>({
        resource: "operations",
        filter: { accountId: id },
        disableSyncWithLocation: true
    });

    if (context.isLoading || !context.record || listContext.isLoading || !listContext.data) {
        return <LoadingBlock />;
    }

    return (
        <div className="mx-6 h-full min-h-[300px] flex flex-col">
            {/* {(context.record.meta?.TRC20 || context.record.meta?.tron_wallet) && (
                <div className="grid grid-cols-2 gap-2 mb-4 px-[18px]">
                    {context.record.meta?.TRC20 && (
                        <TextField
                            label={translate("resources.accounts.fields.trc20")}
                            text={context.record.meta?.TRC20}
                            className="text-neutral-90 dark:text-neutral-30"
                            copyValue
                        />
                    )}

                    {context.record.meta?.tron_wallet && (
                        <TextField
                            label={translate("resources.accounts.fields.tron_wallet")}
                            text={context.record.meta?.tron_wallet}
                            copyValue
                            className="text-neutral-90 dark:text-neutral-30"
                        />
                    )}
                </div>
            )} */}
            <div className="flex justify-between px-[20px] mb-6">
                <TextField text={id} copyValue className="text-neutral-90 dark:text-neutral-30" />
                <div className="bg-green-50 px-3 py-0.5 rounded-20">
                    <span className="text-title-2">{translate("resources.accounts.balance")}: </span>
                </div>
            </div>

            <ListContextProvider value={{ ...listContext }}>
                <DataTable columns={historyColumns} />
            </ListContextProvider>
        </div>
    );
};
