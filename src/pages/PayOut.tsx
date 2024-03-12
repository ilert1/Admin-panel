import { useMemo, useState, ChangeEvent } from "react";
import { useQuery, useMutation } from "react-query";
import {
    Card,
    CardContent,
    Box,
    CircularProgress,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    TextField,
    Button
} from "@mui/material";
import { useTranslate } from "react-admin";

export const PayOutPage = () => {
    const translate = useTranslate();

    const [payMethod, setPayMethod] = useState<any>("");
    const [source, setSource] = useState<any>("");
    const [dest, setDest] = useState<any>("");
    const [sourceValue, setSourceValue] = useState("");
    const [destValue, setDestValue] = useState("");
    const [sourceCurrency, setSourceCurrency] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [cardInfo, setCardInfo] = useState("");

    const { isLoading: initialLoading, data: payMethods } = useQuery("paymethods", () =>
        fetch("https://bf-manager.bfgate.api4ftx.cloud/v1/manager/paymethods/payout").then(response => response.json())
    );

    const { isLoading: accountsLoading, data: accounts } = useQuery("accounts", () =>
        fetch("https://juggler.bfgate.api4ftx.cloud/accounts").then(response => response.json())
    );

    const { mutate: payOutCreate, isLoading: payOutCreateLoading } = useMutation(() =>
        fetch(`https://bf-manager.bfgate.api4ftx.cloud/v1/payout/create`, {
            method: "POST",
            body: JSON.stringify({
                source: {
                    id: source.id,
                    amount: {
                        currency: sourceCurrency,
                        value: +sourceValue
                    }
                },
                destination: {
                    id: dest.id,
                    amount: {
                        currency: payMethod?.fiatCurrency,
                        value: +destValue
                    }
                },
                meta: {
                    cardholder: cardHolder,
                    cardInfo,
                    paymentType: payMethod?.paymentType,
                    customerBank: payMethod?.bank
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
    );

    const isLoading = useMemo(
        () => initialLoading || accountsLoading || payOutCreateLoading,
        [initialLoading, accountsLoading, payOutCreateLoading]
    );
    const sourceAccounts = useMemo(() => accounts?.data?.filter((elem: any) => elem.type === 1), [accounts]);
    const destinationAccounts = useMemo(() => accounts?.data?.filter((elem: any) => elem.type === 2), [accounts]);
    const sourceCurrencies = useMemo(() => source?.amounts?.map((amount: any) => amount.currency), [source]);

    const handlePayMethodChange = (event: SelectChangeEvent) => {
        setPayMethod(event.target.value);
    };

    const handleSourceChange = (event: SelectChangeEvent) => {
        setSource(event.target.value);
    };

    const handleDestChange = (event: SelectChangeEvent) => {
        setDest(event.target.value);
    };

    const handleSourceCurrencyChange = (event: SelectChangeEvent) => {
        setSourceCurrency(event.target.value);
    };

    const create = () => {
        payOutCreate();
    };

    return (
        <Card sx={{ mt: 6 }}>
            <CardContent>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel>{translate("pages.payOut.payMethod")}</InputLabel>
                            <Select value={payMethod} onChange={handlePayMethodChange}>
                                {payMethods?.data?.map((method: any, i: number) => (
                                    <MenuItem key={i} value={method}>
                                        {`${method.bankName} (${method.paymentType})`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>{translate("pages.payOut.source")}</InputLabel>
                                <Select value={source} onChange={handleSourceChange}>
                                    {sourceAccounts?.map((acc: any) => (
                                        <MenuItem key={acc.id} value={acc}>
                                            {acc.meta.caption}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {sourceCurrencies?.length > 0 && (
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel>{translate("pages.payOut.sourceCurrency")}</InputLabel>
                                    <Select value={sourceCurrency} onChange={handleSourceCurrencyChange}>
                                        {sourceCurrencies?.map((curr: any, i: number) => (
                                            <MenuItem key={i} value={curr}>
                                                {curr}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <TextField
                                type="number"
                                label={translate("pages.payOut.sourceValue")}
                                value={sourceValue}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    setSourceValue(event.target.value);
                                }}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>{translate("pages.payOut.destination")}</InputLabel>
                                <Select value={dest} onChange={handleDestChange}>
                                    {destinationAccounts?.map((acc: any) => (
                                        <MenuItem key={acc.id} value={acc}>
                                            {acc.meta.caption}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {payMethod && (
                                <TextField
                                    label={translate("pages.payOut.destinationCurrency")}
                                    value={payMethod?.fiatCurrency}
                                    disabled
                                />
                            )}
                            <TextField
                                type="number"
                                label={translate("pages.payOut.destValue")}
                                value={destValue}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    setDestValue(event.target.value);
                                }}
                            />
                        </Stack>
                        <TextField
                            sx={{ m: 1, width: 300 }}
                            label={translate("pages.payOut.cardHolder")}
                            value={cardHolder}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setCardHolder(event.target.value);
                            }}
                        />
                        <TextField
                            sx={{ m: 1, width: 300 }}
                            type="number"
                            label={translate("pages.payOut.cardInfo")}
                            value={cardInfo}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setCardInfo(event.target.value);
                            }}
                        />
                        <Button
                            disabled={
                                !payMethod ||
                                !source ||
                                !sourceCurrency ||
                                !sourceValue ||
                                !dest ||
                                !destValue ||
                                !cardInfo ||
                                !cardHolder
                            }
                            onClick={create}>
                            {translate("pages.payOut.create")}
                        </Button>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};
