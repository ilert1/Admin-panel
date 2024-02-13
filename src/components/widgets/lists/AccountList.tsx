import { Datagrid, List, TextField, useDataProvider, FunctionField } from "react-admin";
import { useQuery } from "react-query";

export const AccountList = () => {
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
                <TextField source="id" sortable={false} />
                <TextField source="owner_id" sortable={false} />
                <FunctionField source="state" render={(record: any) => data?.accountStates[record.state]?.type_descr} />
                <FunctionField source="type" render={(record: any) => data?.accountTypes[record.type]?.type_descr} />
            </Datagrid>
        </List>
    );
};
