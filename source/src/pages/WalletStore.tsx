import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingBlock } from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VaultDataProvider } from "@/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, KeyRound, LockKeyhole, LockKeyholeOpen, TriangleAlert } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { ResourceHeaderTitle } from "@/components/widgets/components/ResourceHeaderTitle";

export const WalletStore = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider<VaultDataProvider>();

    const [loadingProcess, setLoadingProcess] = useState(false);
    const [stepForUnsealed, setStepForUnsealed] = useState<0 | 1 | "error">(0);
    const [keyText, setKeyText] = useState("");

    const appToast = useAppToast();

    const formSchema = z.object({
        key_part: z.string().min(3, translate("app.widgets.forms.userCreate.nameMessage")).trim()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key_part: ""
        }
    });

    const handleTextChange = (
        e: ChangeEvent<HTMLTextAreaElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        setKeyText(e.target.value);
        form.setValue("key_part", e.target.value);
        field.onChange(e.target.value);
    };

    const {
        data: storageState,
        refetch: refetchStorageState,
        isLoading: storageStateLoading
    } = useQuery({
        queryKey: ["walletStorage"],
        queryFn: ({ signal }) => dataProvider.getVaultState("vault", signal)
    });

    const storageInitiated = async () => {
        try {
            setLoadingProcess(true);

            const json = await dataProvider.initiatedState("vault");

            refetchStorageState();

            if (!json.success) {
                setStepForUnsealed("error");
                appToast("error", json.error.error_message, translate("resources.wallet.storage.initiatedError"));
            }
        } catch (error) {
            setStepForUnsealed("error");
        } finally {
            setLoadingProcess(false);
        }
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoadingProcess(true);

            const json = await dataProvider.addPartialKey("vault", data);

            setKeyText("");
            form.setValue("key_part", "");

            await refetchStorageState();

            if (!json.success) {
                throw new Error(json.error.error_message);
            }

            if (json.data === "Vault was unsealed") {
                appToast("success", translate("resources.wallet.storage.unsealSuccess"));
            }

            setStepForUnsealed(0);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);

            setStepForUnsealed("error");
        } finally {
            setLoadingProcess(false);
        }
    };

    const cancelUnsealing = async () => {
        setLoadingProcess(true);

        try {
            await dataProvider.cancelUnsealing("vault");
            refetchStorageState();
        } catch (error) {
            setStepForUnsealed("error");
        } finally {
            setLoadingProcess(false);
        }
    };

    return (
        <>
            <ResourceHeaderTitle marginBottom />

            <div className="right-[-48px] bottom-[-90px] absolute p-4">
                <img
                    src="/BlowFish.svg"
                    alt="Decorative"
                    className="-z-50 opacity-[0.3] w-[280px] lg:w-[320px] xl:w-[400px] h-[280px] lg:h-[320px] xl:h-[400px] pointer-events-none select-none"
                    className="-z-50 opacity-[0.3] w-[280px] lg:w-[320px] xl:w-[400px] h-[280px] lg:h-[320px] xl:h-[400px] pointer-events-none select-none"
                />
            </div>
            <section className="flex justify-center items-center">
                <div className="flex flex-col gap-6 bg-neutral-0 dark:bg-neutral-100 p-[30px] rounded-16 w-full min-w-[200px] max-w-[500px]">
                    {storageStateLoading ? (
                        <LoadingBlock />
                    ) : (
                        <>
                            {!storageState?.initiated && (
                                <>
                                    {stepForUnsealed !== "error" ? (
                                        <h2 className="text-neutral-100 dark:text-neutral-0 text-xl text-center">
                                        <h2 className="text-neutral-100 dark:text-neutral-0 text-xl text-center">
                                            {translate("resources.wallet.storage.initiatedTitle")}
                                        </h2>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <h2 className="text-red-40 text-xl">
                                                {translate("resources.wallet.storage.initiatedError")}
                                            </h2>
                                            <h3 className="text-neutral-100 dark:text-neutral-0 text-sm">
                                                {translate("resources.wallet.storage.unsealed.errorSubtitle")}
                                            </h3>
                                        </div>
                                    )}

                                    <Button
                                        disabled={loadingProcess}
                                        onClick={storageInitiated}
                                        className="flex items-center gap-1">
                                        <CirclePlus width={16} height={16} />
                                        <span className="text-sm">
                                            {translate("resources.wallet.storage.buttonForInitiated")}
                                        </span>
                                    </Button>
                                </>
                            )}

                            {storageState?.state === "sealed" && storageState?.initiated && (
                                <>
                                    {stepForUnsealed !== "error" ? (
                                        <h2 className="text-neutral-100 dark:text-neutral-0 text-xl text-center">
                                        <h2 className="text-neutral-100 dark:text-neutral-0 text-xl text-center">
                                            {translate("resources.wallet.storage.titleClosed")}
                                        </h2>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <h2 className="text-red-40 text-xl">
                                                {translate("resources.wallet.storage.unsealed.errorTitle")}
                                            </h2>
                                            <h3 className="text-neutral-100 dark:text-neutral-0 text-sm">
                                                {translate("resources.wallet.storage.unsealed.errorSubtitle")}
                                            </h3>
                                        </div>
                                    )}

                                    {(stepForUnsealed === 0 || stepForUnsealed === "error") && (
                                        <>
                                            <Button
                                                disabled={loadingProcess}
                                                onClick={() => setStepForUnsealed(1)}
                                                className="flex items-center gap-1">
                                                <LockKeyholeOpen width={16} height={16} />
                                                <span className="text-sm">
                                                    {translate("resources.wallet.storage.buttonForOpen")}
                                                </span>
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}

                            {((storageState?.state === "sealed" && stepForUnsealed === 1) ||
                                (storageState?.state === "waiting" && stepForUnsealed === 1)) &&
                                storageState?.initiated && (
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="flex flex-col gap-6"
                                            autoComplete="off">
                                            <FormField
                                                name="key_part"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel>
                                                            {translate("resources.wallet.storage.key")}
                                                        </FormLabel>

                                                        <FormControl>
                                                            <Textarea
                                                                autoFocus
                                                                className={`min-h-24 resize-none text-sm`}
                                                                value={keyText}
                                                                onChange={e => handleTextChange(e, field)}
                                                                placeholder={translate("resources.wallet.storage.key")}>
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
                                                                                className="bottom-0 border-none"
                                                                                className="bottom-0 border-none"
                                                                                side="left">
                                                                                <FormMessage />
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                )}
                                                            </Textarea>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                disabled={loadingProcess || keyText.length < 3}
                                                type="submit"
                                                className="flex items-center self-end gap-1 w-full sm:w-1/4 min-w-28">
                                                className="flex items-center self-end gap-1 w-full sm:w-1/4 min-w-28">
                                                {loadingProcess ? (
                                                    <LoadingBlock className="!w-5 !h-5" />
                                                ) : (
                                                    <span className="text-sm">
                                                        {translate("resources.wallet.storage.buttonForSend")}
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                )}

                            {(storageState?.state === "waiting" || storageState?.state === "unsealed") &&
                                storageState?.initiated &&
                                stepForUnsealed !== 1 && (
                                    <>
                                        <h2 className="text-neutral-100 dark:text-neutral-0 text-xl text-center">
                                        <h2 className="text-neutral-100 dark:text-neutral-0 text-xl text-center">
                                            {storageState?.state === "waiting"
                                                ? translate("resources.wallet.storage.titleClosed")
                                                : translate("resources.wallet.storage.titleOpened")}
                                        </h2>

                                        <div className="flex flex-col gap-2">
                                            <p className="text-base leading-[22px]">
                                                {translate("resources.wallet.storage.unsealed.allKeys")}:{" "}
                                                {storageState.split_max}
                                            </p>
                                            <p className="text-base leading-[22px]">
                                                {translate("resources.wallet.storage.unsealed.requiredKeys")}:{" "}
                                                {storageState.split_min}
                                            </p>
                                            {storageState?.state === "waiting" && (
                                                <p className="text-base leading-[22px]">
                                                    {translate("resources.wallet.storage.unsealed.enteredKeys")}:{" "}
                                                    {storageState.recieved_shares}
                                                </p>
                                            )}

                                            {storageState?.state === "waiting" && (
                                                <p className="text-yellow-40 text-base leading-[22px]">
                                                    {translate("resources.wallet.storage.unsealed.toFinishKeys")}:{" "}
                                                    {+storageState.split_min - +storageState.recieved_shares}
                                                </p>
                                            )}
                                        </div>

                                        {storageState?.state === "waiting" ? (
                                            <div className="flex gap-6">
                                                <Button
                                                    disabled={loadingProcess}
                                                    onClick={cancelUnsealing}
                                                    className="flex flex-1 items-center gap-1 bg-red-40 hover:bg-red-30 focus:bg-red-30 active:bg-red-30">
                                                    {loadingProcess ? (
                                                        <LoadingBlock className="!w-5 !h-5" />
                                                    ) : (
                                                        <>
                                                            <LockKeyhole width={16} height={16} />
                                                            <span className="text-sm">
                                                                {translate("resources.wallet.storage.buttonForCancel")}
                                                            </span>
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    disabled={loadingProcess}
                                                    onClick={() => {
                                                        setStepForUnsealed(1);
                                                    }}
                                                    className="flex flex-1 items-center gap-1">
                                                    className="flex flex-1 items-center gap-1">
                                                    <KeyRound width={16} height={16} />
                                                    <span className="text-sm">
                                                        {translate("resources.wallet.storage.buttonForEnterKey")}
                                                    </span>
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                disabled={loadingProcess}
                                                onClick={cancelUnsealing}
                                                className="relative flex flex-1 items-center gap-1 bg-red-40 hover:bg-red-30 focus:bg-red-30 active:bg-red-30">
                                                className="relative flex flex-1 items-center gap-1 bg-red-40 hover:bg-red-30 focus:bg-red-30 active:bg-red-30">
                                                {loadingProcess ? (
                                                    <LoadingBlock className="!w-5 !h-5" />
                                                ) : (
                                                    <>
                                                        <LockKeyhole width={16} height={16} />
                                                        <span className="text-sm">
                                                            {translate("resources.wallet.storage.buttonForClosed")}
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </>
                                )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};
