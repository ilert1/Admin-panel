import { Datagrid, List, TextField, NumberField } from "react-admin";

export const AccountList = () => (
    <List exporter={false}>
        <Datagrid
            bulkActionButtons={false}
            rowClick="show"
            sx={{
                "& .RaDatagrid-headerCell": {
                    fontWeight: "bold"
                }
            }}>
            <TextField source="id" sortable={false} />
            <TextField source="owner_id" sortable={false} />
            <NumberField source="state" sortable={false} />
            <NumberField source="type" sortable={false} />
        </Datagrid>
    </List>
);
