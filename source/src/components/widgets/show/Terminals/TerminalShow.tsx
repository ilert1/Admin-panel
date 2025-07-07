import { useDataProvider, useTranslate } from "react-admin";
import { FeesResource } from "@/data";
import { TextField } from "@/components/ui/text-field";
import { LoadingBlock } from "@/components/ui/loading";
import { Button } from "@/components/ui/Button";
import { TerminalWithId } from "@/data/terminals";
import { EditTerminalDialog } from "../../lists/Terminals/EditTerminalDialog";
import { DeleteTerminalDialog } from "../../lists/Terminals/DeleteTerminalDialog";
import { useState } from "react";
import { AuthDataViewer, AuthDataEditSheet } from "../../edit/Terminals/AuthData";
import { GenerateCallbackDialog } from "./GenerateCallbackDialog";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { PaymentsTypesShowComponent } from "../../components/PaymentsTypesShowComponent";
import { useSheets } from "@/components/providers/SheetProvider";
import { Fees } from "../../components/Fees";
import { Label } from "@/components/ui/label";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

interface TerminalShowProps {
    id: string;
    provider: string;
    onOpenChange: (state: boolean) => void;
}
export const TerminalShow = (props: TerminalShowProps) => {
    const { id, provider } = props;

    const { openSheet } = useSheets();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [generateCallbackDialogOpen, setGenerateCallbackDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [editAuthDataDialogOpen, setEditAuthDataDialogOpen] = useState(false);
    const appToast = useAppToast();

    const { data, isLoading } = useQuery({
        queryKey: ["terminal-fees", provider, id],
        queryFn: async ({ signal }) => {
            try {
                return await dataProvider.getOne<TerminalWithId>(`${provider}/terminal`, { id, signal });
            } catch (error) {
                if (error instanceof Error) {
                    appToast("error", error.message);
                }
            }
        },
        select: data => data?.data
    });

    if (isLoading || !data) {
        return <LoadingBlock />;
    }

    return (
        <>
            <div className="flex flex-col px-4 md:px-[45px]">
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <TextField text={id} copyValue className="text-display-4" />

                        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                            <TextField
                                text={data.verbose_name}
                                label={translate("resources.terminals.fields.verbose_name")}
                            />

                            <TextField
                                label={translate("resources.terminals.fields.provider")}
                                className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                                text={data.provider}
                                onClick={() => {
                                    openSheet("provider", {
                                        id: data.provider
                                    });
                                }}
                            />

                            <TextField
                                text={data.allocation_timeout_seconds?.toString() ?? ""}
                                label={translate("resources.terminals.fields.allocation_timeout_seconds")}
                            />

                            <TextField
                                text={data.description ?? ""}
                                label={translate("resources.terminals.fields.description")}
                            />

                            <div className="md:col-span-2">
                                <TextField
                                    text={data.callback_url ?? "-"}
                                    type={"text"}
                                    copyValue={data.callback_url ? true : false}
                                    lineClamp
                                    linesCount={1}
                                    label={translate("resources.callbridge.mapping.fields.callback_url")}
                                />
                            </div>
                            <PaymentsTypesShowComponent payment_types={data.payment_types} />
                        </div>

                        <div className="mt-3 flex justify-end">
                            <div className="flex gap-3 md:gap-4">
                                <Button className="" onClick={() => setGenerateCallbackDialogOpen(true)}>
                                    {translate("app.ui.actions.generateCallback")}
                                </Button>

                                <Button className="" onClick={() => setEditDialogOpen(true)}>
                                    {translate("app.ui.actions.edit")}
                                </Button>

                                <Button className="" onClick={() => setDeleteDialogOpen(true)} variant={"outline_gray"}>
                                    {translate("app.ui.actions.delete")}
                                </Button>
                            </div>
                        </div>

                        {data.details && Object.keys(data.details).length > 0 && (
                            <div className="mt-5 border-t-[1px] border-neutral-90 pt-3 dark:border-neutral-100 md:mt-10 md:pt-8">
                                <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                                    {translate("resources.terminals.fields.details")}
                                </Label>
                                <div className="flex h-full">
                                    <MonacoEditor
                                        disabled
                                        height="h-48"
                                        width="100%"
                                        code={JSON.stringify(data.details || "{}", null, 2)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="my-5 border-y-[1px] border-neutral-90 py-5 dark:border-neutral-100 md:my-10 md:py-10">
                            <AuthDataViewer
                                authData={data.auth}
                                showAuthDataEditSheet={() => setEditAuthDataDialogOpen(true)}
                            />
                        </div>
                    </div>
                    {/* TODO */}
                    {/* <div className="flex flex-col gap-3">
                    <TextField text="Terminal account" className="text-display-3" />
                    <div className="flex gap-6">
                        <TextField text="" label="Type" />
                        <TextField text="" label="Account balance" />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2"></div>
                        <Button></Button>
                    </div>
                </div> */}
                </div>

                <Fees
                    fees={data?.fees}
                    feesResource={FeesResource.TERMINAL}
                    id={id}
                    providerName={provider}
                    padding={false}
                />
            </div>
            <GenerateCallbackDialog
                open={generateCallbackDialogOpen}
                onOpenChange={setGenerateCallbackDialogOpen}
                terminalId={id}
                providerName={provider}
            />

            <AuthDataEditSheet
                terminalId={id}
                provider={provider}
                open={editAuthDataDialogOpen}
                onOpenChange={setEditAuthDataDialogOpen}
                originalAuthData={data.auth}
            />

            <EditTerminalDialog provider={provider} id={id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

            <DeleteTerminalDialog
                provider={provider}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                deleteId={id}
            />
        </>
    );
};
