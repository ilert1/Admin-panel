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
import { WalletTypes } from "@/helpers/wallet-types";
import { Textarea } from "@/components/ui/textarea";
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
import { MerchantSelectFilter } from "../shared/MerchantSelectFilter";

interface EditWalletProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const EditWallet = ({ id, onOpenChange }: EditWalletProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const { permissions, isLoading: isFetchingPermissions } = usePermissions();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const isMerchant = permissions === "merchant";
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
    }, [form, record, formMerchant]);

    usePreventFocus({ dependencies: [record] });

    if (isLoading || isFetchingPermissions) return <LoadingBlock />;
    return (
        <FormProvider {...form}>
            {!isMerchant && record?.type !== WalletTypes.EXTERNAL ? (
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
                                                <SelectTrigger variant={SelectType.GRAY} className="">
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
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.wallet.manage.fields.merchantName")}</FormLabel>
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
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.wallet.manage.fields.currency")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                {...field}
                                                className="bg-muted "
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
                                                className="bg-muted "
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
                                                className="bg-muted "
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
                                            <Input
                                                {...field}
                                                className="bg-white dark:bg-muted "
                                                variant={InputTypes.GRAY}
                                            />
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
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder={translate("resources.wallet.manage.fields.descr")}
                                                className="w-full h-24 p-2 rounded resize-none overflow-auto bg-white dark:bg-muted text-title-1 "
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
                            variant="outline_gray"
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
                                                className="w-full h-24 p-2 border border-neutral-60 rounded resize-none overflow-auto text-title-1 text-neutral-80 dark:text-white outline-none dark:bg-muted"
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
                            className="w-full sm:w-auto">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            )}
        </FormProvider>
    );
};
