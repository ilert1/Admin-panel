import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";

const CASCADE_STATE = ["active", "inactive", "archived"];

export interface CascadeEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeEdit = ({ id, onOpenChange }: CascadeEditProps) => {
    const dataProvider = useDataProvider();

    const appToast = useAppToast();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const translate = useTranslate();
    const refresh = useRefresh();

    const formSchema = z.object({
        state: z.enum(CASCADE_STATE as [string, ...string[]]).default(CASCADE_STATE[0])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            state: CASCADE_STATE[0]
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        try {
            await dataProvider.update<CascadeSchema>("cascadeSettings/cascadeMerchants", {
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
                        ? translate("resources.cascadeSettings.cascades.errors.alreadyExist")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.edit.editError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({});

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label>{translate("resources.cascadeSettings.cascades.fields.state")}</Label>
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
                                            {CASCADE_STATE.map(state => (
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
