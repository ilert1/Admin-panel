import { useCreateController, CreateContextProvider, useTranslate, useRefresh, fetchUtils } from "react-admin";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChangeEvent, DragEvent, useState } from "react";
import { feesDataProvider, FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { Fees } from "../components/Fees";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BF_MANAGER_URL } from "@/data/base";
import { FeeCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export type FeeType = "inner" | "default";

export const MerchantCreateNewFlow = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const controllerProps = useCreateController();
    const data = fetchDictionaries();
    const feeDataProvider = feesDataProvider({ id: "", resource: FeesResource.MERCHANT });

    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const [fees, setFees] = useState<FeeCreate[]>([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [fileContent, setFileContent] = useState("");

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setFileContent(reader.result.replaceAll("\n", ""));
                    form.setValue("public_key", reader.result.replaceAll("\n", ""));
                }
            };
            reader.readAsText(file);
        }
    };

    const handleTextChange = (
        e: ChangeEvent<HTMLTextAreaElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        setFileContent(e.target.value);
        form.setValue("public_key", e.target.value);
        field.onChange(e.target.value);
    };

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async data => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        if (data?.description?.length === 0) {
            data.description = null;
        }

        try {
            const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/merchants`, {
                method: "POST",
                body: JSON.stringify(data),
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                throw new Error(json.error);
            }

            feeDataProvider.setId(json.data.id);

            await fees.reduce((accum, item) => {
                return accum.then(() => feeDataProvider.addFee(item));
            }, Promise.resolve());

            refresh();
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.merchant.errors.alreadyInUse"));
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        name: z
            .string({ message: translate("resources.merchant.errors.required") })
            .min(1, translate("resources.merchant.errors.name"))
            .trim(),
        public_key: z
            .string({ message: translate("resources.merchant.errors.required") })
            .startsWith("-----BEGIN PUBLIC KEY-----", translate("resources.merchant.errors.publicKey"))
            .endsWith("-----END PUBLIC KEY-----", translate("resources.merchant.errors.publicKey")),
        description: z.string().trim().nullable(),
        fees: z.record(
            z.object({
                type: z.number(),
                value: z.number(),
                currency: z.string(),
                recipient: z.string(),
                direction: z.string()
            })
        )
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            fees: {}
        }
    });

    if (controllerProps.isLoading || !data) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className=""
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("resources.merchant.fields.descr")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="w-full p-2" onDragOver={e => e.preventDefault()} onDrop={handleFileDrop}>
                            <FormField
                                name="public_key"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex h-full flex-col space-y-0">
                                        <Label>{translate("app.widgets.forms.userCreate.publicKey")}</Label>
                                        <FormControl>
                                            <Textarea
                                                value={fileContent}
                                                onChange={e => handleTextChange(e, field)}
                                                placeholder={translate(
                                                    "app.widgets.forms.userCreate.publicKeyPlaceholder"
                                                )}
                                                className={`h-full min-h-20 resize-none dark:bg-muted`}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
            <Fees id={""} fees={fees} feesResource={FeesResource.MERCHANT} setFees={setFees} feeType="inner" />
            <div className="ml-auto flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:w-2/5">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="outline_gray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </CreateContextProvider>
    );
};
