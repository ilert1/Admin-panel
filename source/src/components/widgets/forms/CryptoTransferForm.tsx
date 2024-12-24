import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useDataProvider, useInfiniteGetList, useTranslate } from "react-admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert, WalletMinimal } from "lucide-react";
import { Icon } from "../shared/Icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectType } from "@/components/ui/select";
import { CreateWalletDialog } from "../lists/Wallets";
import { LoadingBalance } from "@/components/ui/loading";
import { toast } from "sonner";
import { useQuery } from "react-query";

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

    const {
        data: walletsData,
        isFetched: walletsDataFetched,
        fetchNextPage: walletsNextPage
    } = useInfiniteGetList("merchant/wallet", {
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
        // console.log(values);
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

                toast.success(translate("app.widgets.forms.cryptoTransfer.repeating"), {
                    description: translate("app.widgets.forms.cryptoTransfer.repeatDescription"),
                    duration: 3000,
                    dismissible: true
                });
            } else {
                toast.error(translate("app.widgets.forms.cryptoTransfer.error"), {
                    description: translate("app.widgets.forms.cryptoTransfer.noAddress"),
                    duration: 3000,
                    dismissible: true
                });
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

    useQuery(
        "withdrawList",
        () =>
            dataProvider
                .getList("withdraw", {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: "id", order: "ASC" },
                    filter: {}
                })
                .then(({ data }) => {
                    const isFound = checkAddress(data[0].destination.requisites[0].blockchain_address);
                    if (isFound) {
                        setLastUsedWallet(data[0].destination.requisites[0].blockchain_address);
                    }
                }),
        { enabled: props.transferState === "process" && walletsDataFetched }
    );

    if (props.transferState === "process")
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="flex flex-col lg:w-[325px] max-w-[476px] px-6 py-4 bg-neutral-0 rounded-2xl gap-4">
                        <div className="flex-1">
                            <FormField
                                disabled={props.loading}
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-note-1">
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
                                                    <SelectTrigger variant={SelectType.DEFAULT}>
                                                        <span className="truncate">{field.value}</span>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent
                                                    onScrollCapture={walletScrollHandler}
                                                    onScroll={walletScrollHandler}>
                                                    {lastUsedWallet && (
                                                        <SelectItem value={lastUsedWallet} variant={SelectType.DEFAULT}>
                                                            <p className="truncate max-w-[235px]">{lastUsedWallet}</p>
                                                            <p
                                                                className="truncate max-w-[235px] text-note-2 text-neutral-50"
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
                                                                        className="relative flex flex-col gap-2">
                                                                        <SelectItem
                                                                            value={wallet.address}
                                                                            variant={SelectType.DEFAULT}>
                                                                            <p className="truncate max-w-[235px]">
                                                                                {wallet.address}
                                                                            </p>
                                                                            <p
                                                                                className="truncate max-w-[235px] text-note-2 text-neutral-50"
                                                                                style={{ bottom: "-.5" }}>
                                                                                {wallet.description}
                                                                            </p>
                                                                        </SelectItem>
                                                                    </div>
                                                                );
                                                            }
                                                        });
                                                    })}
                                                    <div className="sticky bottom-0 bg-neutral-20 dark:bg-black p-2 z-10 flex items-center w-full h-[48px]">
                                                        <Button
                                                            variant={"default"}
                                                            className="h-full py-[6px] px-[16px] w-full flex gap-[6px] justify-center items-center"
                                                            onClick={() => setCreateOpen(true)}>
                                                            <WalletMinimal className="w-4 h-4" />
                                                            <p className="text-title-1">
                                                                {translate(
                                                                    "app.widgets.forms.cryptoTransfer.createNewWallet"
                                                                )}
                                                            </p>
                                                        </Button>
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <FormField
                                disabled={props.loading}
                                control={form.control}
                                name="amount"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-note-1">
                                            {translate("app.widgets.forms.cryptoTransfer.amount")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="off"
                                                className={`${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}
                                                onChange={e => {
                                                    field.onChange(e.target.value);
                                                    if (Number(e.target.value) === props.balance) {
                                                        setChecked(true);
                                                    } else {
                                                        setChecked(false);
                                                    }
                                                    form.trigger("amount");
                                                }}>
                                                {fieldState.invalid && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <TriangleAlert
                                                                    className="text-red-40"
                                                                    width={14}
                                                                    height={14}
                                                                />
                                                            </TooltipTrigger>

                                                            <TooltipContent
                                                                className="border-none bottom-0"
                                                                side="left">
                                                                <FormMessage />
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex-1 flex gap-2 items-center">
                                <label
                                    onClick={handleButtonAllTransfer}
                                    className="flex gap-2 items-center self-start cursor-pointer [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                                    <div className="relative w-4 h-4 rounded-full border transition-all bg-white dark:bg-black border-neutral-60 flex justify-center items-center">
                                        {checked && (
                                            <div id="checked" className="w-2.5 h-2.5 rounded-full bg-green-50"></div>
                                        )}
                                    </div>
                                    <div className="font-normal text-sm text-neutral-60 transition-all">
                                        <p>{translate("app.widgets.forms.cryptoTransfer.allAmount")}</p>
                                        <p>({props.balance} USD₮)</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="flex-1 flex gap-6 text-title-1">
                            <div className="flex flex-col items-start">
                                <span className="text-neutral-60 dark:text-neutral-40">
                                    {translate("app.widgets.forms.cryptoTransfer.commission")}
                                </span>
                                <span>2 USD₮</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-neutral-60 dark:text-neutral-40">
                                    {translate("app.widgets.forms.cryptoTransfer.totalAmount")}
                                </span>
                                <span>{sendAmount + " USD₮"}</span>
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
                                <LoadingBalance className="w-[25px] h-[25px] overflow-hidden" />
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
            <div className="flex flex-col max-w-[476px] h-[308px] px-6 py-4 bg-neutral-0 rounded-2xl gap-6 justify-center items-center">
                <div className="flex flex-col gap-2 items-center">
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
