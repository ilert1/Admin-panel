import { ArrayField, Datagrid, Labeled, NumberField, Show, TextField } from "react-admin";
import { Grid } from "@mui/material";

export const AccountShow = () => (
    <Show>
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid container item xs={12}>
                <Labeled label="">
                    <TextField source="meta.caption" />
                </Labeled>
            </Grid>
            <Grid container item xs={12}>
                <Grid item xs={12} sm={6} md={4}>
                    <Labeled>
                        <TextField source="id" />
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
                        <TextField source="state" />
                    </Labeled>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Labeled>
                        <TextField source="type" />
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
