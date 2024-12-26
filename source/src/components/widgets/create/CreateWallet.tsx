/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingBlock } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { useFetchDataForDirections } from "@/hooks";
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDataProvider, useInfiniteGetList, usePermissions, useRefresh, useTranslate } from "react-admin";
import { toast } from "sonner";
import { Form, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { TronWeb } from "tronweb";

interface CreateWalletProps {
    onOpenChange: (state: boolean) => void;
    callbackData: (data: Wallets.Wallet) => void;
}

const isTRC20Address = (address: string): boolean => {
    return TronWeb.isAddress(address);
};

export const CreateWallet = (props: CreateWalletProps) => {
    const { onOpenChange, callbackData } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const { permissions, isLoading } = usePermissions();
    const { isLoading: loadingMerchantList, merchants } = useFetchDataForDirections();
    const {
        data: accountsData,
        hasNextPage,
        fetchNextPage: accountsNextPage
    } = useInfiniteGetList("accounts", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const accountScrollHandler = async (e: React.UIEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;

        if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1) {
            accountsNextPage();
        }
    };

    const isMerchant = permissions === "merchant";

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onSubmit: SubmitHandler<Wallets.WalletCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        delete data.merchantId;
        data.account_id = data.accountNumber;
        delete data.accountNumber;
        try {
            const json = await dataProvider.create<Wallets.Wallet>("wallet", { data: data });
            refresh();

            callbackData(json.data);
            onOpenChange(false);
        } catch (error) {
            toast.error(translate("resources.wallet.manage.error"), {
                dismissible: true,
                description: translate("resources.wallet.manage.errors.errorWhenCreating"),
                duration: 3000
            });
            setButtonDisabled(false);
        }
    };

    const onSubmitMerchant = async (data: { address: string; description: string | null }) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            const json = await dataProvider.create("merchant/wallet", { data });
            refresh();

            callbackData(json.data);
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
                let message;
                const jsonError = JSON.parse(error.message);
                if (jsonError.error_message.indexOf("already exists") >= 0) {
                    message = "alreadyExists";
                } else if (jsonError.error_message.indexOf("Server") >= 0) {
                    message = "serverError";
                } else {
                    message = "errorWhenCreating";
                }
                toast.error(translate("resources.wallet.manage.error"), {
                    dismissible: true,
                    description: translate(`resources.wallet.manage.errors.${message}`),
                    duration: 3000
                });
            }
            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        type: z.enum([Wallets.WalletTypes.EXTERNAL, Wallets.WalletTypes.INTERNAL, Wallets.WalletTypes.LINKED]),
        accountNumber: z.string().min(1, translate("resources.wallet.manage.errors.selectAccount")),
        blockchain: z.string(),
        network: z.string(),
        currency: z.string(),
        description: z.string().nullable(),
        minimal_ballance_limit: z.coerce
            .number()
            .int(translate("resources.wallet.manage.errors.intOnly"))
            .min(0, translate("resources.wallet.manage.errors.minBalance"))
    });

    const merchantFormSchema = z.object({
        address: z
            .string()
            .min(1, { message: translate("resources.wallet.manage.errors.addressRequired") })
            .refine(isTRC20Address, {
                message: translate("resources.wallet.manage.errors.invalidTRCAddresss")
            }),
        description: z.string().nullable()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: isMerchant ? Wallets.WalletTypes.EXTERNAL : Wallets.WalletTypes.INTERNAL,
            currency: "USDT",
            description: "",
            accountNumber: "",
            blockchain: "TRON",
            minimal_ballance_limit: 0,
            network: "TRC20"
        }
    });
    const merchantForm = useForm<z.infer<typeof merchantFormSchema>>({
        resolver: zodResolver(merchantFormSchema),
        defaultValues: {
            address: "",
            description: ""
        }
    });
    usePreventFocus({ dependencies: [] });
    const merchantsDisabled =
        !(merchants && Array.isArray(merchants.data) && merchants?.data?.length > 0) || !isMerchant;
    const accountsDisabled =
        !(accountsData && Array.isArray(accountsData.pages) && accountsData?.pages.length > 0) || !accountsData;

    if (isLoading || loadingMerchantList) return <LoadingBlock />;
    return (
        <>
            {!isMerchant ? (
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                        <div className="flex flex-wrap">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="w-1/2 p-2">
                                            <FormLabel>
                                                {translate("resources.wallet.manage.fields.walletType")}
                                            </FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={isMerchant}>
                                                <FormControl>
                                                    <SelectTrigger variant={SelectType.GRAY} className="shadow-1">
                                                        <SelectValue
                                                            placeholder={translate("resources.direction.fields.active")}
                                                            defaultValue={Wallets.WalletTypes.INTERNAL}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {!isMerchant ? (
                                                        <SelectGroup>
                                                            <SelectItem
                                                                value={Wallets.WalletTypes.LINKED}
                                                                variant={SelectType.GRAY}>
                                                                {Wallets.WalletTypes.LINKED}
                                                            </SelectItem>

                                                            <SelectItem
                                                                value={Wallets.WalletTypes.INTERNAL}
                                                                variant={SelectType.GRAY}>
                                                                {Wallets.WalletTypes.INTERNAL}
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    ) : (
                                                        <SelectGroup>
                                                            <SelectItem
                                                                value={Wallets.WalletTypes.EXTERNAL}
                                                                variant={SelectType.GRAY}>
                                                                {Wallets.WalletTypes.EXTERNAL}
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>
                                            {translate("resources.wallet.manage.fields.merchantName")}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={accountsDisabled}>
                                                <FormControl>
                                                    <SelectTrigger variant={SelectType.GRAY} className="shadow-1">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent
                                                    onScrollCapture={accountScrollHandler}
                                                    onScroll={accountScrollHandler}>
                                                    {accountsData?.pages.map(page => {
                                                        return page.data.map(account => (
                                                            <SelectItem
                                                                key={account.id}
                                                                value={account.id}
                                                                variant={SelectType.GRAY}>
                                                                <p className="truncate max-w-36">
                                                                    {account.meta?.caption
                                                                        ? account.meta.caption
                                                                        : account.owner_id}
                                                                </p>
                                                            </SelectItem>
                                                        ));
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.currency")}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input
                                                    {...field}
                                                    className="shadow-1"
                                                    variant={InputTypes.GRAY}
                                                    disabled
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="blockchain"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.blockchain")}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input
                                                    disabled
                                                    {...field}
                                                    className="shadow-1"
                                                    variant={InputTypes.GRAY}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="network"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.contactType")}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input
                                                    disabled
                                                    {...field}
                                                    className="shadow-1"
                                                    variant={InputTypes.GRAY}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="minimal_ballance_limit"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.minRemaini")}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input {...field} className="shadow-1" variant={InputTypes.GRAY} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.descr")}</FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder={translate("resources.wallet.manage.fields.descr")}
                                                className="w-full h-24 p-2 border border-neutral-60 rounded resize-none overflow-auto dark:bg-muted shadow-1 text-title-1 outline-none"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="self-end flex items-center gap-4">
                            <Button type="submit" variant="default">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                onClick={() => onOpenChange(false)}
                                variant="deleteGray"
                                type="button"
                                className="border border-neutral-50 rounded-4 hover:border-neutral-100">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            ) : (
                <FormProvider {...merchantForm}>
                    <form onSubmit={merchantForm.handleSubmit(onSubmitMerchant)} className="flex flex-col gap-6 w-full">
                        <div className="flex flex-wrap">
                            <FormField
                                control={merchantForm.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="w-full p-2">
                                        <FormLabel>
                                            {translate("resources.wallet.manage.fields.walletAddress")}
                                        </FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input
                                                    {...field}
                                                    className="shadow-1"
                                                    variant={InputTypes.GRAY}
                                                    value={field.value ?? ""}
                                                    disabled={!isMerchant}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={merchantForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.descr")}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Label />
                                                <textarea
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    placeholder={translate("resources.wallet.manage.fields.descr")}
                                                    className="w-full h-24 p-2 border border-neutral-60 rounded resize-none overflow-auto shadow-1 text-title-1 outline-none"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col sm:self-end sm:flex-row items-center gap-4">
                            <Button type="submit" variant="default" className="w-full sm:w-auto">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                onClick={() => onOpenChange(false)}
                                variant="deleteGray"
                                type="button"
                                className="border border-neutral-50 rounded-4 hover:border-neutral-100 w-full sm:w-auto">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </>
    );
};
