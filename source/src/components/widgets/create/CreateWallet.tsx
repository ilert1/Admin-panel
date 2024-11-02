/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateContextProvider, useCreateController, useDataProvider, useRefresh, useTranslate } from "react-admin";
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
    const toast = useToast();
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController();
    const refresh = useRefresh();

    const onSubmit: SubmitHandler<Omit<Wallet, "account_id">> = async data => {
        data.address = null;
        try {
            await dataProvider.create("wallet", { data: data });
            refresh();
            onOpenChange(false);
        } catch (error) {
            toast.toast({
                title: "Error"
            });
        }
    };

    const formSchema = z.object({
        type: z.enum([WalletTypes.EXTERNAL, WalletTypes.INTERNAL, WalletTypes.LINKED]),
        // id: z.string().min(1, translate("resources.wallet.manage.errors.id")),
        id: z.string(),
        address: z.string().nullable(),
        // Одно и тоже поле
        accountNumber: z.string(),
        merchantId: z.string(),
        //
        blockchain: z.string(),
        network: z.string(),
        currency: z.string(),
        description: z.string().nullable(),
        minimal_ballance_limit: z.coerce.number()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: WalletTypes.INTERNAL,
            id: "",
            address: "",
            merchantId: "",
            currency: "USDT",
            description: "",
            accountNumber: "",
            blockchain: "TRON",
            minimal_ballance_limit: 0,
            network: "TRC20"
        }
    });

    return (
        // <CreateContextProvider value={controllerProps}>
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                <div className="flex flex-wrap">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => {
                            return (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.wallet.manage.fields.walletType")}</FormLabel>
                                    <Select disabled value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={translate("resources.direction.fields.active")}
                                                    defaultValue={WalletTypes.INTERNAL}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={WalletTypes.EXTERNAL} variant={SelectType.GRAY}>
                                                    {WalletTypes.EXTERNAL}
                                                </SelectItem>
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
                        name="address"
                        render={({ field }) => (
                            <FormItem className="w-1/2 p-2">
                                <FormLabel>{translate("resources.wallet.manage.fields.walletAddress")}</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            {...field}
                                            className="bg-muted"
                                            variant={InputTypes.GRAY}
                                            value={field.value ?? ""}
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
                                <FormLabel>{translate("resources.wallet.manage.fields.accountNumber")}</FormLabel>
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
                        name="merchantId"
                        render={({ field }) => (
                            <FormItem className="w-1/2 p-2">
                                <FormLabel>{translate("resources.wallet.manage.fields.merchantId")}</FormLabel>
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
                        name="id"
                        render={({ field }) => (
                            <FormItem className="w-1/2 p-2">
                                <FormLabel>{translate("resources.wallet.manage.fields.internalId")}</FormLabel>
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
                                        <Input disabled {...field} className="bg-muted" variant={InputTypes.GRAY} />
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
        </FormProvider>
        // </CreateContextProvider>
    );
};
