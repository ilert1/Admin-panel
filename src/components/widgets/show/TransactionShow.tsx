import { ArrayField, BooleanField, Datagrid, Labeled, NumberField, Show, TextField } from "react-admin";
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
            </Grid>
        </Grid>
    </Show>
);
