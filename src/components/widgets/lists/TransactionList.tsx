import { BooleanField, Datagrid, List, TextField } from "react-admin";

export const TransactionList = () => (
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
            <TextField source="type" />
            <TextField label="resources.transactions.fields.state.title" source="state.state_description" />
            <BooleanField label="resources.transactions.fields.state.final" source="state.final" />
        </Datagrid>
    </List>
);
