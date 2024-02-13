import {
    ArrayField,
    BooleanField,
    Datagrid,
    Labeled,
    NumberField,
    Show,
    TextField,
    ReferenceManyField,
    FunctionField,
    useDataProvider
} from "react-admin";
import { Grid } from "@mui/material";
import { useQuery } from "react-query";

export const TransactionShow = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());
    return (
        <Show>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="id" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <FunctionField
                                source="type"
                                render={(record: any) => data?.transactionTypes[record.type]?.type_descr}
                            />
                        </Labeled>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="state.state_int" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="state.state_description" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <BooleanField source="state.final" />
                        </Labeled>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="source.id" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="source.amount.value" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="source.amount.currency" />
                        </Labeled>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="destination.id" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="destination.amount.value" />
                        </Labeled>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="destination.amount.currency" />
                        </Labeled>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Labeled>
                        <ArrayField source="fees">
                            <Datagrid
                                bulkActionButtons={false}
                                sx={{
                                    "& .RaDatagrid-headerCell": {
                                        fontWeight: "bold"
                                    }
                                }}>
                                <TextField source="recipient" />
                                <FunctionField
                                    source="type"
                                    render={(record: any) => data?.feeTypes[record.type]?.type_descr}
                                />
                                <NumberField source="value" />
                            </Datagrid>
                        </ArrayField>
                    </Labeled>
                </Grid>
                <Grid item xs={12}>
                    <Labeled label="resources.transactions.fields.history">
                        <ReferenceManyField reference="transactions" target="id">
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
                                <TextField
                                    label="resources.transactions.fields.state.title"
                                    source="state.state_description"
                                />
                                <BooleanField label="resources.transactions.fields.state.final" source="state.final" />
                            </Datagrid>
                        </ReferenceManyField>
                    </Labeled>
                </Grid>
            </Grid>
        </Show>
    );
};
