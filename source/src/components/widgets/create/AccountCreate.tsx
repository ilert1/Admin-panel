import { Create, NumberInput } from "react-admin";
import { SimpleForm, TextInput } from "react-admin";
import { Grid } from "@mui/material";

export const AccountCreate = () => (
    <Create>
        <SimpleForm>
            <Grid container columnSpacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextInput
                        source="id"
                        variant="outlined"
                        required
                        fullWidth
                        inputProps={{
                            autoComplete: "off"
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <NumberInput
                        source="state"
                        variant="outlined"
                        required
                        fullWidth
                        inputProps={{
                            autoComplete: "off"
                        }}
                    />
                </Grid>
            </Grid>
        </SimpleForm>
    </Create>
);
