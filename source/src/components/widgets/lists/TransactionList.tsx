import {
    BooleanField,
    Datagrid,
    List,
    TextField,
    useDataProvider,
    FunctionField,
    DateField,
    useListContext,
    useTranslate,
    useGetList
} from "react-admin";
import { useQuery } from "react-query";
import { TextField as MUITextField, FormControl, InputLabel, Select, MenuItem, IconButton, Box } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material/Select";
import { Clear as ClearIcon } from "@mui/icons-material";

const TransactionFilterSidebar = () => {
    const translate = useTranslate();
    const { data: accounts } = useGetList("accounts");

    const { filterValues, setFilters, displayedFilters } = useListContext();

    const [id, setId] = useState("");
    const [account, setAccount] = useState("");

    const onPropertySelected = debounce((value: any, type: "id" | "account") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters);
        }
    }, 300);

    const onIdChanded = (e: ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
        onPropertySelected(e.target.value, "id");
    };

    const clearId = () => {
        setId("");
        onPropertySelected(null, "id");
    };

    const onAccountChanged = (e: SelectChangeEvent) => {
        setAccount(e.target.value);
        onPropertySelected(e.target.value, "account");
    };

    const clearAccount = () => {
        setAccount("");
        onPropertySelected(null, "account");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, p: 2 }}>
            <MUITextField
                label={translate("resources.transactions.list.filter.transactionId")}
                fullWidth
                value={id}
                onChange={onIdChanded}
                helperText={false}
                InputProps={{
                    endAdornment:
                        id?.length > 0 ? (
                            <IconButton size="small" onClick={clearId}>
                                <ClearIcon />
                            </IconButton>
                        ) : undefined
                }}
            />
            <FormControl fullWidth>
                <InputLabel shrink={true}>{translate("resources.transactions.list.filter.account")}</InputLabel>
                <Select
                    IconComponent={
                        account?.length > 0
                            ? () => (
                                  <IconButton size="small" onClick={clearAccount}>
                                      <ClearIcon />
                                  </IconButton>
                              )
                            : undefined
                    }
                    onChange={onAccountChanged}
                    value={account}
                    notched={true}>
                    {accounts &&
                        accounts.map((account, i) => (
                            <MenuItem key={i} value={account.id}>
                                {account.meta.caption}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export const TransactionList = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    return (
        <List exporter={false}>
            <TransactionFilterSidebar />
            <Datagrid
                bulkActionButtons={false}
                rowClick="show"
                sx={{
                    "& .RaDatagrid-headerCell": {
                        fontWeight: "bold"
                    }
                }}>
                <TextField source="id" />
                <FunctionField
                    source="type"
                    render={(record: any) => data?.transactionTypes[record.type]?.type_descr}
                />
                <TextField label="resources.transactions.fields.state.title" source="state.state_description" />
                <BooleanField label="resources.transactions.fields.state.final" source="state.final" />
                <FunctionField
                    label="resources.transactions.fields.rateInfo"
                    source="source.amount.rate_info"
                    render={(record: any) =>
                        `${record.rate_info.s_currency} / ${record.rate_info.d_currency}: ${(
                            (record.rate_info.value.quantity || 0) / record.rate_info.value.accuracy
                        ).toFixed(Math.log10(record.rate_info.value.accuracy))}`
                    }
                />
                <DateField showTime label="resources.transactions.fields.createdAt" source="created_at" />
            </Datagrid>
        </List>
    );
};
