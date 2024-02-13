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
    useDataProvider,
    useTranslate,
    useRecordContext
} from "react-admin";
import {
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    MenuItem
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";

const StateDialog = (props: any) => {
    const translate = useTranslate();

    const { data, ...rest } = props;

    const record = useRecordContext();

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(record?.state?.state_int);
    }, [record]);

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };

    const saveState = () => {
        props?.onChangeStatus(record.id, value as string);
    };

    return (
        <Dialog {...rest}>
            <DialogTitle>{translate("resources.transactions.show.statusButton")}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        {translate("resources.transactions.fields.state.title")}
                    </InputLabel>
                    <Select onChange={handleChange} value={value}>
                        {data?.states &&
                            Object.keys(data?.states).map(key => (
                                <MenuItem key={key} value={data?.states[key].state_int}>
                                    {data?.states[key].state_description}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={saveState}>{translate("resources.transactions.show.save")}</Button>
                <Button onClick={props?.onClose} color="error">
                    {translate("resources.transactions.show.cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const TransactionShow = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    const { mutate } = useMutation(() => dataProvider.create("transactions/man_set_state", {}));

    const translate = useTranslate();

    const [statusDialogOpen, setStatusDialogOpen] = useState(false);

    const openStatusDialog = () => {
        setStatusDialogOpen(true);
    };

    const closeStatusDialog = () => {
        setStatusDialogOpen(false);
    };

    const onChangeStatus = (id: string, data: string) => {
        // console.log(id, data);
        // mutate({ id, data });
    };

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
                <Grid item>
                    <Button onClick={openStatusDialog}>{translate("resources.transactions.show.statusButton")}</Button>
                </Grid>
            </Grid>
            <StateDialog
                open={statusDialogOpen}
                onClose={closeStatusDialog}
                onChangeStatus={onChangeStatus}
                data={data}
            />
        </Show>
    );
};
