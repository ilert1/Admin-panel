import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { usePreventFocus } from "@/hooks";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { IProvider } from "@/data/providers";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectType, SelectValue } from "@/components/ui/select";
import { SecurityPolicyConfigEnforcementMode } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export interface ProviderEditParams {
    id?: string;
    onClose?: () => void;
}

export const ProvidersSecPolicyEdit = ({ id, onClose = () => {} }: ProviderEditParams) => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();

    const {
        data: provider,
        isLoading: isLoadingProvider,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["provider", id],
        queryFn: ({ signal }) => dataProvider.getOne<IProvider>("provider", { id: id ?? "", signal }),
        enabled: true,
        select: data => data.data
    });

    const enforcement_modes: string[] = Object.values(SecurityPolicyConfigEnforcementMode);

    const translate = useTranslate();
    const appToast = useAppToast();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const formSchema = z.object({
        rate_limit: z.number().optional(),
        enforcement_mode: z.string().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rate_limit: provider?.settings?.callback?.security_policy?.rate_limit || 0,
            enforcement_mode: provider?.settings?.callback?.security_policy?.enforcement_mode || enforcement_modes[0]
        }
    });

    useEffect(() => {
        if (!isLoadingProvider && provider && isFetchedAfterMount) {
            const updatedValues = {
                rate_limit: provider.settings?.callback?.security_policy?.rate_limit || 0,
                enforcement_mode: provider.settings?.callback?.security_policy?.enforcement_mode || enforcement_modes[0]
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, isLoadingProvider, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        try {
            await dataProvider.update<IProvider>("provider", {
                id,
                data: {
                    ...data,
                    settings: {
                        callback: {
                            security_policy: {
                                rate_limit: data.rate_limit,
                                enforcement_mode: data.enforcement_mode
                            }
                        }
                    }
                },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));
            refresh();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.provider.errors.alreadyInUse")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.edit.editError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({ dependencies: [provider] });

    if (isLoadingProvider || !provider || !isFinished)
        return (
            <div className="h-[200px]">
                <Loading />
            </div>
        );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-wrap">
                    <FormField
                        control={form.control}
                        name="enforcement_mode"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <FormControl>
                                    <FormField
                                        control={form.control}
                                        name="enforcement_mode"
                                        render={({ field, fieldState }) => {
                                            return (
                                                <FormItem>
                                                    <Label>
                                                        {translate(
                                                            "resources.callbridge.mapping.fields.enforcement_mode"
                                                        )}
                                                    </Label>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger
                                                                variant={SelectType.GRAY}
                                                                isError={fieldState.invalid}
                                                                errorMessage={<FormMessage />}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {enforcement_modes.map(mode => (
                                                                <SelectItem
                                                                    key={mode}
                                                                    value={mode}
                                                                    variant={SelectType.GRAY}>
                                                                    {translate(
                                                                        "resources.callbridge.mapping.fields.enforcement_modes." +
                                                                            mode
                                                                    )}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rate_limit"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        label={translate("resources.callbridge.mapping.fields.rate_limit")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                        <Button disabled={submitButtonDisabled} type="submit" variant="default" className="flex-1">
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button
                            type="button"
                            variant="outline_gray"
                            className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                            onClick={onClose}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
