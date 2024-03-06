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
    DateField,
    useGetList,
    SingleFieldList,
    useLocaleState
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
    Typography,
    TextField as MUITextField,
    Link
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "react-query";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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
                    <InputLabel shrink={true}>{translate("resources.transactions.fields.state.title")}</InputLabel>
                    <Select onChange={handleChange} value={value} notched={true}>
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

const StornoDialog = (props: any) => {
    const translate = useTranslate();

    const { accounts, currencies, ...rest } = props;

    const [locale] = useLocaleState();

    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const [value, setValue] = useState("");
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [currency, setCurrency] = useState("");

    const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleSourceChange = (event: SelectChangeEvent) => {
        setSource(event.target.value);
        if (event.target.value === destination) {
            setDestination("");
        }
    };

    const handleDestinationChange = (event: SelectChangeEvent) => {
        setDestination(event.target.value);
        if (event.target.value === source) {
            setSource("");
        }
    };

    const handleCurrencyChange = (event: SelectChangeEvent) => {
        setCurrency(event.target.value);
    };

    const makeStorno = () => {
        fetch(`https://bf-manager.bfgate.api4ftx.cloud/v1/manager/storno`, {
            method: "POST",
            body: JSON.stringify({
                source: {
                    id: source,
                    amount: {
                        currency,
                        value: +value
                    }
                },
                destination: {
                    id: destination,
                    amount: {
                        currency,
                        value: +value
                    }
                },
                meta: {
                    parentId: record.id
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
        props?.onClose?.();
    };

    return (
        <Dialog {...rest}>
            <DialogTitle>{translate("resources.transactions.show.storno")}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        {translate("resources.transactions.fields.source.header")}
                    </InputLabel>
                    <Select onChange={handleSourceChange} value={source}>
                        {accounts &&
                            accounts.map((acc: any) => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.meta.caption}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        {translate("resources.transactions.fields.destination.header")}
                    </InputLabel>
                    <Select onChange={handleDestinationChange} value={destination}>
                        {accounts &&
                            accounts.map((acc: any) => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.meta.caption}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>{translate("resources.transactions.fields.currency")}</InputLabel>
                    <Select value={currency} onChange={handleCurrencyChange}>
                        {currencies?.map?.((cur: any) => (
                            <MenuItem key={cur.code} value={cur["alpha-3"]}>
                                {`${cur["name-" + locale]} (${cur["alpha-3"]})`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <MUITextField
                    type="number"
                    fullWidth
                    label={translate("resources.transactions.fields.value")}
                    value={value}
                    onChange={handleValueChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={makeStorno} disabled={!source || !destination || !value || !currency}>
                    {translate("resources.transactions.show.save")}
                </Button>
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
    const { data: accounts } = useGetList("accounts");

    const translate = useTranslate();
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useRecordContext();

    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [stornoDialogOpen, setStornoDialogOpen] = useState(false);

    const openStatusDialog = () => {
        setStatusDialogOpen(true);
    };

    const closeStatusDialog = () => {
        setStatusDialogOpen(false);
    };

    const openStornoDialog = () => {
        setStornoDialogOpen(true);
    };

    const closeStornoDialog = () => {
        setStornoDialogOpen(false);
    };

    const { data: currencies } = useQuery("currencies", () =>
        fetch("https://juggler.bfgate.api4ftx.cloud/dictionaries/curr").then(response => response.json())
    );

    const sortedCurrencies = useMemo(() => {
        return currencies?.data?.sort((a: any, b: any) => a.prior_gr - b.prior_gr) || [];
    }, [currencies]);

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
                {record?.history?.stornoIds?.length > 0 && (
                    <Grid item xs={12}>
                        <Labeled label="resources.transactions.fields.stornoIds">
                            <ArrayField source="history.stornoIds">
                                <SingleFieldList linkType={false}>
                                    <FunctionField
                                        render={(r: any) => <Link href={`#/transactions/${r}/show`}>{r}</Link>}
                                    />
                                </SingleFieldList>
                            </ArrayField>
                        </Labeled>
                    </Grid>
                )}
                {record?.meta?.parentId && (
                    <Grid item xs={12}>
                        <Labeled>
                            <FunctionField
                                source="meta.parentId"
                                render={(r: any) => (
                                    <Link href={`#/transactions/${r.meta.parentId}/show`}>{r.meta.parentId}</Link>
                                )}
                            />
                        </Labeled>
                    </Grid>
                )}
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
                                <BooleanField label="resources.transactions.fields.dispute" source="dispute" />
                                <TextField
                                    label="resources.transactions.fields.meta.external_status"
                                    source="meta.external_status"
                                />
                            </Datagrid>
                        </ReferenceManyField>
                    </Labeled>
                </Grid>
                <Grid item>
                    <Button onClick={openStatusDialog}>{translate("resources.transactions.show.statusButton")}</Button>
                    <Button disabled={!record?.dispute} onClick={openStornoDialog}>
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
            <StornoDialog
                open={stornoDialogOpen}
                onClose={closeStornoDialog}
                accounts={accounts}
                currencies={sortedCurrencies}
            />
        </>
    );
};

export const TransactionShow = () => (
    <Show>
        <TransactionShowWidget />
    </Show>
);
