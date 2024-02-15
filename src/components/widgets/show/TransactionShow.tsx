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
    useRecordContext,
    useRefresh,
    useNotify,
    DateField
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
    MenuItem,
    Typography
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { API_URL } from "@/helpers";

const StateDialog = (props: any) => {
    const translate = useTranslate();

    const { data, ...rest } = props;

    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(record?.state?.state_int);
    }, [record]);

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };

    const saveState = () => {
        fetch(`${API_URL}/transactions/man_set_state`, {
            method: "POST",
            body: JSON.stringify({ id: record.id, state: value }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    notify(translate("resources.transactions.show.success"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                notify(e.message, { type: "error" });
            })
            .finally(() => {
                refresh();
            });
        props?.onClose?.();
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
                            Object.keys(data?.states).map((key, i) => (
                                <MenuItem key={i} value={data?.states[key].state_int}>
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

export const TransactionShowWidget = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    const translate = useTranslate();
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useRecordContext();

    const [statusDialogOpen, setStatusDialogOpen] = useState(false);

    const openStatusDialog = () => {
        setStatusDialogOpen(true);
    };

    const closeStatusDialog = () => {
        setStatusDialogOpen(false);
    };

    const makeStorno = () => {
        fetch(`https://bf-manager.bfgate.api4ftx.cloud/v1/manager/storno`, {
            method: "POST",
            body: JSON.stringify({
                source: record.source,
                destination: record.destination,
                meta: {
                    id: record.id
                }
            })
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    notify(translate("resources.transactions.show.success"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                notify(e.message, { type: "error" });
            })
            .finally(() => {
                refresh();
            });
    };

    const commitTransaction = () => {
        fetch(`${API_URL}/transactions/commit`, {
            method: "POST",
            body: JSON.stringify({ id: record.id }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    notify(translate("resources.transactions.show.success"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                notify(e.message, { type: "error" });
            })
            .finally(() => {
                refresh();
            });
    };

    const switchDispute = () => {
        fetch(`https://juggler.bfgate.api4ftx.cloud/transactions/dispute`, {
            method: "POST",
            body: JSON.stringify({ id: record.id, dispute: !record.dispute }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    notify(translate("resources.transactions.show.success"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                notify(e.message, { type: "error" });
            })
            .finally(() => {
                refresh();
            });
    };

    return (
        <>
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
                    <Grid item xs={12}>
                        <Typography variant="caption" color="#616161">
                            {translate("resources.transactions.fields.source.header")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="source.meta.caption" />
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
                    <Grid item xs={12}>
                        <Typography variant="caption" color="#616161">
                            {translate("resources.transactions.fields.destination.header")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labeled>
                            <TextField source="destination.meta.caption" />
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
                                <DateField showTime source="created_at" />
                                <FunctionField
                                    source="type"
                                    render={(record: any) => data?.transactionTypes[record.type]?.type_descr}
                                />
                                <TextField
                                    label="resources.transactions.fields.state.title"
                                    source="state.state_description"
                                />
                                <BooleanField label="resources.transactions.fields.state.final" source="state.final" />
                                <BooleanField label="resources.transactions.fields.committed" source="committed" />
                            </Datagrid>
                        </ReferenceManyField>
                    </Labeled>
                </Grid>
                <Grid item>
                    <Button onClick={openStatusDialog}>{translate("resources.transactions.show.statusButton")}</Button>
                    <Button disabled={!record?.dispute} onClick={makeStorno}>
                        {translate("resources.transactions.show.storno")}
                    </Button>
                    <Button onClick={commitTransaction}>{translate("resources.transactions.show.commit")}</Button>
                    <Button onClick={switchDispute}>
                        {record?.dispute
                            ? translate("resources.transactions.show.closeDispute")
                            : translate("resources.transactions.show.openDispute")}
                    </Button>
                </Grid>
            </Grid>
            <StateDialog open={statusDialogOpen} onClose={closeStatusDialog} data={data} />
        </>
    );
};

export const TransactionShow = () => (
    <Show>
        <TransactionShowWidget />
    </Show>
);
