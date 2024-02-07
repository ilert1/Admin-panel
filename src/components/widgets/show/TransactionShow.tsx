import {
    ArrayField,
    BooleanField,
    Datagrid,
    Labeled,
    NumberField,
    Show,
    TextField,
    ReferenceManyField
} from "react-admin";
import { Grid } from "@mui/material";

export const TransactionShow = () => (
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
                        <TextField source="type" />
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
                            <NumberField source="type" />
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
                            <TextField source="type" />
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
