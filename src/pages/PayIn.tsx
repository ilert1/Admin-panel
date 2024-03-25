import { useMemo, useState, ChangeEvent, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import {
    Card,
    CardContent,
    CircularProgress,
    Box,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button,
    TextField,
    Typography
} from "@mui/material";
import { useTranslate, useDataProvider, useLocaleState } from "react-admin";
import { API_URL, BF_MANAGER_URL } from "@/data/base";

export const PayInPage = () => {
    const translate = useTranslate();

    const dataProvider = useDataProvider();

    const [locale] = useLocaleState();

    const [step, setStep] = useState(0);
    const [source, setSource] = useState("");
    const [dest, setDest] = useState("");
    const [sourceValue, setSourceValue] = useState("");
    const [destValue, setDestValue] = useState("");
    const [payMethod, setPayMethod] = useState<any>("");
    const [last4Digits, setLast4Digits] = useState("");

    const { isLoading: initialLoading, data: accounts } = useQuery("accounts", () =>
        fetch(`${API_URL}/accounts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const {
        isLoading: payMethodsLoading,
        data: payMethods,
        refetch: loadPayMethods
    } = useQuery(
        "pay-methods",
        () =>
            fetch(`${BF_MANAGER_URL}/v1/manager/paymethods`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            })
                .then(response => response.json())
                .then((json: any) => json.data),
        {
            refetchOnWindowFocus: false,
            enabled: false
        }
    );

    const {
        isLoading: transactionLoading,
        data: transaction,
        refetch: loadTransaction
    } = useQuery("transaction", () => dataProvider.getOne("transactions", { id: createResponse.data.id }), {
        refetchOnWindowFocus: false,
        enabled: [3, 4].includes(step),
        refetchInterval: (data): number | false => {
            if (
                (step === 3 &&
                    (!data?.data?.result?.data?.cardholder ||
                        !data?.data?.result?.data?.bank ||
                        !data?.data?.result?.data?.cardInfo)) ||
                (step === 4 && !data?.data?.state?.final)
            ) {
                return 3000;
            } else {
                return false;
            }
        }
    });

    const { data: currencies } = useQuery("currencies", () =>
        fetch(`${API_URL}/dictionaries/curr`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const sortedCurrencies = useMemo(() => {
        return currencies?.data?.sort((a: any, b: any) => a.prior_gr - b.prior_gr) || [];
    }, [currencies]);

    const sourceAccounts = useMemo(() => accounts?.data?.filter((elem: any) => elem.type === 2), [accounts]);
    const destinationAccounts = useMemo(() => accounts?.data?.filter((elem: any) => elem.type === 1), [accounts]);
    const [sourceCurrency, setSourceCurrency] = useState("");
    const [destCurrency, setDestCurrency] = useState("");

    const handleSourceChange = (event: SelectChangeEvent) => {
        setSource(event.target.value);
    };

    const handleDestChange = (event: SelectChangeEvent) => {
        setDest(event.target.value);
    };

    const handlePayMethodChange = (event: SelectChangeEvent) => {
        setPayMethod(event.target.value);
    };

    const handleSourceCurrencyChange = (event: SelectChangeEvent) => {
        setSourceCurrency(event.target.value);
    };

    const handleDestCurrencyChange = (event: SelectChangeEvent) => {
        setDestCurrency(event.target.value);
    };

    const {
        mutate: payInCreate,
        isLoading: payInCreateLoading,
        data: createResponse
    } = useMutation(() =>
        fetch(`${BF_MANAGER_URL}/v1/payin/create`, {
            method: "POST",
            body: JSON.stringify({
                source: {
                    id: source,
                    amount: {
                        currency: sourceCurrency,
                        value: +sourceValue
                    }
                },
                destination: {
                    id: dest,
                    amount: {
                        currency: destCurrency,
                        value: +destValue
                    }
                }
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const {
        mutate: payInStart,
        isLoading: payInStartLoading,
        data: startResponse
    } = useMutation(() =>
        fetch(`${BF_MANAGER_URL}/v1/payin/start`, {
            method: "POST",
            body: JSON.stringify({
                id: createResponse.data.id,
                message: {
                    payment: {
                        type: payMethod.paymentType,
                        bank: payMethod.bank
                    }
                }
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const {
        mutate: payInConfirm,
        isLoading: payInConfirmLoading,
        data: confirmResponse
    } = useMutation(() =>
        fetch(`${BF_MANAGER_URL}/v1/payin/confirm`, {
            method: "POST",
            body: JSON.stringify({
                id: createResponse.data.id,
                message: {
                    payment: {
                        customerCardLastDigits: last4Digits
                    }
                }
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    useEffect(() => {
        if (createResponse?.success) {
            setStep(1);
        }
    }, [createResponse]);

    useEffect(() => {
        if (startResponse?.success) {
            setStep(2);
        }
    }, [startResponse]);

    useEffect(() => {
        if (confirmResponse?.success) {
            setStep(3);
        }
    }, [confirmResponse]);

    useEffect(() => {
        if (step === 1) {
            loadPayMethods();
        } else if (step === 3) {
            loadTransaction();
        }
    }, [step]); //eslint-disable-line react-hooks/exhaustive-deps

    const isLoading = useMemo(
        () =>
            initialLoading ||
            payInCreateLoading ||
            payMethodsLoading ||
            payInStartLoading ||
            payInConfirmLoading ||
            transactionLoading,
        [
            initialLoading,
            payInCreateLoading,
            payMethodsLoading,
            payInStartLoading,
            payInConfirmLoading,
            transactionLoading
        ]
    );

    return (
        <Card sx={{ mt: 6 }}>
            <CardContent>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : step == 0 ? (
                    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>{translate("pages.payIn.source")}</InputLabel>
                                <Select value={source} onChange={handleSourceChange}>
                                    {sourceAccounts?.map((acc: any) => (
                                        <MenuItem key={acc.id} value={acc.id}>
                                            {acc.meta.caption}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                type="number"
                                label={translate("pages.payIn.sourceValue")}
                                value={sourceValue}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    setSourceValue(event.target.value);
                                }}
                            />
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>{translate("resources.transactions.fields.currency")}</InputLabel>
                                <Select value={sourceCurrency} onChange={handleSourceCurrencyChange}>
                                    {sortedCurrencies?.map?.((cur: any) => (
                                        <MenuItem key={cur.code} value={cur["alpha-3"]}>
                                            {`${cur["name-" + locale]} (${cur["alpha-3"]})`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>{translate("pages.payIn.destination")}</InputLabel>
                                <Select value={dest} onChange={handleDestChange}>
                                    {destinationAccounts?.map((acc: any) => (
                                        <MenuItem key={acc.id} value={acc.id}>
                                            {acc.meta.caption}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                type="number"
                                label={translate("pages.payIn.destValue")}
                                value={destValue}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    setDestValue(event.target.value);
                                }}
                            />
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>{translate("resources.transactions.fields.currency")}</InputLabel>
                                <Select value={destCurrency} onChange={handleDestCurrencyChange}>
                                    {sortedCurrencies?.map?.((cur: any) => (
                                        <MenuItem key={cur.code} value={cur["alpha-3"]}>
                                            {`${cur["name-" + locale]} (${cur["alpha-3"]})`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Button disabled={!source || !dest || !sourceValue || !destValue} onClick={() => payInCreate()}>
                            {translate("pages.payIn.createOrder")}
                        </Button>
                    </Stack>
                ) : step === 1 ? (
                    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel>{translate("pages.payIn.payMethods")}</InputLabel>
                            <Select value={payMethod} onChange={handlePayMethodChange}>
                                {payMethods?.map((method: any, i: number) => (
                                    <MenuItem key={i} value={method}>
                                        {method.bankName + " - " + method.paymentTypeName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button disabled={!payMethod} onClick={() => payInStart()}>
                            {translate("pages.payIn.select")}
                        </Button>
                    </Stack>
                ) : step === 2 ? (
                    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                        <TextField
                            inputProps={{ maxLength: 4 }}
                            label={translate("pages.payIn.last4Digits")}
                            value={last4Digits}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setLast4Digits(event.target.value);
                            }}
                        />
                        <Button disabled={last4Digits?.length < 4} onClick={() => payInConfirm()}>
                            {translate("pages.payIn.confirm")}
                        </Button>
                    </Stack>
                ) : step === 3 ? (
                    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                        <div>
                            <div>
                                <Typography variant="caption">{translate("pages.payIn.bank")}</Typography>
                                <Typography variant="body1">
                                    {transaction?.data?.result?.data?.bank || translate("pages.payIn.loadingInfo")}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption">{translate("pages.payIn.cardInfo")}</Typography>
                                <Typography variant="body1">
                                    {transaction?.data?.result?.data?.cardInfo || translate("pages.payIn.loadingInfo")}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption">{translate("pages.payIn.cardHolder")}</Typography>
                                <Typography variant="body1">
                                    {typeof transaction?.data?.result?.data?.cardholder === "string"
                                        ? transaction?.data?.result?.data?.cardholder
                                        : translate("pages.payIn.loadingInfo")}
                                </Typography>
                            </div>
                        </div>
                        <Button onClick={() => setStep(4)}>{translate("pages.payIn.done")}</Button>
                    </Stack>
                ) : step === 4 ? (
                    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Typography variant="body1">{transaction?.data?.state?.state_description}</Typography>
                        </Box>
                        {!transaction?.data?.state?.final && (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Stack>
                ) : null}
            </CardContent>
        </Card>
    );
};
