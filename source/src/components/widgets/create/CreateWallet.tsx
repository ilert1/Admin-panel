import { Button } from "@/components/ui/Button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
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
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useDataProvider, usePermissions, useRefresh, useTranslate } from "react-admin";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { WalletTypes } from "@/helpers/wallet-types";
import { Textarea } from "@/components/ui/textarea";
import { isTRC20Address } from "@/helpers/isTRC20Address";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useSheets } from "@/components/providers/SheetProvider";
import { PopoverSelect } from "../components/Selects/PopoverSelect";
import { useQuery } from "@tanstack/react-query";
interface CreateWalletProps {
    onOpenChange: (state: boolean) => void;
    callbackData: (data: Wallets.Wallet) => void;
}

export const CreateWallet = (props: CreateWalletProps) => {
    const { onOpenChange, callbackData } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const { openSheet } = useSheets();
    const appToast = useAppToast();

    const { permissions, isLoading } = usePermissions();

    const isMerchant = permissions === "merchant";

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [accountsValueName, setAccountsValueName] = useState("");

    const {
        data: accountsData,
        isFetching: isAccountsFetching,
        isLoading: isAccountsLoading
    } = useQuery({
        queryKey: ["accounts", "getListWithoutPagination"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList("accounts", {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "name", asc: "ASC" },
                signal
            }),
        select: data => data?.data
    });

    const accountsLoadingProcess = useMemo(
        () => isAccountsLoading || isAccountsFetching,
        [isAccountsLoading, isAccountsFetching]
    );

    const onSubmit: SubmitHandler<Wallets.WalletCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        delete data.merchantId;
        data.account_id = data.accountNumber;
        delete data.accountNumber;
        try {
            const res = await dataProvider.create<Wallets.Wallet>("wallet", { data: data });

            appToast(
                "success",
                <>
                    <p>{translate("resources.wallet.manage.success.create")}</p>
                    <Button variant="resourceLink" onClick={() => openSheet("wallet", { id: res.data.id })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();

            callbackData(res.data);
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.wallet.manage.errors.errorWhenCreating"));
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

                appToast("error", translate(`resources.wallet.manage.errors.${message}`));
            }
            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        type: z.enum([WalletTypes.EXTERNAL, WalletTypes.INTERNAL, WalletTypes.LINKED]),
        accountNumber: z
            .string({ message: translate("resources.wallet.manage.errors.selectAccount") })
            .min(1, translate("resources.wallet.manage.errors.selectAccount")),
        blockchain: z.string(),
        network: z.string(),
        currency: z.string(),
        description: z.string().nullable(),
        minimal_ballance_limit: z.coerce
            .number({ message: translate("resources.wallet.manage.errors.intOnly") })
            .int(translate("resources.wallet.manage.errors.intOnly"))
            .min(0, translate("resources.wallet.manage.errors.minBalance"))
    });

    const merchantFormSchema = z.object({
        address: z
            .string({ message: translate("resources.wallet.manage.errors.addressRequired") })
            .min(1, { message: translate("resources.wallet.manage.errors.addressRequired") })
            .refine(isTRC20Address, {
                message: translate("resources.wallet.manage.errors.invalidTRCAddresss")
            }),
        description: z.string().nullable()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: isMerchant ? WalletTypes.EXTERNAL : WalletTypes.INTERNAL,
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

    if (isLoading) return <LoadingBlock />;

    return (
        <>
            {!isMerchant ? (
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field, fieldState }) => {
                                    return (
                                        <FormItem>
                                            <Label>{translate("resources.wallet.manage.fields.walletType")}</Label>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={isMerchant}>
                                                <FormControl>
                                                    <SelectTrigger
                                                        variant={SelectType.GRAY}
                                                        isError={fieldState.invalid}
                                                        errorMessage={<FormMessage />}>
                                                        <SelectValue
                                                            placeholder={translate("resources.direction.fields.active")}
                                                            defaultValue={WalletTypes.INTERNAL}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {!isMerchant ? (
                                                        <SelectGroup>
                                                            <SelectItem
                                                                value={WalletTypes.LINKED}
                                                                variant={SelectType.GRAY}>
                                                                {WalletTypes.LINKED}
                                                            </SelectItem>

                                                            <SelectItem
                                                                value={WalletTypes.INTERNAL}
                                                                variant={SelectType.GRAY}>
                                                                {WalletTypes.INTERNAL}
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    ) : (
                                                        <SelectGroup>
                                                            <SelectItem
                                                                value={WalletTypes.EXTERNAL}
                                                                variant={SelectType.GRAY}>
                                                                {WalletTypes.EXTERNAL}
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
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label className="">
                                            {translate("resources.wallet.manage.fields.merchantName")}
                                        </Label>
                                        <FormControl>
                                            <PopoverSelect
                                                variants={accountsData || []}
                                                value={accountsValueName}
                                                idField="id"
                                                setIdValue={field.onChange}
                                                onChange={setAccountsValueName}
                                                variantKey={variant =>
                                                    variant?.["meta"]?.["caption"] || variant?.["owner_id"]
                                                }
                                                placeholder={translate("resources.accounts.selectPlaceholder")}
                                                commandPlaceholder={translate(
                                                    "app.widgets.multiSelect.searchPlaceholder"
                                                )}
                                                notFoundMessage={translate("resources.accounts.notFoundMessage")}
                                                isError={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                                disabled={accountsLoadingProcess}
                                                isLoading={accountsLoadingProcess}
                                                modal
                                            />
                                        </FormControl>
                                        <FormMessage className="inline !text-note-1 text-red-40" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate("resources.wallet.manage.fields.currency")}
                                                disabled
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="blockchain"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled
                                                {...field}
                                                label={translate("resources.wallet.manage.fields.blockchain")}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="network"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled
                                                {...field}
                                                label={translate("resources.wallet.manage.fields.contactType")}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="minimal_ballance_limit"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className=""
                                                label={translate("resources.wallet.manage.fields.minRemaini")}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full md:col-span-2">
                                        <Label>{translate("resources.wallet.manage.fields.descr")}</Label>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder={translate("resources.wallet.manage.fields.descr")}
                                                className="h-24 w-full resize-none overflow-auto rounded text-title-1 outline-none dark:bg-muted"
                                            />
                                            {/* border border-neutral-60 */}
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                            <Button type="submit" variant="default">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                onClick={() => onOpenChange(false)}
                                variant="outline_gray"
                                type="button"
                                className="rounded-4 border border-neutral-50 hover:border-neutral-100">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            ) : (
                <FormProvider {...merchantForm}>
                    <form onSubmit={merchantForm.handleSubmit(onSubmitMerchant)} className="flex w-full flex-col gap-6">
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={merchantForm.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                label={translate("resources.wallet.manage.fields.walletAddress")}
                                                {...field}
                                                className=""
                                                variant={InputTypes.GRAY}
                                                value={field.value ?? ""}
                                                disabled={!isMerchant}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={merchantForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <Label>{translate("resources.wallet.manage.fields.descr")}</Label>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder={translate("resources.wallet.manage.fields.descr")}
                                                className="h-24 w-full resize-none overflow-auto rounded border border-neutral-40 text-title-1 text-neutral-80 outline-none dark:bg-muted dark:text-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                            <Button type="submit" variant="default" className="w-full sm:w-auto">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                onClick={() => onOpenChange(false)}
                                variant="outline_gray"
                                type="button"
                                className="w-full rounded-4 border border-neutral-50 hover:border-neutral-100 sm:w-auto">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </>
    );
};
