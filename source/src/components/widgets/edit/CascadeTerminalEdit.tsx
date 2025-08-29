import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
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
import { usePreventFocus, useTerminalsListWithoutPagination } from "@/hooks";
import { Label } from "@/components/ui/label";
import { CascadeTerminalSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { useCascadesListWithoutPagination } from "@/hooks/useCascadesListWithoutPagination";
import { PopoverSelect } from "../components/Selects/PopoverSelect";

const CASCADE_TERMINAL_STATE = ["active", "inactive", "archived"];

export interface CascadeTerminalEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeTerminalEdit = ({ id, onOpenChange }: CascadeTerminalEditProps) => {
    const dataProvider = useDataProvider();

    const {
        data: cascadeTerminalData,
        isLoading: isLoadingCascadeTerminalData,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["cascade", id],
        queryFn: ({ signal }) => dataProvider.getOne<CascadeTerminalSchema>("cascade", { id: id ?? "", signal }),
        enabled: true,
        select: data => data.data
    });
    const appToast = useAppToast();

    const { terminalsData, isTerminalsLoading } = useTerminalsListWithoutPagination();
    const { cascadesData, isCascadesLoading } = useCascadesListWithoutPagination();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [terminalValueName, setTerminalValueName] = useState("");
    const [cascadeValueName, setCascadeValueName] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    const translate = useTranslate();
    const refresh = useRefresh();

    const formSchema = z.object({
        cascade_id: z.string().min(1, translate("resources.cascadeSettings.cascadeTerminals.errors.cascade_id")),
        terminal_id: z.string().min(1, translate("resources.cascadeSettings.cascadeTerminals.errors.terminal_id")),
        state: z.enum(CASCADE_TERMINAL_STATE as [string, ...string[]]).default(CASCADE_TERMINAL_STATE[0]),
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

    useEffect(() => {
        if (!isLoadingCascadeTerminalData && cascadeTerminalData && isFetchedAfterMount) {
            const updatedValues = {
                cascade_id: cascadeTerminalData.cascade_id,
                terminal_id: cascadeTerminalData.terminal_id,
                state: cascadeTerminalData.state || CASCADE_TERMINAL_STATE[0],
                condition: {
                    extra: cascadeTerminalData.condition?.extra || false,
                    weight: cascadeTerminalData.condition?.weight || undefined,
                    rank: cascadeTerminalData.condition?.rank || undefined,
                    ttl: {
                        min: cascadeTerminalData.condition?.ttl?.min || undefined,
                        max: cascadeTerminalData.condition?.ttl?.max || undefined
                    }
                }
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cascadeTerminalData, isLoadingCascadeTerminalData, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        try {
            await dataProvider.update<CascadeTerminalSchema>("cascade_terminals", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.cascadeSettings.cascadeTerminals.errors.alreadyExist")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.edit.editError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({ dependencies: [cascadeTerminalData] });

    if (isLoadingCascadeTerminalData || isTerminalsLoading || isCascadesLoading || !cascadeTerminalData || !isFinished)
        return (
            <div className="h-[150px]">
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
                                <Label>{translate("resources.direction.fields.terminal")}</Label>
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
                                <Label>{translate("resources.direction.fields.terminal")}</Label>
                                <PopoverSelect
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

                    <Button
                        type="button"
                        variant="outline_gray"
                        className="flex-1"
                        onClick={() => {
                            onOpenChange(false);
                        }}>
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
