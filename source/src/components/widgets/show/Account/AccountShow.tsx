import { ListContextProvider, useListController, useShowController, useTranslate } from "react-admin";
import { DataTable, SimpleTable } from "@/components/widgets/shared";
import { LoadingAlertDialog } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";

export const AccountShow = (props: { id: string; type?: "compact" }) => {
    const { id, type } = props;
    const translate = useTranslate();

    const context = useShowController({ id });

    const { columns, historyColumns, dataDictionaries } = useGetAccountShowColumns();

    const listContext = useListController<Transaction.TransactionView>({
        resource: "transactions/view",
        filter: { accountId: id },
        disableSyncWithLocation: true
    });

    if (context.isLoading || !context.record || listContext.isLoading || !listContext.data) {
        return <LoadingAlertDialog />;
    }
    if (type === "compact") {
        return (
            <div className="mx-6">
                {(context.record.meta?.TRC20 || context.record.meta?.tron_wallet) && (
                    <div className="grid grid-cols-2 gap-2 mb-4 px-[18px]">
                        {context.record.meta?.TRC20 && (
                            <TextField
                                label={translate("resources.accounts.fields.trc20")}
                                text={context.record.meta?.TRC20}
                                copyValue
                            />
                        )}

                        {context.record.meta?.tron_wallet && (
                            <TextField
                                label={translate("resources.accounts.fields.tron_wallet")}
                                text={context.record.meta?.tron_wallet}
                                copyValue
                            />
                        )}
                    </div>
                )}

                <ListContextProvider value={{ ...listContext }}>
                    <DataTable columns={historyColumns} />
                </ListContextProvider>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col gap-2">
                <TextField
                    label={translate("resources.accounts.fields.meta.caption")}
                    text={context.record.meta.caption}
                />
                <TextField label={translate("resources.accounts.fields.owner_id")} text={context.record.owner_id} />
                <TextField
                    label={translate("resources.accounts.fields.state")}
                    text={dataDictionaries?.accountStates[context.record.state]?.type_descr}
                />
                <TextField
                    label={translate("resources.accounts.fields.type")}
                    text={dataDictionaries?.accountTypes[context.record.type]?.type_descr}
                />
                {context.record.meta?.TRC20 && (
                    <TextField
                        label={translate("resources.accounts.fields.trc20")}
                        text={context.record.meta?.TRC20}
                        copyValue
                    />
                )}
                {context.record.meta?.tron_wallet && (
                    <TextField
                        label={translate("resources.accounts.fields.tron_wallet")}
                        text={context.record.meta?.tron_wallet}
                        copyValue
                    />
                )}

                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.amounts")}
                    </small>
                    <SimpleTable columns={columns} data={context.record?.amounts} />
                </div>
            </div>
        );
    }
};
