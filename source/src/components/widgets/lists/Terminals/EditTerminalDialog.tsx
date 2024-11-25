import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import {
    useEditController,
    useRefresh,
    EditContextProvider,
    useTranslate,
    useDataProvider,
    fetchUtils
} from "react-admin";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";

interface EditProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    provider: string;
    id: string;
}

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const EditTerminalDialog = ({ open, id, provider, onOpenChange = () => {} }: EditProviderDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const dataProvider = useDataProvider();

    const controllerProps = useEditController({ resource: `provider/${provider}/terminal`, id });
    controllerProps.mutationMode = "pessimistic";

    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
        description: z.string().min(1, translate("resources.terminals.errors.description")).trim(),
        auth: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verbose_name: controllerProps.record?.verbose_name || "",
            description: controllerProps.record?.description || "",
            auth: JSON.stringify(controllerProps.record?.auth) || ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                verbose_name: controllerProps.record.verbose_name || "",
                description: controllerProps.record.description || "",
                auth: JSON.stringify(controllerProps.record.auth, null, 2) || ""
            });
        }
    }, [form, controllerProps.record]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        try {
            setSubmitButtonDisabled(true);

            await dataProvider.update(`provider/${provider}/terminal`, {
                id,
                data: {
                    verbose_name: data.verbose_name,
                    description: data.description
                },
                previousData: undefined
            });

            if (data.auth) {
                data.auth = JSON.parse(data.auth);

                if (JSON.stringify(controllerProps.record.auth) !== JSON.stringify(data.auth)) {
                    await fetchUtils.fetchJson(`${API_URL}/provider/${provider}/terminal/${id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                            auth: data.auth
                        }),
                        user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
                    });
                }
            }

            refresh();
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong",
                dismissible: true,
                duration: 3000
            });
        } finally {
            setSubmitButtonDisabled(false);
            onOpenChange(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="z-[60] bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        {translate("resources.terminals.editingTerminal")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    {controllerProps.isLoading || !controllerProps.record ? (
                        <Loading />
                    ) : (
                        <EditContextProvider value={controllerProps}>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="flex flex-wrap">
                                        <FormField
                                            control={form.control}
                                            name="verbose_name"
                                            render={({ field, fieldState }) => (
                                                <FormItem className="w-full sm:w-1/2 p-2">
                                                    <FormLabel>
                                                        <span className="!text-note-1 !text-neutral-30">
                                                            {translate("resources.terminals.fields.verbose_name")}
                                                        </span>
                                                    </FormLabel>
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

                                                                        <TooltipContent
                                                                            className="border-none bottom-0"
                                                                            side="left">
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
                                                    <FormLabel>
                                                        <span className="!text-note-1 !text-neutral-30">
                                                            {translate("resources.terminals.fields.description")}
                                                        </span>
                                                    </FormLabel>
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

                                                                        <TooltipContent
                                                                            className="border-none bottom-0"
                                                                            side="left">
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
                                            name="auth"
                                            render={({ field }) => (
                                                <FormItem className="w-full p-2">
                                                    <FormLabel>
                                                        <span className="!text-note-1 !text-neutral-30">
                                                            {translate("resources.terminals.fields.auth")}
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <MonacoEditor
                                                            height="144px"
                                                            width="100%"
                                                            onErrorsChange={setHasErrors}
                                                            onValidChange={setIsValid}
                                                            code={field.value}
                                                            setCode={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col sm:flex-row space-x-0 sm:space-x-2 mt-6">
                                            <Button
                                                disabled={hasErrors && isValid && submitButtonDisabled}
                                                type="submit"
                                                variant="default"
                                                className="flex-1">
                                                {translate("app.ui.actions.save")}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 mt-4 sm:mt-0 border-neutral-50 text-neutral-50 bg-muted w-full sm:w-1/2"
                                                onClick={() => onOpenChange(false)}>
                                                {translate("app.ui.actions.cancel")}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </EditContextProvider>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
