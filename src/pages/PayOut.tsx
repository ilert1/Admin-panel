import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
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
    SelectChangeEvent
} from "@mui/material";
import { useTranslate } from "react-admin";

export const PayOutPage = () => {
    const translate = useTranslate();

    const [step, setStep] = useState(0);
    const [payMethod, setPayMethod] = useState<any>(null);

    const { isLoading: initialLoading, data: payMethods } = useQuery("paymethods", () =>
        fetch("https://bf-manager.bfgate.api4ftx.cloud/v1/manager/paymethods").then(response => response.json())
    );

    const isLoading = useMemo(() => initialLoading, [initialLoading]);

    const handlePayMethodChange = (event: SelectChangeEvent) => {
        setPayMethod(event.target.value);
    };

    useEffect(() => {
        if (payMethod) {
            setStep(step + 1);
        }
    }, [payMethod]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Card sx={{ mt: 6 }}>
            <CardContent>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : step === 0 ? (
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
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
                    </Stack>
                ) : null}
            </CardContent>
        </Card>
    );
};
