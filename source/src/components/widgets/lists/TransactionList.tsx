import {
    BooleanField,
    Datagrid,
    List,
    TextField,
    useDataProvider,
    FunctionField,
    DateField,
    SearchInput
} from "react-admin";
import { useQuery } from "react-query";

export const TransactionList = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    return (
        // eslint-disable-next-line react/jsx-key
        <List exporter={false} filters={[<SearchInput source="id" alwaysOn resettable />]}>
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
