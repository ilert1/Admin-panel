import { useDataProvider, useShowController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";

export const AccountShow = (props: { id: string }) => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());
    const translate = useTranslate();

    const context = useShowController({ id: props.id });

    const columns: ColumnDef<Amount>[] = [
        {
            id: "caption",
            accessorKey: "id",
            header: translate("resources.accounts.fields.amount.id")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.accounts.fields.amount.type")
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.accounts.fields.amount.currency")
        },
        {
            id: "value",
            accessorKey: "value",
            header: translate("resources.accounts.fields.amount.value"),
            cell: ({ row }) =>
                ((row.original.value.quantity || 0) / row.original.value.accuracy).toFixed(
                    Math.log10(row.original.value.accuracy)
                )
        }
    ];

    if (context.isLoading || !context.record) {
        return null;
    } else {
        return (
            <div className="flex flex-col gap-2">
                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.meta.caption")}
                    </small>
                    <p className="leading-5">{context.record.meta.caption}</p>
                </div>
                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.owner_id")}
                    </small>
                    <p className="leading-5">{context.record.owner_id}</p>
                </div>
                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.state")}
                    </small>
                    <p className="leading-5">{data?.accountStates[context.record.state]?.type_descr}</p>
                </div>
                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.type")}
                    </small>
                    <p className="leading-5">{data?.accountTypes[context.record.type]?.type_descr}</p>
                </div>
                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.amounts")}
                    </small>
                    <DataTable columns={columns} data={context.record.amounts} pagination={false} />
                </div>
            </div>
        );
    }

    // <Show>
    //     <Grid container spacing={2} sx={{ p: 2 }}>
    //         <Grid container item xs={12}>

    //         </Grid>
    //         <Grid item xs={12}>
    //             <ArrayField source="amounts">
    //                 <Datagrid
    //                     bulkActionButtons={false}
    //                     sx={{
    //                         "& .RaDatagrid-headerCell": {
    //                             fontWeight: "bold"
    //                         }
    //                     }}>
    //                     <TextField source="id" />
    //                     <TextField source="type" />
    //                     <TextField source="currency" />
    //                     <FunctionField
    //                         source="value"
    //                         render={(record: any) =>
    //                             ((record.value.quantity || 0) / record.value.accuracy).toFixed(
    //                                 Math.log10(record.value.accuracy)
    //                             )
    //                         }
    //                     />
    //                 </Datagrid>
    //             </ArrayField>
    //         </Grid>
    //     </Grid>
    // </Show>
};
