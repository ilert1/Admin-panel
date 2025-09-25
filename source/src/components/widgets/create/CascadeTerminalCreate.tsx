import { useTranslate, useRefresh } from "react-admin";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
import { PopoverSelect } from "../components/Selects/PopoverSelect";
import { useCascadesListWithoutPagination } from "@/hooks/useCascadesListWithoutPagination";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { CascadeTerminalDataProvider, TerminalsDataProvider } from "@/data";
import { CASCADE_TERMINAL_STATE } from "@/data/cascade_terminal";
import { useQuery } from "@tanstack/react-query";

export const CascadeTerminalCreate = ({
    cascadeId,
    onClose = () => {}
}: {
    cascadeId?: string;
    onClose?: () => void;
}) => {
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

    const formSchema = z
        .object({
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
                    .max(1000, translate("resources.cascadeSettings.cascadeTerminals.errors.weightMax"))
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
                        .optional()
                        .nullable(),
                    max: z.coerce
                        .number({ message: translate("resources.cascadeSettings.cascadeTerminals.errors.ttl") })
                        .int(translate("resources.cascadeSettings.cascadeTerminals.errors.ttl"))
                        .min(0, translate("resources.cascadeSettings.cascadeTerminals.errors.weightMin"))
                        .optional()
                        .nullable()
                })
            })
        })
        .refine(
            data => {
                if (data.condition.ttl.min === undefined || data.condition.ttl.max === undefined) {
                    return true;
                }

                if (data.condition.ttl.min === null || data.condition.ttl.max === null) {
                    return true;
                }

                return data.condition.ttl.min <= data.condition.ttl.max;
            },
            {
                message: translate("app.widgets.ttl.errors.minGreaterThanMax"),
                path: ["condition.ttl.max"]
            }
        );

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

    useEffect(() => {
        if (cascadeId && cascadesData) {
            const preSelectCascade = cascadesData.find(item => item.id === cascadeId);

            if (preSelectCascade) {
                setCascadeValueName(preSelectCascade.name);
                form.setValue("cascade_id", preSelectCascade.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cascadeId, cascadesData]);

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

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, "");
        if (/^0[0-9]+/.test(value)) {
            value = value.replace(/^0+/, "") || "0";
        }
        e.target.value = value;
        if (value === "") {
            form.setValue(field.name, null);
            return;
        }
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            let finalValue = numericValue;
            if (numericValue > 100000) {
                finalValue = 100000;
                e.target.value = "100000";
            }
            form.setValue(field.name, finalValue);
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
                                    onChange={value => {
                                        form.setValue("terminal_id", "");
                                        setTerminalValueName("");
                                        setCascadeValueName(value);
                                    }}
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

                    <FormField
                        control={form.control}
                        name="condition.extra"
                        render={({ field }) => (
                            <FormItem>
                                <label
                                    onClick={() => {
                                        const newState = !field.value;
                                        form.setValue("condition.weight", newState ? 0 : undefined);
                                        field.onChange(newState);
                                    }}
                                    className="flex cursor-pointer items-center gap-2 self-start [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-neutral-60 bg-white transition-all dark:bg-black">
                                        {field.value && (
                                            <div id="checked" className="h-2.5 w-2.5 rounded-full bg-green-50" />
                                        )}
                                    </div>
                                    <span className="text-sm font-normal text-neutral-70 transition-all dark:text-neutral-40">
                                        {translate("resources.cascadeSettings.cascadeTerminals.fields.extra")}
                                    </span>
                                </label>
                            </FormItem>
                        )}
                    />

                    <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-4">
                        <FormField
                            control={form.control}
                            name="condition.weight"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value === undefined ? "" : field.value}
                                            disabled={form.getValues("condition.extra")}
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
                            name="condition.ttl.min"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={e => handleInputChange(e, field)}
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
                                            value={field.value ?? ""}
                                            onChange={e => handleInputChange(e, field)}
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
