/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingAlertDialog } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { useGetAccounts } from "@/hooks";
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
    useDataProvider,
    useEditController,
    useInfiniteGetList,
    usePermissions,
    useRefresh,
    useTranslate
} from "react-admin";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EditWalletProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

enum WalletTypes {
    INTERNAL = "internal",
    LINKED = "linked",
    EXTERNAL = "external"
}

export const EditWallet = (props: EditWalletProps) => {
    const { id, onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const { permissions, isLoading: isFetchingPermissions } = usePermissions();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const isMerchant = permissions === "merchant";
    const { record, isLoading } = useEditController({
        resource: !isMerchant ? "wallet" : "merchant/wallet",
        id
    });
    const {
        data: accountsData,
        hasNextPage,
        isFetching,
        fetchNextPage: accountsNextPage
    } = useInfiniteGetList("accounts", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const accountScrollHandler = async e => {
        const target = e.target as HTMLElement;

        if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1) {
            accountsNextPage();
        }
    };

    const onSubmit: SubmitHandler<WalletCreate> = async data => {
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
            toast.error("Error", {
                description: translate("resources.wallet.manage.errors.errorWhenEditing")
            });
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
            toast.error("Error", {
                description: translate("resources.wallet.manage.errors.errorWhenEditing")
            });
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
        accountsData?.pages.forEach(page => {
            if (page.data.indexOf(record.account_id) < 0) {
                accountsNextPage();
            }
        });
        if (record) {
            form.reset({
                currency: record?.currency || "",
                description: record?.description || "",
                blockchain: record?.blockchain || "",
                minimal_ballance_limit: record?.minimal_ballance_limit || 0,
                network: record?.network || "",
                type: record?.type || WalletTypes.INTERNAL,
                account_id: record?.account_id || ""
            });
            formMerchant.reset({
                description: record?.description || ""
            });
        }
    }, [form, record, accountsData, formMerchant, accountsNextPage]);

    usePreventFocus({ dependencies: [record] });
    const accountsDisabled =
        !(accountsData && Array.isArray(accountsData.pages) && accountsData?.pages.length > 0) || !accountsData;

    if (isLoading || isFetchingPermissions) return <LoadingAlertDialog />;
    return (
        <FormProvider {...form}>
            {!isMerchant ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => {
                                return (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.walletType")}</FormLabel>
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
                            name="account_id"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.wallet.manage.fields.merchantName")}</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={accountsDisabled}>
                                            <FormControl>
                                                <SelectTrigger variant={SelectType.GRAY}>
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
                                            <Input {...field} className="bg-muted" variant={InputTypes.GRAY} disabled />
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
                                            <Input disabled {...field} className="bg-muted" variant={InputTypes.GRAY} />
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
                                            <Input disabled {...field} className="bg-muted" variant={InputTypes.GRAY} />
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
                                            <Input {...field} className="bg-muted" variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
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
                                        <div>
                                            <Label />
                                            <textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder={translate("resources.wallet.manage.fields.descr")}
                                                className="w-full h-24 p-2 border border-neutral-40 rounded resize-none overflow-auto bg-muted shadow-1 text-title-1"
                                            />
                                        </div>
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
                            variant="clearBtn"
                            className="border border-neutral-50 rounded-4 hover:border-neutral-100">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={formMerchant.handleSubmit(onSubmitMerchant)} className="flex flex-col gap-6 w-full">
                    <div className="flex flex-wrap">
                        <FormField
                            control={formMerchant.control}
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
                                                className="w-full h-24 p-2 border border-neutral-40 rounded resize-none overflow-auto bg-muted shadow-1 text-title-1 outline-none"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col items-center sm:self-end sm:flex-row items-center gap-4">
                        <Button type="submit" variant="default" className="w-full sm:w-auto">
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="clearBtn"
                            type="button"
                            className="border border-neutral-50 rounded-4 hover:border-neutral-100 w-full sm:w-auto">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            )}
        </FormProvider>
    );
};
