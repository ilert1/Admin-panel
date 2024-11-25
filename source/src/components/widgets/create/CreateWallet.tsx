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
import { useFetchDataForDirections, useGetAccounts } from "@/hooks";
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
    CreateContextProvider,
    useCreateController,
    useDataProvider,
    usePermissions,
    useRefresh,
    useTranslate
} from "react-admin";
import { toast } from "sonner";
import { Form, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface CreateWalletProps {
    onOpenChange: (state: boolean) => void;
}
enum WalletTypes {
    INTERNAL = "internal",
    LINKED = "linked",
    EXTERNAL = "external"
}

export const CreateWallet = (props: CreateWalletProps) => {
    const { onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController();

    const { permissions, isLoading } = usePermissions();
    const { isLoading: loadingMerchantList, merchants } = useFetchDataForDirections();
    const { isLoading: isLoadingAccounts, accounts } = useGetAccounts();

    const isMerchant = permissions === "merchant";

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onSubmit: SubmitHandler<WalletCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        delete data.address;
        delete data.merchantId;
        delete data.accountNumber;
        try {
            await dataProvider.create("wallet", { data: data });
            refresh();
            onOpenChange(false);
        } catch (error) {
            console.log(error);
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
            await dataProvider.create("merchant/wallet", { data });
            refresh();
            onOpenChange(false);
        } catch (error) {
            console.log(error);
            let message;
            if (error.status === 500) {
                message = "serverError";
            } else {
                message = "errorWhenCreating";
            }
            toast.error(translate("resources.wallet.manage.error"), {
                dismissible: true,
                description: translate(`resources.wallet.manage.errors.${message}`),
                duration: 3000
            });
            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        type: z.enum([WalletTypes.EXTERNAL, WalletTypes.INTERNAL, WalletTypes.LINKED]),
        address: z.string().nullable(),
        // Одно и тоже поле
        accountNumber: z.string().min(1, translate("resources.wallet.manage.errors.selectAccount")),
        merchantId: z.string(),
        //
        blockchain: z.string(),
        network: z.string(),
        currency: z.string(),
        description: z.string().nullable(),
        minimal_ballance_limit: z.coerce.number()
    });
    const merchantFormSchema = z.object({
        address: z.string().min(1),
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
    const accountsDisabled = !(accounts && Array.isArray(accounts) && accounts?.length > 0) || !accounts;

    if (isLoading || loadingMerchantList || isLoadingAccounts) return <LoadingAlertDialog />;
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
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>
                                            {translate("resources.wallet.manage.fields.walletAddress")}
                                        </FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input
                                                    {...field}
                                                    className="bg-muted"
                                                    variant={InputTypes.GRAY}
                                                    value={field.value ?? ""}
                                                    disabled={!isMerchant}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>
                                            {translate("resources.wallet.manage.fields.accountNumber")}
                                        </FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input
                                                    {...field}
                                                    className="bg-muted"
                                                    variant={InputTypes.GRAY}
                                                    disabled={isMerchant}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="merchantId"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.merchantId")}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={merchantsDisabled}>
                                                    <FormControl>
                                                        <SelectTrigger variant={SelectType.GRAY}>
                                                            <SelectValue placeholder={""} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {!merchantsDisabled
                                                                ? merchants.data.map(merchant => (
                                                                      <SelectItem
                                                                          key={merchant.name}
                                                                          value={merchant.id}
                                                                          variant={SelectType.GRAY}>
                                                                          {merchant.name}
                                                                      </SelectItem>
                                                                  ))
                                                                : ""}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </FormControl>
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
                                                    className="bg-muted"
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
                                name="id"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 p-2">
                                        <FormLabel>{translate("resources.wallet.manage.fields.internalId")}</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input
                                                    {...field}
                                                    className="bg-muted"
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
                                                    className="bg-muted"
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
                                                    className="bg-muted"
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
                                                    className="w-full h-24 p-2 border border-neutral-40 rounded resize-none overflow-auto bg-muted shadow-1 text-title-1 outline-none"
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
                                                    className="bg-muted"
                                                    variant={InputTypes.GRAY}
                                                    value={field.value ?? ""}
                                                    disabled={!isMerchant}
                                                />
                                            </div>
                                        </FormControl>
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
                                                    className="w-full h-24 p-2 border border-neutral-40 rounded resize-none overflow-auto bg-muted shadow-1 text-title-1 outline-none"
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
                                variant="clearBtn"
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
