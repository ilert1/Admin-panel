import { useEditController, EditContextProvider, useTranslate, useRefresh, fetchUtils } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { TronWeb } from "tronweb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { usePreventFocus } from "@/hooks";

const BF_MANAGER_URL = import.meta.env.VITE_BF_MANAGER_URL;

interface AccountEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const AccountEdit = ({ id, onOpenChange }: AccountEditProps) => {
    const controllerProps = useEditController({ resource: "accounts", id, mutationMode: "pessimistic" });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const translate = useTranslate();
    const refresh = useRefresh();

    const isTRC20Address = (address: string): boolean => {
        return TronWeb.isAddress(address);
    };

    const formSchema = z.object({
        account_id: z.string(),
        name: z.string().min(1).trim(),
        wallet_create: z.boolean().default(false),
        wallet_type: z.enum([Wallets.WalletTypes.EXTERNAL, Wallets.WalletTypes.INTERNAL, Wallets.WalletTypes.LINKED]),
        tron_wallet: z
            .string()
            .trim()
            .refine(isTRC20Address, {
                message: translate("resources.wallet.manage.errors.invalidTRCAddresss")
            })
            .optional()
            .or(z.literal("")),
        tron_address: z
            .string()
            .trim()
            .refine(isTRC20Address, {
                message: translate("resources.wallet.manage.errors.invalidTRCAddresss")
            })
            .optional()
            .or(z.literal("")),
        reward_account: z.string().trim().uuid().optional().or(z.literal("")),
        provider_account: z.string().trim().uuid().optional().or(z.literal(""))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            account_id: "",
            name: "",
            wallet_create: false,
            wallet_type: Wallets.WalletTypes.INTERNAL,
            tron_wallet: "",
            tron_address: "",
            reward_account: "",
            provider_account: ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                account_id: controllerProps.record?.id || id,
                name: controllerProps.record?.meta?.caption || "",
                wallet_create: controllerProps.record?.wallet_create || false,
                wallet_type: controllerProps.record?.wallet_type || Wallets.WalletTypes.INTERNAL,
                tron_wallet: controllerProps.record?.meta?.tron_wallet || "",
                tron_address: controllerProps.record?.meta?.tron_address || "",
                reward_account: controllerProps.record?.meta?.reward_account || "",
                provider_account: controllerProps.record?.meta?.provider_account || ""
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, controllerProps.record]);

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/account`, {
                method: "PUT",
                body: JSON.stringify(data),
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                throw new Error(json.error);
            }

            refresh();
            onOpenChange(false);
        } catch (error) {
            setSubmitButtonDisabled(false);
            toast.error("Error", {
                description: "Something went wrong",
                dismissible: true,
                duration: 3000
            });
        }
    };

    usePreventFocus({ dependencies: [controllerProps.record] });

    if (controllerProps.isLoading || !controllerProps.record)
        return (
            <div className="h-[150px]">
                <Loading />
            </div>
        );

    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormLabel>{translate("resources.accounts.editFields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}
                                                variant={InputTypes.GRAY}>
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
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="wallet_create"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormLabel>{translate("resources.accounts.editFields.wallet_create")}</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={value => field.onChange(value === "true")}>
                                        <FormControl>
                                            <SelectTrigger
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                variant={SelectType.GRAY}>
                                                <div className="mr-auto">
                                                    <SelectValue
                                                        placeholder={translate("resources.accounts.fields.active")}
                                                    />
                                                </div>
                                                {fieldState.invalid && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="ml-3 order-3" asChild>
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
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="true" variant={SelectType.GRAY}>
                                                    {translate("resources.accounts.editFields.stateActive")}
                                                </SelectItem>
                                                <SelectItem value="false" variant={SelectType.GRAY}>
                                                    {translate("resources.accounts.editFields.stateInactive")}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="wallet_type"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormLabel>{translate("resources.accounts.editFields.wallet_type")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                variant={SelectType.GRAY}>
                                                <div className="mr-auto">
                                                    <SelectValue
                                                        placeholder={translate("resources.direction.fields.active")}
                                                        defaultValue={Wallets.WalletTypes.INTERNAL}
                                                    />
                                                </div>
                                                {fieldState.invalid && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="ml-3 order-3" asChild>
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
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
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
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={form.getValues("wallet_create")}
                            control={form.control}
                            name="tron_wallet"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormLabel>{translate("resources.accounts.editFields.tron_wallet")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                className={`dark:bg-muted text-sm text-neutral-100 ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}
                                                variant={InputTypes.GRAY}>
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
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tron_address"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormLabel>{translate("resources.accounts.editFields.tron_address")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}
                                                variant={InputTypes.GRAY}>
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
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="provider_account"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full  p-2">
                                    <FormLabel>{translate("resources.accounts.editFields.provider_account")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}
                                                value={field.value ?? ""}
                                                variant={InputTypes.GRAY}>
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
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reward_account"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormLabel>{translate("resources.accounts.editFields.reward_account")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}
                                                variant={InputTypes.GRAY}>
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
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full mt-4 md:mt-0 md:w-2/5 p-2 ml-auto flex flex-col gap-3 sm:gap-0 sm:flex-row space-x-0 sm:space-x-2">
                        <Button type="submit" variant="default" className="flex-1" disabled={submitButtonDisabled}>
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button
                            type="button"
                            variant="deleteGray"
                            className="flex-1"
                            onClick={() => {
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
