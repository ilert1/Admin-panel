import { useDataProvider, useTranslate, ListContextProvider, useListController } from "react-admin";
import { useQuery } from "react-query";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";

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

export const TransactionList = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();

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
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <div>Loading...</div>;
    } else {
        return (
            <ListContextProvider value={listContext}>
                <DataTable columns={columns} data={listContext.data} />
            </ListContextProvider>
        );
    }
};
