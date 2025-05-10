import {
    useEditController,
    EditContextProvider,
    useTranslate,
    useRefresh,
    HttpError,
    useDataProvider
} from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormMessage, FormControl, FormField } from "@/components/ui/form";

import { usePreventFocus } from "@/hooks";
import { WalletTypes } from "@/helpers/wallet-types";
import { Label } from "@/components/ui/label";
import { isTRC20Address } from "@/helpers/isTRC20Address";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface AccountEditProps {
    id?: string;
    onClose: () => void;
}

export const AccountEdit = ({ id, onClose }: AccountEditProps) => {
    const controllerProps = useEditController({ resource: "accounts", id, mutationMode: "pessimistic" });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const dataProvider = useDataProvider();

    const translate = useTranslate();
    const refresh = useRefresh();

    const appToast = useAppToast();

    const formSchema = z.object({
        account_id: z.string(),
        name: z
            .string()
            .min(1, { message: translate("resources.accounts.errors.name") })
            .trim(),
        wallet_create: z.boolean().default(false),
        wallet_type: z.enum([WalletTypes.EXTERNAL, WalletTypes.INTERNAL, WalletTypes.LINKED]),
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
        reward_account: z
            .string()
            .trim()
            .uuid(translate("resources.accounts.errors.uuid"))
            .optional()
            .or(z.literal("")),
        provider_account: z
            .string()
            .trim()
            .uuid(translate("resources.accounts.errors.uuid"))
            .optional()
            .or(z.literal(""))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            account_id: controllerProps.record?.id || "",
            name: controllerProps.record?.meta?.caption || "",
            wallet_create: controllerProps.record?.wallet_create || false,
            wallet_type: controllerProps.record?.wallet_type || WalletTypes.INTERNAL,
            tron_wallet: controllerProps.record?.meta?.tron_wallet || "",
            tron_address: controllerProps.record?.meta?.tron_address || "",
            reward_account: controllerProps.record?.meta?.reward_account || "",
            provider_account: controllerProps.record?.meta?.provider_account || ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                account_id: controllerProps.record?.id || id,
                name: controllerProps.record?.meta?.caption || "",
                wallet_create: controllerProps.record?.wallet_create || false,
                wallet_type: controllerProps.record?.wallet_type || WalletTypes.INTERNAL,
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
            await dataProvider.update(`account`, {
                id: controllerProps.record.id,
                previousData: undefined,
                data: data
            });

            refresh();
            onClose();
        } catch (error) {
            if (error instanceof HttpError) appToast("error", error.message);
        } finally {
            setSubmitButtonDisabled(false);
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
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="text-sm"
                                            label={translate("resources.accounts.editFields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="wallet_create"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <Label>{translate("resources.accounts.editFields.wallet_create")}</Label>
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={value => field.onChange(value === "true")}>
                                        <FormControl>
                                            <SelectTrigger
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={translate("resources.accounts.fields.active")}
                                                />
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
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="wallet_type"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <Label>{translate("resources.accounts.editFields.wallet_type")}</Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={translate("resources.direction.fields.active")}
                                                    defaultValue={WalletTypes.INTERNAL}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectGroup>
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
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tron_wallet"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("resources.accounts.editFields.tron_wallet")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                            disabled={form.getValues("wallet_create")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tron_address"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("resources.accounts.editFields.tron_address")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="provider_account"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("resources.accounts.editFields.provider_account")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reward_account"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("resources.accounts.editFields.reward_account")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="ml-auto mt-4 flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:mt-0 md:w-2/5">
                        <Button type="submit" variant="default" className="flex-1" disabled={submitButtonDisabled}>
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button type="button" variant="outline_gray" className="flex-1" onClick={onClose}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
