/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { useFetchDataForDirections } from "@/hooks";
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDataProvider, useInfiniteGetList, usePermissions, useRefresh, useTranslate } from "react-admin";
import { toast } from "sonner";
import { Form, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { WalletTypes } from "@/helpers/wallet-types";
import { Textarea } from "@/components/ui/textarea";
import { MerchantSelectFilter } from "../shared/MerchantSelectFilter";
import { isTRC20Address } from "@/helpers/isTRC20Address";

interface CreateWalletProps {
    onOpenChange: (state: boolean) => void;
    callbackData: (data: Wallets.Wallet) => void;
}

export const CreateWallet = (props: CreateWalletProps) => {
    const { onOpenChange, callbackData } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const { permissions, isLoading } = usePermissions();
    const { isLoading: loadingMerchantList, merchants } = useFetchDataForDirections();

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
        type: z.enum([WalletTypes.EXTERNAL, WalletTypes.INTERNAL, WalletTypes.LINKED]),
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
    const merchantsDisabled =
        !(merchants && Array.isArray(merchants.data) && merchants?.data?.length > 0) || !isMerchant;

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
                                render={({ field, fieldState }) => {
                                    return (
                                        <FormItem className="w-1/2 p-2">
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
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <Label className="">
                                            {translate("resources.wallet.manage.fields.merchantName")}
                                        </Label>
                                        <FormControl>
                                            <MerchantSelectFilter
                                                className="bg-white dark:bg-muted"
                                                merchant={field.value}
                                                onMerchantChanged={field.onChange}
                                                resource="accounts"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-1/2 p-2">
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
                                    <FormItem className="w-1/2 p-2">
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
                                    <FormItem className="w-1/2 p-2">
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
                                    <FormItem className="w-1/2 p-2">
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
                                    <FormItem className="w-full p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.descr")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder={translate("resources.wallet.manage.fields.descr")}
                                                className="w-full h-24 p-2 rounded resize-none overflow-auto dark:bg-muted text-title-1 outline-none"
                                            />
                                            {/* border border-neutral-60 */}
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
                                variant="outline_gray"
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
                                                    className=""
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
                                                <Textarea
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    placeholder={translate("resources.wallet.manage.fields.descr")}
                                                    className="w-full h-24 p-2 border rounded resize-none overflow-auto text-neutral-80 dark:text-white text-title-1 outline-none dark:bg-muted border-neutral-40"
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
                                variant="outline_gray"
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
