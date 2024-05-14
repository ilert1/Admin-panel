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
    Button,
    InputAdornment
} from "@mui/material";
import { useNotify, useTranslate, useLocaleState } from "react-admin";
import { BF_MANAGER_URL, API_URL } from "@/data/base";

export const PayOutPage = () => {
    const translate = useTranslate();
    const [payMethod, setPayMethod] = useState<any>("");
    const [destValue, setDestValue] = useState("");
    const [additionalFieldValues, setAdditionalFiledValues] = useState<Record<string, string>>({});

    const notify = useNotify();

    const [locale] = useLocaleState();

    const { data: currencies } = useQuery("currencies", () =>
        fetch(`${API_URL}/dictionaries/curr`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const { isLoading: initialLoading, data: payMethods } = useQuery("paymethods", () => {
        return fetch(`${BF_MANAGER_URL}/v1/payout/paymethods`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json());
    });

    const additionalFields = useMemo(() => {
        return payMethod?.fields?.filter?.((f: any) => !f.hidden && f.required) || [];
    }, [payMethod]);

    const { mutate: payOutCreate, isLoading: payOutCreateLoading } = useMutation(() =>
        fetch(`${BF_MANAGER_URL}/v1/payout/create`, {
            method: "POST",
            body: JSON.stringify({
                destination: {
                    amount: {
                        currency: payMethod?.fiatCurrency,
                        value: {
                            quantity: +destValue * 100,
                            accuracy: 100
                        }
                    }
                },
                meta: {
                    ...additionalFieldValues,
                    paymentType: payMethod?.paymentType,
                    customerBank: payMethod?.bank
                }
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json.success) {
                    setPayMethod("");
                    setDestValue("");
                    notify(translate("pages.payOut.success"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                notify(e.message, { type: "error" });
            })
    );

    const isLoading = useMemo(() => initialLoading || payOutCreateLoading, [initialLoading, payOutCreateLoading]);

    const canPayout = useMemo(() => {
        return (
            payMethod &&
            destValue &&
            additionalFields.reduce((acc: boolean, curr: any) => acc && !!additionalFieldValues[curr.name], [true])
        );
    }, [payMethod, destValue, additionalFieldValues, additionalFields]);

    const handlePayMethodChange = (event: SelectChangeEvent) => {
        setPayMethod(event.target.value);
    };

    const handleAdditionalFieldChange = (key: string, value: string) => {
        setAdditionalFiledValues(current => {
            current[key] = value;
            return { ...current };
        });
    };

    const create = () => {
        payOutCreate();
    };

    const translateField = (key: string) => {
        switch (key) {
            case "cardholder":
                return translate("pages.payOut.cardHolder");
            case "cardInfo":
                return translate("pages.payOut.cardInfo");
            default:
                return key;
        }
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
                        <FormControl sx={{ m: 1, width: 340 }}>
                            <InputLabel>{translate("pages.payOut.payMethod")}</InputLabel>
                            <Select value={payMethod} onChange={handlePayMethodChange}>
                                {payMethods?.data?.map((method: any, i: number) => (
                                    <MenuItem key={i} value={method}>
                                        {`${method.bankName} (${method.paymentTypeName}, ${method.fiatCurrency})`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            sx={{ m: 1, width: 340 }}
                            type="number"
                            label={translate("pages.payOut.destValue")}
                            value={destValue}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setDestValue(event.target.value);
                            }}
                            InputProps={{
                                endAdornment: payMethod?.fiatCurrency ? (
                                    <InputAdornment position="start">{`${
                                        currencies?.data?.find((c: any) => c["alpha-3"] === payMethod?.fiatCurrency)?.[
                                            "name-" + locale
                                        ]
                                    } (${
                                        currencies?.data?.find((c: any) => c["alpha-3"] === payMethod?.fiatCurrency)?.[
                                            "alpha-3"
                                        ]
                                    })`}</InputAdornment>
                                ) : (
                                    ""
                                )
                            }}
                        />

                        {additionalFields.map((f: any, i: number) => (
                            <TextField
                                key={i}
                                sx={{ m: 1, width: 340 }}
                                label={translateField(f.name)}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    handleAdditionalFieldChange(f.name, event.target.value);
                                }}
                            />
                        ))}
                        <Button disabled={!canPayout} onClick={create}>
                            {translate("pages.payOut.create")}
                        </Button>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};
