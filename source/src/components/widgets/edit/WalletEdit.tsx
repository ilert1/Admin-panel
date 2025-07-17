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
import { WalletTypes } from "@/helpers/wallet-types";
import { Textarea } from "@/components/ui/textarea";
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useDataProvider, useEditController, usePermissions, useRefresh, useTranslate } from "react-admin";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { PopoverSelect } from "../components/Selects/PopoverSelect";
import { useQuery } from "@tanstack/react-query";

interface EditWalletProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const EditWallet = ({ id, onOpenChange }: EditWalletProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const { permissions, isLoading: isFetchingPermissions } = usePermissions();

    const appToast = useAppToast();

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [accountsValueName, setAccountsValueName] = useState("");

    const isMerchant = permissions === "merchant";

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
        select: data => data?.data,
        enabled: !isMerchant
    });

    const accountsLoadingProcess = useMemo(
        () => isAccountsLoading || isAccountsFetching,
        [isAccountsLoading, isAccountsFetching]
    );

    const { record, isLoading } = useEditController({
        resource: !isMerchant ? "wallet" : "merchant/wallet",
        id,
        mutationMode: "pessimistic"
    });

    const onSubmit: SubmitHandler<Wallets.WalletCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            await dataProvider.update(!isMerchant ? "wallet" : "merchant/wallet", {
                id,
                data: data,
                previousData: undefined
            });
            refresh();
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.wallet.manage.errors.errorWhenEditing"));
            setButtonDisabled(false);
        }
    };

    const onSubmitMerchant: SubmitHandler<{ description: string | null }> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            await dataProvider.update("merchant/wallet", {
                id,
                data: data,
                previousData: undefined
            });
            refresh();
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.wallet.manage.errors.errorWhenEditing"));

            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        type: z.enum([WalletTypes.EXTERNAL, WalletTypes.INTERNAL, WalletTypes.LINKED]),
        blockchain: z.string().min(1),
        network: z.string().min(1),
        currency: z.string().min(1),
        description: z.string().nullable(),
        minimal_ballance_limit: z.coerce
            .number()
            .int(translate("resources.wallet.manage.errors.intOnly"))
            .min(0, translate("resources.wallet.manage.errors.minBalance")),
        account_id: z.string()
    });

    const formSchemaMerchant = z.object({
        description: z.string().nullable()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: WalletTypes.INTERNAL,
            currency: "USDT",
            description: "",
            blockchain: "TRON",
            minimal_ballance_limit: 0,
            network: "TRC20",
            account_id: ""
        }
    });
    const formMerchant = useForm<z.infer<typeof formSchemaMerchant>>({
        resolver: zodResolver(formSchemaMerchant),
        defaultValues: {
            description: ""
        }
    });

    useEffect(() => {
        if (record) {
            if (!isMerchant && accountsData && record?.type !== WalletTypes.EXTERNAL) {
                form.reset({
                    currency: record?.currency || "",
                    description: record?.description || "",
                    blockchain: record?.blockchain || "",
                    minimal_ballance_limit: record?.minimal_ballance_limit || 0,
                    network: record?.network || "",
                    type: record?.type || WalletTypes.INTERNAL,
                    account_id: record?.account_id || ""
                });

                const findAccount = accountsData?.find(account => account.id === record.account_id);
                setAccountsValueName(findAccount?.meta?.caption || findAccount?.owner_id || "");
            } else {
                formMerchant.reset({
                    description: record?.description || ""
                });
            }
        }
    }, [form, record, formMerchant, isMerchant, accountsData]);

    usePreventFocus({ dependencies: [record] });

    if (isLoading || isFetchingPermissions) return <LoadingBlock />;
    return (
        <FormProvider {...form}>
            {!isMerchant && record?.type !== WalletTypes.EXTERNAL ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <Label>{translate("resources.wallet.manage.fields.walletType")}</Label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger variant={SelectType.GRAY}>
                                                    <SelectValue
                                                        placeholder={translate("resources.direction.fields.active")}
                                                        defaultValue={WalletTypes.INTERNAL}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup className="p-0">
                                                    <SelectItem value={WalletTypes.LINKED} variant={SelectType.GRAY}>
                                                        {WalletTypes.LINKED}
                                                    </SelectItem>

                                                    <SelectItem value={WalletTypes.INTERNAL} variant={SelectType.GRAY}>
                                                        {WalletTypes.INTERNAL}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="account_id"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.wallet.manage.fields.merchantName")}</Label>
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
                                            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                            notFoundMessage={translate("resources.accounts.notFoundMessage")}
                                            isError={fieldState.invalid}
                                            errorMessage={fieldState.error?.message}
                                            disabled={accountsLoadingProcess}
                                            isLoading={accountsLoadingProcess}
                                            modal
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-muted"
                                            variant={InputTypes.GRAY}
                                            disabled
                                            label={translate("resources.wallet.manage.fields.currency")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="blockchain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled
                                            {...field}
                                            className="bg-muted"
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.wallet.manage.fields.blockchain")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="network"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled
                                            {...field}
                                            className="bg-muted"
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.wallet.manage.fields.contactType")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minimal_ballance_limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-white dark:bg-muted"
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.wallet.manage.fields.minRemaini")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-1 w-full md:col-span-2">
                                    <Label>{translate("resources.wallet.manage.fields.descr")}</Label>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            placeholder={translate("resources.wallet.manage.fields.descr")}
                                            className="h-24 w-full resize-none overflow-auto rounded border border-neutral-60 p-2 text-title-1 text-neutral-80 outline-none dark:bg-muted dark:text-white"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-4 self-end">
                        <Button type="submit" variant="default">
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline_gray"
                            className="rounded-4 border border-neutral-50 hover:border-neutral-100">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={formMerchant.handleSubmit(onSubmitMerchant)} className="flex w-full flex-col gap-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={formMerchant.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <Label>{translate("resources.wallet.manage.fields.descr")}</Label>
                                    <FormControl>
                                        <div>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder={translate("resources.wallet.manage.fields.descr")}
                                                className="h-24 w-full resize-none overflow-auto rounded border border-neutral-60 p-2 text-title-1 text-neutral-80 outline-none dark:bg-muted dark:text-white"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:self-end">
                        <Button type="submit" variant="default" className="w-full sm:w-auto">
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline_gray"
                            type="button"
                            className="w-full sm:w-auto">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            )}
        </FormProvider>
    );
};
