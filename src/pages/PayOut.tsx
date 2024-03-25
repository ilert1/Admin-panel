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
import { BF_MANAGER_URL } from "@/data/base";

export const PayOutPage = () => {
    const translate = useTranslate();
    const [payMethod, setPayMethod] = useState<any>("");
    const [sourceValue, setSourceValue] = useState("");
    const [destValue, setDestValue] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [cardInfo, setCardInfo] = useState("");

    const { isLoading: initialLoading, data: payMethods } = useQuery("paymethods", () =>
        fetch(`${BF_MANAGER_URL}/v1/manager/paymethods/payout`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const { mutate: payOutCreate, isLoading: payOutCreateLoading } = useMutation(() =>
        fetch(`${BF_MANAGER_URL}/v1/payout/create`, {
            method: "POST",
            body: JSON.stringify({
                source: {
                    amount: {
                        value: +sourceValue
                    }
                },
                destination: {
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
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const isLoading = useMemo(() => initialLoading || payOutCreateLoading, [initialLoading, payOutCreateLoading]);

    const handlePayMethodChange = (event: SelectChangeEvent) => {
        setPayMethod(event.target.value);
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
                        <TextField
                            type="number"
                            label={translate("pages.payOut.sourceValue")}
                            value={sourceValue}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setSourceValue(event.target.value);
                            }}
                        />
                        <TextField
                            type="number"
                            label={translate("pages.payOut.destValue")}
                            value={destValue}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setDestValue(event.target.value);
                            }}
                        />
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
                            disabled={!payMethod || !sourceValue || !destValue || !cardInfo || !cardHolder}
                            onClick={create}>
                            {translate("pages.payOut.create")}
                        </Button>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};
