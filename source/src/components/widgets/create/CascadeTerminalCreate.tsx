import { useTranslate, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useMemo, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
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
import { PopoverSelect } from "../components/Selects/PopoverSelect";
import { useCascadesListWithoutPagination } from "@/hooks/useCascadesListWithoutPagination";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { CascadeTerminalDataProvider, TerminalsDataProvider } from "@/data";
import { CASCADE_TERMINAL_STATE } from "@/data/cascade_terminal";
import { useQuery } from "@tanstack/react-query";

export const CascadeTerminalCreate = ({ onClose = () => {} }: { onClose?: () => void }) => {
    const cascadeTerminalDataProvider = new CascadeTerminalDataProvider();
    const terminalsDataProvider = new TerminalsDataProvider();
    const { theme } = useTheme();
    const appToast = useAppToast();
    const translate = useTranslate();
    const refresh = useRefresh();

    const { cascadesData, isCascadesLoading } = useCascadesListWithoutPagination();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [terminalValueName, setTerminalValueName] = useState("");
    const [cascadeValueName, setCascadeValueName] = useState("");

    const formSchema = z.object({
        cascade_id: z.string().min(1, translate("resources.cascadeSettings.cascadeTerminals.errors.cascade_id")),
        terminal_id: z.string().min(1, translate("resources.cascadeSettings.cascadeTerminals.errors.terminal_id")),
        state: z
            .enum([CASCADE_TERMINAL_STATE[0], ...CASCADE_TERMINAL_STATE.slice(0)])
            .default(CASCADE_TERMINAL_STATE[0]),
        condition: z.object({
            extra: z.boolean(),
            weight: z.coerce
                .number({ message: translate("resources.cascadeSettings.cascadeTerminals.errors.weight") })
                .int(translate("resources.cascadeSettings.cascadeTerminals.errors.weight"))
                .min(0, translate("resources.cascadeSettings.cascadeTerminals.errors.weightMin"))
                .optional(),
            rank: z.coerce
                .number({ message: translate("resources.cascadeSettings.cascadeTerminals.errors.rank") })
                .int(translate("resources.cascadeSettings.cascadeTerminals.errors.rank"))
                .min(1, translate("resources.cascadeSettings.cascadeTerminals.errors.rankMin")),
            ttl: z.object({
                min: z.coerce
                    .number({ message: translate("resources.cascadeSettings.cascadeTerminals.errors.ttl") })
                    .int(translate("resources.cascadeSettings.cascadeTerminals.errors.ttl"))
                    .min(0, translate("resources.cascadeSettings.cascadeTerminals.errors.weightMin"))
                    .optional(),
                max: z.coerce
                    .number({ message: translate("resources.cascadeSettings.cascadeTerminals.errors.ttl") })
                    .int(translate("resources.cascadeSettings.cascadeTerminals.errors.ttl"))
                    .min(0, translate("resources.cascadeSettings.cascadeTerminals.errors.weightMin"))
                    .optional()
            })
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cascade_id: "",
            terminal_id: "",
            state: CASCADE_TERMINAL_STATE[0],
            condition: {
                extra: false,
                weight: undefined,
                rank: undefined,
                ttl: {
                    min: undefined,
                    max: undefined
                }
            }
        }
    });

    const currentCascadeStructure = useMemo(() => {
        if (cascadeValueName) {
            return cascadesData?.find(cascade => cascade.id === form.getValues("cascade_id"));
        } else {
            return undefined;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cascadeValueName, cascadesData]);

    const { data: terminalsData, isLoading: isTerminalsLoading } = useQuery({
        queryKey: ["terminals", "getListWithoutPagination", currentCascadeStructure?.id],
        queryFn: ({ signal }) =>
            terminalsDataProvider.getListWithoutPagination(
                "terminals",
                ["src_currency_code"],
                [currentCascadeStructure?.src_currency.code || ""],
                signal
            ),
        enabled: !!currentCascadeStructure?.src_currency.code,
        select: data => data.data
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            await cascadeTerminalDataProvider.create("cascade_terminals", { data });

            appToast("success", translate("app.ui.create.createSuccess"));
            refresh();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("already exists")) {
                    appToast("error", translate("resources.cascadeSettings.cascadeTerminals.errors.alreadyExist"));
                } else {
                    appToast("error", error.message);
                }
            } else {
                appToast("error", translate("app.ui.toast.error"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (isCascadesLoading || theme.length === 0)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="cascade_id"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label>{translate("resources.cascadeSettings.cascadeTerminals.fields.cascade")}</Label>
                                <PopoverSelect
                                    variants={cascadesData || []}
                                    value={cascadeValueName}
                                    idField="id"
                                    setIdValue={field.onChange}
                                    onChange={setCascadeValueName}
                                    variantKey="name"
                                    placeholder={translate("resources.cascadeSettings.cascades.selectPlaceholder")}
                                    commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                    notFoundMessage={translate("resources.cascadeSettings.cascades.notFoundMessage")}
                                    isError={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                    modal
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="terminal_id"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label>{translate("resources.cascadeSettings.cascadeTerminals.fields.terminal")}</Label>
                                <PopoverSelect
                                    disabled={!form.watch("cascade_id") || isTerminalsLoading}
                                    variants={terminalsData || []}
                                    value={terminalValueName}
                                    idField="terminal_id"
                                    setIdValue={field.onChange}
                                    onChange={setTerminalValueName}
                                    variantKey="verbose_name"
                                    placeholder={translate("resources.terminals.selectPlaceholder")}
                                    commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                    notFoundMessage={translate("resources.terminals.notFoundMessage")}
                                    isError={fieldState.invalid}
                                    isLoading={isTerminalsLoading}
                                    errorMessage={fieldState.error?.message}
                                    modal
                                />
                            </FormItem>
                        )}
                    />

                    <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="condition.weight"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate(
                                                "resources.cascadeSettings.cascadeTerminals.fields.weight"
                                            )}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="condition.rank"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.cascadeSettings.cascadeTerminals.fields.rank")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="condition.extra"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>
                                        {translate("resources.cascadeSettings.cascadeTerminals.fields.extra")}
                                    </Label>
                                    <Select
                                        value={String(field.value)}
                                        onValueChange={val =>
                                            val === "true" ? field.onChange(true) : field.onChange(false)
                                        }>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={"true"} variant={SelectType.GRAY}>
                                                    true
                                                </SelectItem>
                                                <SelectItem value={"false"} variant={SelectType.GRAY}>
                                                    false
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="condition.ttl.min"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate(
                                                "resources.cascadeSettings.cascadeTerminals.fields.ttl_min"
                                            )}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="condition.ttl.max"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate(
                                                "resources.cascadeSettings.cascadeTerminals.fields.ttl_max"
                                            )}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>
                                        {translate("resources.cascadeSettings.cascadeTerminals.fields.state")}
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
                                            <SelectGroup>
                                                {CASCADE_TERMINAL_STATE.map(state => (
                                                    <SelectItem value={state} variant={SelectType.GRAY} key={state}>
                                                        {translate(`resources.cascadeSettings.cascades.state.${state}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
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
    );
};
