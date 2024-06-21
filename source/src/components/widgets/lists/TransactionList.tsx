import {
    useDataProvider,
    useTranslate,
    ListContextProvider,
    useListController,
    RecordContextProvider
} from "react-admin";
import { useQuery } from "react-query";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionShow } from "@/components/widgets/show";
import { useMediaQuery } from "react-responsive";
import { useTransactionActions } from "@/hooks";

// const TransactionFilterSidebar = () => {
//     const translate = useTranslate();
//     const { data: accounts } = useGetList("accounts");

//     const { filterValues, setFilters, displayedFilters } = useListContext();

//     const [id, setId] = useState("");
//     const [account, setAccount] = useState("");

//     const onPropertySelected = debounce((value: any, type: "id" | "account") => {
//         if (value) {
//             setFilters({ ...filterValues, [type]: value }, displayedFilters);
//         } else {
//             Reflect.deleteProperty(filterValues, type);
//             setFilters(filterValues, displayedFilters);
//         }
//     }, 300);

//     const onIdChanded = (e: ChangeEvent<HTMLInputElement>) => {
//         setId(e.target.value);
//         onPropertySelected(e.target.value, "id");
//     };

//     const clearId = () => {
//         setId("");
//         onPropertySelected(null, "id");
//     };

//     const onAccountChanged = (e: SelectChangeEvent) => {
//         setAccount(e.target.value);
//         onPropertySelected(e.target.value, "account");
//     };

//     const clearAccount = () => {
//         setAccount("");
//         onPropertySelected(null, "account");
//     };

//     return (
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2, p: 2 }}>
//             <MUITextField
//                 label={translate("resources.transactions.list.filter.transactionId")}
//                 fullWidth
//                 value={id}
//                 onChange={onIdChanded}
//                 helperText={false}
//                 InputProps={{
//                     endAdornment:
//                         id?.length > 0 ? (
//                             <IconButton size="small" onClick={clearId}>
//                                 <ClearIcon />
//                             </IconButton>
//                         ) : undefined
//                 }}
//             />
//             <FormControl fullWidth>
//                 <InputLabel shrink={true}>{translate("resources.transactions.list.filter.account")}</InputLabel>
//                 <Select
//                     IconComponent={
//                         account?.length > 0
//                             ? () => (
//                                   <IconButton size="small" onClick={clearAccount}>
//                                       <ClearIcon />
//                                   </IconButton>
//                               )
//                             : undefined
//                     }
//                     onChange={onAccountChanged}
//                     value={account}
//                     notched={true}>
//                     {accounts &&
//                         accounts.map((account, i) => (
//                             <MenuItem key={i} value={account.id}>
//                                 {account.meta.caption}
//                             </MenuItem>
//                         ))}
//                 </Select>
//             </FormControl>
//         </Box>
//     );
// };

const TransactionActions = () => {
    const { switchDispute, showDispute, disputeCaption } = useTransactionActions();

    console.log(showDispute);

    return <>{showDispute && <DropdownMenuItem onClick={switchDispute}>{disputeCaption}</DropdownMenuItem>}</>;
};

export const TransactionList = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();

    const [showOpen, setShowOpen] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "id",
            header: translate("resources.transactions.fields.id")
        },
        {
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) => data?.transactionTypes?.[row.getValue("type") as string]?.type_descr || ""
        },
        {
            accessorKey: "state.state_description",
            header: translate("resources.transactions.fields.state.title")
        },
        {
            accessorKey: "state.final",
            header: translate("resources.transactions.fields.state.final")
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
            accessorKey: "type",
            header: translate("resources.transactions.fields.rateInfo"),
            cell: ({ row }) => {
                const rateInfo: Transaction.RateInfo = row.original.rate_info;
                if (rateInfo) {
                    return `${rateInfo.s_currency} / ${rateInfo.d_currency}: ${(
                        (rateInfo.value.quantity || 0) / rateInfo.value.accuracy
                    ).toFixed(Math.log10(rateInfo.value.accuracy))}`;
                } else {
                    return 0;
                }
            }
        },
        {
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.createdAt")
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <RecordContextProvider value={row.original}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openSheet(row.original.id)}>
                                    {translate("ra.action.show")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <TransactionActions />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </RecordContextProvider>
                );
            }
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} data={listContext.data} />
                </ListContextProvider>
                <Sheet open={showOpen} onOpenChange={setShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full [&>div>div]:!block">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.accounts.showHeader")}</SheetTitle>
                                <SheetDescription>
                                    {translate("resources.accounts.showDescription", { id: showTransactionId })}
                                </SheetDescription>
                            </SheetHeader>
                            <TransactionShow id={showTransactionId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
