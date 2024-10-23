import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LockKeyhole, LockKeyholeOpen, TriangleAlert } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useTranslate } from "react-admin";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

export const ManageStore = () => {
    const translate = useTranslate();
    const [storeState, setStoreState] = useState<"sealed" | "unsealed" | "waiting">("unsealed");
    const [stepForUnsealed, setStepForUnsealed] = useState<0 | 1 | "error">(0);
    const [keyText, setKeyText] = useState("");

    const formSchema = z.object({
        key: z.string().trim()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key: ""
        }
    });

    const handleTextChange = (
        e: ChangeEvent<HTMLTextAreaElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        setKeyText(e.target.value);
        form.setValue("key", e.target.value);
        field.onChange(e.target.value);
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <section className="flex items-center justify-center">
            <div className="rounded-16 bg-neutral-0 p-[30px] flex flex-col gap-6 min-w-[500px]">
                {storeState === "sealed" && (
                    <>
                        {stepForUnsealed !== "error" ? (
                            <h2 className="text-xl text-neutral-100 text-center">
                                {translate("resources.manageStore.titleClosed")}
                            </h2>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <h2 className="text-xl text-red-40">
                                    {translate("resources.manageStore.unsealed.errorTitle")}
                                </h2>
                                <h3 className="text-sm text-neutral-100">
                                    {translate("resources.manageStore.unsealed.errorSubtitle")}
                                </h3>
                            </div>
                        )}

                        {(stepForUnsealed === 0 || stepForUnsealed === "error") && (
                            <>
                                <Button onClick={() => setStepForUnsealed(1)} className="flex items-center gap-1">
                                    <LockKeyholeOpen width={16} height={16} />
                                    <span className="text-sm">{translate("resources.manageStore.buttonForOpen")}</span>
                                </Button>
                            </>
                        )}

                        {stepForUnsealed === 1 && (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="flex flex-col gap-6"
                                    autoComplete="off">
                                    <FormField
                                        name="key"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>{translate("resources.manageStore.key")}</FormLabel>

                                                <FormControl>
                                                    <Textarea
                                                        className={`text-sm text-neutral-100 disabled:dark:bg-muted resize-none min-h-24 ${
                                                            fieldState.invalid
                                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                                : ""
                                                        }`}
                                                        value={keyText}
                                                        onChange={e => handleTextChange(e, field)}
                                                        placeholder={translate("resources.manageStore.key")}>
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
                                                    </Textarea>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        onClick={() => setStoreState("waiting")}
                                        className="self-end flex items-center gap-1">
                                        <span className="text-sm">
                                            {translate("resources.manageStore.buttonForSend")}
                                        </span>
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </>
                )}

                {(storeState === "waiting" || storeState === "unsealed") && (
                    <>
                        <h2 className="text-xl text-neutral-100 text-center">
                            {storeState === "waiting"
                                ? translate("resources.manageStore.titleClosed")
                                : translate("resources.manageStore.titleOpened")}
                        </h2>

                        <div className="flex flex-col gap-2">
                            <p className="text-base leading-[22px]">
                                {translate("resources.manageStore.unsealed.allKeys")}: 5
                            </p>
                            <p className="text-base leading-[22px]">
                                {translate("resources.manageStore.unsealed.requiredKeys")}: 3
                            </p>
                            <p className="text-base leading-[22px]">
                                {translate("resources.manageStore.unsealed.enteredKeys")}: 2
                            </p>

                            {storeState === "waiting" && (
                                <p className="text-base leading-[22px] text-yellow-40">
                                    {translate("resources.manageStore.unsealed.toFinishKeys")}: 1
                                </p>
                            )}
                        </div>

                        {storeState === "waiting" ? (
                            <div className="flex gap-6">
                                <Button
                                    onClick={() => {
                                        setStoreState("sealed");
                                        setStepForUnsealed(0);
                                    }}
                                    className="flex items-center gap-1 bg-red-40 hover:bg-red-30 active:bg-red-30 focus:bg-red-30 flex-1">
                                    <LockKeyhole width={16} height={16} />
                                    <span className="text-sm">
                                        {translate("resources.manageStore.buttonForCancel")}
                                    </span>
                                </Button>

                                <Button
                                    onClick={() => {
                                        setStoreState("sealed");
                                        setStepForUnsealed(1);
                                    }}
                                    className="flex items-center gap-1 flex-1">
                                    <KeyRound width={16} height={16} />
                                    <span className="text-sm">
                                        {translate("resources.manageStore.buttonForEnterKey")}
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => {
                                    setStoreState("sealed");
                                    setStepForUnsealed(0);
                                }}
                                className="flex items-center gap-1 bg-red-40 hover:bg-red-30 active:bg-red-30 focus:bg-red-30 flex-1">
                                <LockKeyhole width={16} height={16} />
                                <span className="text-sm">{translate("resources.manageStore.buttonForClosed")}</span>
                            </Button>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};
