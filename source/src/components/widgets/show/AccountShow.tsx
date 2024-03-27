import {
    ArrayField,
    Datagrid,
    Labeled,
    NumberField,
    Show,
    TextField,
    FunctionField,
    useDataProvider
} from "react-admin";
import { Grid } from "@mui/material";
import { useQuery } from "react-query";

export const AccountShow = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());
    return (
        <Show>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="meta.caption" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="owner_id" />
                        </Labeled>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <FunctionField
                                source="state"
                                render={(record: any) => data?.accountStates[record.state]?.type_descr}
                            />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <FunctionField
                                source="type"
                                render={(record: any) => data?.accountTypes[record.type]?.type_descr}
                            />
                        </Labeled>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ArrayField source="amounts">
                        <Datagrid
                            bulkActionButtons={false}
                            sx={{
                                "& .RaDatagrid-headerCell": {
                                    fontWeight: "bold"
                                }
                            }}>
                            <TextField source="id" />
                            <TextField source="type" />
                            <TextField source="currency" />
                            <NumberField source="value" />
                        </Datagrid>
                    </ArrayField>
                </Grid>
            </Grid>
        </Show>
    );
};
