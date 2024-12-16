import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useFetchMerchants } from "@/hooks";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useLocaleState, usePermissions, useTranslate } from "react-admin";

export type MerchantTypeToShow = "fees" | "directions" | undefined;

export const useGetTransactionColumns = () => {
    const data = fetchDictionaries();
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { permissions } = usePermissions();

    // const [chartOpen, setChartOpen] = useState(false)
    const [showOpen, setShowOpen] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const { isLoading, merchantsList } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        permissions === "admin" ? useFetchMerchants() : { isLoading: false, merchantsList: [] };

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const merchantNameGenerate = useCallback(
        (type: number, source: string, destination: string) => {
            const sourceMerch = merchantsList.find(el => el.id === source);
            const destMerch = merchantsList.find(el => el.id === destination);

            switch (type) {
                case 1:
                    return <TextField text={destMerch?.name || ""} wrap />;
                case 2:
                case 4:
                    return <TextField text={sourceMerch?.name || ""} wrap />;
                case 3:
                    return <TextField text={`${sourceMerch?.name} - ${destMerch?.name}`} wrap />;
                default:
                    return <TextField text="" wrap />;
            }
        },
        [merchantsList]
    );

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.createdAt"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                </>
            )
        },
        {
            accessorKey: "id",
            header: translate("resources.transactions.fields.id"),
            cell: ({ row }) => (
                <TextField text={row.original.id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />
            ),
            filterFn: "includesString"
        },
        {
            accessorKey: "meta.customer_data.customer_id",
            header: translate("resources.transactions.fields.meta.customer_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.meta.customer_data.customer_id} wrap />;
            }
        },
        {
            accessorKey: "meta.customer_data.customer_payment_id",
            header: translate("resources.transactions.fields.meta.customer_payment_id"),
            cell: ({ row }) => (
                <TextField
                    text={row.original.meta.customer_data.customer_payment_id}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        ...(permissions === "admin"
            ? [
                  {
                      header: translate("resources.withdraw.fields.merchant"),
                      cell: ({ row }: { row: Row<Transaction.Transaction> }) => {
                          return (
                              <div>
                                  {merchantNameGenerate(
                                      row.original.type,
                                      row.original.source.id,
                                      row.original.destination.id
                                  )}
                                  <TextField
                                      text={row.original.source.id}
                                      wrap
                                      copyValue
                                      lineClamp
                                      linesCount={1}
                                      minWidth="50px"
                                  />
                              </div>
                          );
                      }
                  }
              ]
            : []),
        {
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) =>
                translate(
                    `resources.transactions.types.${data?.transactionTypes?.[
                        row.original.type
                    ]?.type_descr?.toLowerCase()}`
                ) || ""
        },
        {
            accessorKey: "state",
            header: translate("resources.transactions.fields.state.title"),
            cell: ({ row }) =>
                translate(`resources.transactions.states.${row.original.state?.state_description?.toLowerCase()}`) || ""
        },
        {
            accessorKey: "sourceValue",
            header: translate("resources.transactions.fields.sourceValue"),
            cell: ({ row }) => {
                const value =
                    (row.original.source.amount.value.quantity || 0) / row.original.source.amount.value.accuracy;
                if (isNaN(value)) return "-";
                return `${value.toFixed(Math.log10(row.original.source.amount.value.accuracy))} ${
                    row.original.source.amount.currency || ""
                }`;
            }
        },
        {
            accessorKey: "destValue",
            header: translate("resources.transactions.fields.destValue"),
            cell: ({ row }) => {
                const value =
                    (row.original.destination.amount.value.quantity || 0) /
                    row.original.destination.amount.value.accuracy;
                if (isNaN(value)) return "-";
                return `${value.toFixed(Math.log10(row.original.destination.amount.value.accuracy))} ${
                    row.original.destination.amount.currency || ""
                }`;
            }
        },
        {
            accessorKey: "rate_info",
            header: translate("resources.transactions.fields.rateInfo"),
            cell: ({ row }) => {
                const rateInfo: Transaction.RateInfo = row.original.rate_info;
                if (rateInfo) {
                    return (
                        <>
                            <p className="text-neutral-60 dark:text-neutral-70">{`${rateInfo.s_currency} / ${rateInfo.d_currency}:`}</p>
                            <p>
                                {((rateInfo.value.quantity || 0) / rateInfo.value.accuracy).toFixed(
                                    Math.log10(rateInfo.value.accuracy)
                                )}
                            </p>
                        </>
                    );
                } else {
                    return 0;
                }
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Button onClick={() => openSheet(row.original.id)} variant="clearBtn" className="w-full p-0">
                        <span className="sr-only">Open menu</span>
                        <EyeIcon className="text-green-50 size-7" />
                    </Button>
                    // <RecordContextProvider value={row.original}>
                    //     <DropdownMenu>
                    //         <DropdownMenuTrigger asChild>
                    //             <Button variant="clearBtn" className="w-full p-0">
                    //                 <span className="sr-only">Open menu</span>
                    //                 <EyeIcon className="text-green-50 size-7" />
                    //             </Button>
                    //         </DropdownMenuTrigger>
                    //         <DropdownMenuContent align="end">
                    //             <DropdownMenuItem onClick={() => openSheet(row.original.id)} className="border-none">
                    //                 {translate("app.ui.actions.quick_show")}
                    //             </DropdownMenuItem>
                    //             <DropdownMenuItem
                    //                 onClick={() => navigate(`/transactions/${row.original.id}/show`)}
                    //                 className="border-none">
                    //                 {translate("app.ui.actions.show")}
                    //             </DropdownMenuItem>
                    //             {adminOnly && <DropdownMenuSeparator />}
                    //             <TransactionActions
                    //                 dictionaries={data}
                    //                 stornoOpen={() => setStornoOpen(true)}
                    //                 stornoClose={() => setStornoOpen(false)}
                    //             />
                    //         </DropdownMenuContent>
                    //     </DropdownMenu>
                    // </RecordContextProvider>
                );
            }
        }
    ];

    return {
        columns,
        isLoading,
        showOpen,
        setShowOpen,
        showTransactionId
    };
};
