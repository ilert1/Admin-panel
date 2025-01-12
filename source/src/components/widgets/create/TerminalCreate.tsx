import { useCreateController, useRefresh, CreateContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingBlock } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";

export interface ProviderCreateProps {
    provider: string;
    onClose: () => void;
}

export const TerminalCreate = ({ onClose, provider }: ProviderCreateProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController();
    const { theme } = useTheme();
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
        description: z.union([z.string().trim(), z.literal("")])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verbose_name: "",
            description: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        try {
            setSubmitButtonDisabled(true);

            await dataProvider.create(`provider/${provider}/terminal`, { data });

            refresh();
            form.reset();
            onClose();
        } catch (error) {
            toast.error(translate("resources.transactions.download.error"), {
                description: translate("resources.provider.errors.alreadyInUse"),
                dismissible: true,
                duration: 3000
            });
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || theme.length === 0) return <LoadingBlock />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="verbose_name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>{translate("resources.terminals.fields.verbose_name")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            {...field}>
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

                                                        <TooltipContent className="border-none bottom-0" side="left">
                                                            <FormMessage />
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </Input>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>{translate("resources.terminals.fields.description")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            {...field}>
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

                                                        <TooltipContent className="border-none bottom-0" side="left">
                                                            <FormMessage />
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </Input>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col sm:flex-row space-x-0 sm:space-x-2 mt-6">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 mt-4 sm:mt-0 border-neutral-50 text-neutral-50 bg-muted w-full sm:w-1/2"
                                onClick={() => {
                                    form.reset();
                                    onClose();
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
