import { useTranslate } from "react-admin";
import { FeesResource } from "@/data";
import { TextField } from "@/components/ui/text-field";
import { LoadingBlock } from "@/components/ui/loading";
import { Button } from "@/components/ui/Button";
import { TerminalWithId } from "@/data/terminals";
import { EditTerminalDialog } from "../../lists/Terminals/EditTerminalDialog";
import { DeleteTerminalDialog } from "../../lists/Terminals/DeleteTerminalDialog";
import { useState } from "react";
import { AuthDataViewer, AuthDataEditSheet } from "../../edit/Terminals/AuthData";
import { PaymentsTypesShowComponent } from "../../components/PaymentsTypesShowComponent";
import { useSheets } from "@/components/providers/SheetProvider";
import { Fees } from "../../components/Fees";
import { Label } from "@/components/ui/label";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { GenerateCallbackDialog } from "./GenerateCallbackDialog";
import { Badge, BadgeProps } from "@/components/ui/badge";

interface TerminalShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

const statesMap = {
    active: ["success", "resources.direction.fields.stateActive"],
    inactive: ["destructive", "resources.direction.fields.stateInactive"],
    archived: ["warning", "resources.direction.fields.stateArchived"]
};
export const TerminalShow = ({ id }: TerminalShowProps) => {
    const context = useAbortableShowController<TerminalWithId>({ resource: "terminals", id });
    const { openSheet } = useSheets();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const translate = useTranslate();
    const [editAuthDataDialogOpen, setEditAuthDataDialogOpen] = useState(false);
    const [generateCallbackDialogOpen, setGenerateCallbackDialogOpen] = useState(false);

    if (context.isLoading || !context.record) {
        return <LoadingBlock />;
    }
    const src_cur = context.record.src_currency_code;
    const dst_cur = context.record.dst_currency_code;

    return (
        <>
            <div className="flex flex-col px-4 md:px-[45px]">
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <div className="mb-2 flex flex-wrap justify-between gap-2">
                            <TextField text={id} copyValue className="text-display-4" />
                            {context.record.state && (
                                <Badge variant={statesMap[context.record.state][0] as BadgeProps["variant"]}>
                                    {translate(statesMap[context.record.state][1])}
                                </Badge>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                            <TextField
                                text={context.record?.verbose_name || ""}
                                label={translate("resources.terminals.fields.verbose_name")}
                            />
                            <TextField
                                label={translate("resources.terminals.fields.provider")}
                                className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                                text={context.record?.provider.name}
                                onClick={() => {
                                    openSheet("provider", {
                                        id: context.record?.provider.id as string
                                    });
                                }}
                            />
                            <TextField
                                text={context.record?.allocation_timeout_seconds?.toString() ?? ""}
                                label={translate("resources.terminals.fields.allocation_timeout_seconds")}
                            />
                            <TextField
                                text={context.record?.description ?? ""}
                                label={translate("resources.terminals.fields.description")}
                            />
                            <div>
                                <Label className="dark:!text-neutral-60">
                                    {translate("resources.direction.sourceCurrency")}
                                </Label>
                                {src_cur ? <Badge variant="currency">{src_cur}</Badge> : <TextField text="-" />}
                            </div>
                            <div>
                                <Label className="dark:!text-neutral-60">
                                    {translate("resources.direction.destinationCurrency")}
                                </Label>
                                {dst_cur ? <Badge variant="currency">{dst_cur}</Badge> : <TextField text="-" />}
                            </div>

                            <div className="md:col-span-2">
                                <TextField
                                    text={context.record?.callback_url ?? "-"}
                                    type={"text"}
                                    copyValue={context.record?.callback_url ? true : false}
                                    lineClamp
                                    linesCount={1}
                                    label={translate("resources.callbridge.mapping.fields.callback_url")}
                                />
                            </div>
                            <PaymentsTypesShowComponent payment_types={context.record?.payment_types} />
                        </div>

                        <div className="mt-3 flex justify-end">
                            <div className="flex gap-3 md:gap-4">
                                <Button className="" onClick={() => setGenerateCallbackDialogOpen(true)} disabled={!id}>
                                    {translate("app.ui.actions.generateCallback")}
                                </Button>

                                <Button onClick={() => setEditDialogOpen(true)}>
                                    {translate("app.ui.actions.edit")}
                                </Button>

                                <Button onClick={() => setDeleteDialogOpen(true)} variant={"outline_gray"}>
                                    {translate("app.ui.actions.delete")}
                                </Button>
                            </div>
                        </div>

                        {context.record?.details && Object.keys(context.record?.details).length > 0 && (
                            <div className="mt-5 border-t-[1px] border-neutral-90 pt-3 dark:border-neutral-100 md:mt-10 md:pt-8">
                                <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                                    {translate("resources.terminals.fields.details")}
                                </Label>
                                <div className="flex h-full">
                                    <MonacoEditor
                                        disabled
                                        height="h-48"
                                        width="100%"
                                        code={JSON.stringify(context.record?.details || "{}", null, 2)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="my-5 border-y-[1px] border-neutral-90 py-5 dark:border-neutral-100 md:my-10 md:py-10">
                            <AuthDataViewer
                                authData={context.record?.auth}
                                showAuthDataEditSheet={() => setEditAuthDataDialogOpen(true)}
                            />
                        </div>
                    </div>
                </div>

                <Fees fees={context.record?.fees} feesResource={FeesResource.TERMINAL} id={id} padding={false} />
                {/* <Limits limits={context.record?.limits ?? {}} id={id} resource="terminal" /> */}
            </div>

            <AuthDataEditSheet
                terminalId={id}
                open={editAuthDataDialogOpen}
                onOpenChange={setEditAuthDataDialogOpen}
                originalAuthData={context.record?.auth}
            />

            <EditTerminalDialog
                provider={context.record?.provider}
                id={id}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
            <GenerateCallbackDialog
                open={generateCallbackDialogOpen}
                onOpenChange={setGenerateCallbackDialogOpen}
                terminalId={id}
            />

            <DeleteTerminalDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} deleteId={id} />
        </>
    );
};
