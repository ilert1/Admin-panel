import { BooleanField, Datagrid, List, TextField, useDataProvider, FunctionField } from "react-admin";
import { useQuery } from "react-query";

export const TransactionList = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    return (
        <List exporter={false}>
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
            </Datagrid>
        </List>
    );
};
