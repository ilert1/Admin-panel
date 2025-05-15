import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { useDataProvider, useTranslate } from "react-admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WalletMinimal } from "lucide-react";
import { Icon } from "../shared/Icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectType } from "@/components/ui/select";
import { CreateWalletDialog } from "../lists/Wallets";
import { LoadingBlock, LoadingBalance } from "@/components/ui/loading";
import BlowFishCross from "@/lib/icons/BlowFishCross.svg?react";
import { TextField } from "@/components/ui/text-field";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useAbortableInfiniteGetList } from "@/hooks/useAbortableInfiniteGetList";
import { useQuery } from "@tanstack/react-query";

export const CryptoTransferForm = (props: {
    loading: boolean;
    balance: number;
    transferState: "process" | "success" | "error";
    setTransferState: (transferState: "process" | "success" | "error") => void;
    create: (data: { address: string; amount: number; accuracy: number }) => void;
    showMessage: string;
    repeatData: { address: string; amount: number } | undefined;
}) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [checked, setChecked] = useState<boolean>(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [sendAmount, setSendAmount] = useState(0);
    const [chosenAddress, setChosenAddress] = useState("");
    const [lastUsedWallet, setLastUsedWallet] = useState("");
    const [shouldTrigger, setShouldTrigger] = useState(false);
    const [walletSelectOpen, setWalletSelectOpen] = useState(false);

    const appToast = useAppToast();

    const {
        data: walletsData,
        isFetched: walletsDataFetched,
        isFetching: walletsDataLoading,
        fetchNextPage: walletsNextPage
    } = useAbortableInfiniteGetList("merchant/wallet", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const walletScrollHandler = async (e: React.FormEvent) => {
        const target = e.target as HTMLElement;

        if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1) {
            walletsNextPage();
        }
    };
    const formSchema = z.object({
        address: z.string().regex(/T[A-Za-z1-9]{33}/, translate("app.widgets.forms.cryptoTransfer.addressMessage")),
        amount: z.coerce
            .number({ message: translate("app.widgets.forms.cryptoTransfer.nan") })
            .gt(2, translate("app.widgets.forms.cryptoTransfer.amountMinMessage"))
            .lte(
                props.balance,
                translate("app.widgets.forms.cryptoTransfer.amountMaxMessage", { amount: props.balance })
            )
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
            amount: undefined
        }
    });

    useEffect(() => {
        const isFound = checkAddress(chosenAddress);

        if (chosenAddress && isFound && isFound[0]) {
            form.reset({
                address: chosenAddress,
                amount: undefined
            });

            setChosenAddress("");

            if (checked) {
                setChecked(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chosenAddress, walletsData?.pages]);

    const amount = form.watch("amount");

    const accuracy = useMemo(() => Math.pow(10, String(amount).split(".")[1]?.length) || 100, [amount]);

    const totalAmount = useMemo(() => {
        if (amount > 2) {
            const val = Math.round((amount - 2) * accuracy) / accuracy;
            return val;
        }
        return 0;
    }, [amount, accuracy]);

    useEffect(() => {
        if (!props.loading) {
            setSendAmount(totalAmount);
        }
    }, [props.loading, totalAmount]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        props.create({
            ...values,
            accuracy
        });
    }

    const handleButtonAllTransfer = () => {
        if (!checked) {
            form.setValue("amount", props.balance, { shouldValidate: true, shouldDirty: true });
        } else {
            form.setValue("amount", 0, { shouldValidate: true, shouldDirty: true });
        }

        setChecked(!checked);
        form.setFocus("amount");
        form.trigger("amount");
    };

    const checkAddress = useCallback(
        (address: string) => {
            return walletsData?.pages.map(page => {
                return page.data.find(wallet => {
                    return wallet.address === address;
                });
            });
        },
        [walletsData?.pages]
    );

    useEffect(() => {
        if (props.repeatData) {
            const isFound = checkAddress(props.repeatData?.address);

            if (isFound && isFound[0]) {
                form.setValue("address", props.repeatData.address, { shouldDirty: true });
                form.setValue("amount", props.repeatData.amount, { shouldDirty: true });

                setShouldTrigger(true);

                if (checked) {
                    setChecked(false);
                }

                appToast(
                    "success",
                    translate("app.widgets.forms.cryptoTransfer.repeatDescription"),
                    translate("app.widgets.forms.cryptoTransfer.repeating")
                );
            } else {
                appToast("error", translate("app.widgets.forms.cryptoTransfer.noAddress"));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, props.repeatData]);

    useEffect(() => {
        if (shouldTrigger) {
            form.trigger(["address", "amount"]);
            setShouldTrigger(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldTrigger]);

    const { data: withdrawList } = useQuery({
        queryKey: ["withdrawList", "CryptoTransferForm"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList<Transaction.Transaction>("withdraw", {
                pagination: { page: 1, perPage: 1 },
                sort: { field: "id", order: "ASC" },
                filter: {},
                signal
            }),
        select: data => data?.data,
        enabled: props.transferState === "process" && walletsDataFetched
    });

    useEffect(() => {
        if (withdrawList && withdrawList.length > 0 && withdrawList[0]?.destination?.requisites) {
            const isFound = checkAddress(withdrawList[0]?.destination?.requisites[0]?.blockchain_address);

            if (isFound) {
                setLastUsedWallet(withdrawList[0]?.destination?.requisites[0]?.blockchain_address);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withdrawList]);

    if (props.loading || !props.balance) {
        return (
            <div className="flex max-w-[476px] flex-col items-center rounded-2xl bg-neutral-0 px-6 py-[50px] dark:bg-neutral-100 lg:w-[325px]">
                {props.loading ? (
                    <LoadingBlock />
                ) : (
                    <>
                        <BlowFishCross />
                        <TextField
                            wrap
                            className="text-center"
                            text={translate("app.widgets.forms.cryptoTransfer.insufficentBalance")}
                        />
                    </>
                )}
            </div>
        );
    }

    if (props.transferState === "process")
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="flex max-w-[476px] flex-col gap-4 rounded-2xl bg-neutral-0 px-6 py-4 dark:bg-neutral-100 lg:w-[325px]">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-note-1 text-neutral-80 dark:text-neutral-30">
                                            {translate("app.widgets.forms.cryptoTransfer.address")}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                open={walletSelectOpen}
                                                onOpenChange={setWalletSelectOpen}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={props.loading}>
                                                <FormControl>
                                                    <SelectTrigger
                                                        variant={SelectType.DEFAULT}
                                                        isError={fieldState.invalid}
                                                        errorMessage={<FormMessage />}>
                                                        <p className="truncate text-note-1">{field.value}</p>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent
                                                    onScrollCapture={walletScrollHandler}
                                                    onScroll={walletScrollHandler}>
                                                    {walletsDataLoading ? (
                                                        <div className="flex items-center justify-center p-4">
                                                            <LoadingBlock />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {lastUsedWallet && (
                                                                <SelectItem
                                                                    value={lastUsedWallet}
                                                                    variant={SelectType.DEFAULT}>
                                                                    <p className="max-w-[235px] text-wrap break-all text-note-1">
                                                                        {lastUsedWallet}
                                                                    </p>
                                                                    <p
                                                                        className="max-w-[235px] truncate text-note-2 text-neutral-50"
                                                                        style={{ bottom: "-.5" }}>
                                                                        {translate(
                                                                            "app.widgets.forms.cryptoTransfer.lastUsedWallet"
                                                                        )}
                                                                    </p>
                                                                </SelectItem>
                                                            )}
                                                            {walletsData?.pages.map(page => {
                                                                return page.data.map(wallet => {
                                                                    if (wallet.address !== lastUsedWallet) {
                                                                        return (
                                                                            <div
                                                                                key={wallet.id}
                                                                                className="relative flex flex-col gap-2 divide-solid divide-neutral-40 border-t dark:border-muted">
                                                                                <SelectItem
                                                                                    value={wallet.address}
                                                                                    variant={SelectType.DEFAULT}>
                                                                                    <div className="max-w-[235px]">
                                                                                        <div className="text-wrap break-all text-note-1">
                                                                                            {wallet.address}
                                                                                        </div>
                                                                                        <p
                                                                                            className="truncate text-note-2 text-neutral-50"
                                                                                            style={{ bottom: "-.5" }}>
                                                                                            {wallet.description}
                                                                                        </p>
                                                                                    </div>
                                                                                </SelectItem>
                                                                            </div>
                                                                        );
                                                                    }
                                                                });
                                                            })}
                                                            <div className="sticky bottom-0 z-10 flex h-[48px] w-full items-center bg-neutral-20 p-2 dark:bg-black">
                                                                <Button
                                                                    variant={"default"}
                                                                    className="flex h-full w-full items-center justify-center gap-[6px] px-[16px] py-[6px]"
                                                                    onClick={() => setCreateOpen(true)}>
                                                                    <WalletMinimal className="h-4 w-4" />
                                                                    <p className="text-title-1">
                                                                        {translate(
                                                                            "app.widgets.forms.cryptoTransfer.createNewWallet"
                                                                        )}
                                                                    </p>
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                autoComplete="off"
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate("app.widgets.forms.cryptoTransfer.amount")}
                                                {...field}
                                                onChange={e => {
                                                    field.onChange(e.target.value);
                                                    if (Number(e.target.value) === props.balance) {
                                                        setChecked(true);
                                                    } else {
                                                        setChecked(false);
                                                    }
                                                    form.trigger("amount");
                                                }}
                                                disabled={props.loading}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-1 items-center gap-2">
                                <label
                                    onClick={handleButtonAllTransfer}
                                    className="flex cursor-pointer items-center gap-2 self-start [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-neutral-60 bg-white transition-all dark:bg-black">
                                        {checked && (
                                            <div id="checked" className="h-2.5 w-2.5 rounded-full bg-green-50"></div>
                                        )}
                                    </div>
                                    <div className="text-sm font-normal text-neutral-60 transition-all">
                                        <p>{translate("app.widgets.forms.cryptoTransfer.allAmount")}</p>
                                        <p>({props.balance} USD₮)</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-1 gap-6 text-title-1">
                            <div className="flex flex-col items-start">
                                <span className="text-neutral-60 dark:text-neutral-40">
                                    {translate("app.widgets.forms.cryptoTransfer.commission")}
                                </span>
                                <span className="text-neutral-80 dark:text-neutral-30">2 USD₮</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-neutral-60 dark:text-neutral-40">
                                    {translate("app.widgets.forms.cryptoTransfer.totalAmount")}
                                </span>
                                <span className="text-neutral-80 dark:text-neutral-30">{sendAmount + " USD₮"}</span>
                            </div>
                        </div>
                        <Button
                            className="md:ml-auto"
                            disabled={props.loading || !form.formState.isDirty || !form.formState.isValid}
                            type="submit"
                            variant="default"
                            size="sm">
                            {!props.loading ? (
                                translate("app.widgets.forms.cryptoTransfer.createTransfer")
                            ) : (
                                <LoadingBalance className="h-[25px] w-[25px] overflow-hidden" />
                            )}
                        </Button>
                    </div>
                </form>
                <CreateWalletDialog
                    callbackData={data => {
                        if (data.address) {
                            setChosenAddress(data.address);
                            setWalletSelectOpen(false);
                            setShouldTrigger(true);
                        }
                    }}
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />
            </Form>
        );
    else if (props.transferState === "success" || props.transferState === "error")
        return (
            <div className="flex h-[308px] max-w-[476px] flex-col items-center justify-center gap-6 rounded-2xl bg-neutral-0 px-6 py-4 dark:bg-neutral-100">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-[114px]">
                        {props.transferState === "success" && <Icon name="BlowFishCheck" />}
                        {props.transferState === "error" && <Icon name="BlowFishCross" />}
                    </div>
                    <span className="text-title-2">
                        {props.showMessage && <div className="error-message">{props.showMessage}</div>}
                    </span>
                </div>
                <div>
                    <Button
                        className="md:ml-auto"
                        type="button"
                        variant="default"
                        onClick={() => {
                            form.reset();
                            props.setTransferState("process");
                        }}
                        size="sm">
                        {props.transferState === "success"
                            ? translate("app.widgets.forms.cryptoTransfer.successButton")
                            : translate("app.widgets.forms.cryptoTransfer.errorButton")}
                    </Button>
                </div>
            </div>
        );
    else return <></>;
};
