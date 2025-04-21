import { useDataProvider, useTranslate } from "react-admin";
import { Fees } from "../../components/Fees";
import { FeesResource } from "@/data";
import { TextField } from "@/components/ui/text-field";
import { useQuery } from "@tanstack/react-query";
import { LoadingBlock } from "@/components/ui/loading";
import { Button } from "@/components/ui/Button";
import { TerminalWithId } from "@/data/terminals";
import { EditTerminalDialog } from "../../lists/Terminals/EditTerminalDialog";
import { DeleteTerminalDialog } from "../../lists/Terminals/DeleteTerminalDialog";
import { useState } from "react";
import { AuthDataViewer } from "../../edit/Terminals/AuthDataViewer";
import { GenerateCallbackDialog } from "./GenerateCallbackDialog";

interface TerminalShowProps {
    id: string;
    provider: string;
    onOpenChange: (state: boolean) => void;
}
export const TerminalShow = (props: TerminalShowProps) => {
    const { id, provider, onOpenChange } = props;

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [generateCallbackDialogOpen, setGenerateCallbackDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const dataProvider = useDataProvider();
    const translate = useTranslate();

    const { data, isLoading } = useQuery({
        queryKey: ["terminal-fees", provider, id],
        queryFn: async ({ signal }) => {
            try {
                const { data } = await dataProvider.getOne<TerminalWithId>(`${provider}/terminal`, { id, signal });

                if (!data) {
                    throw new Error();
                }

                return data;
            } catch (error) {
                onOpenChange(false);
            }
        }
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

                        <div className="flex gap-4 md:gap-6">
                            <TextField
                                text={data.verbose_name}
                                label={translate("resources.terminals.fields.verbose_name")}
                            />

                            <TextField text={data.provider} label={translate("resources.terminals.fields.provider")} />

                            <TextField
                                text={data.description ?? ""}
                                label={translate("resources.terminals.fields.description")}
                            />
                            <TextField
                                text={data.callback_url ?? "-"}
                                type={data.callback_url ? "link" : "text"}
                                label={translate("resources.callbridge.mapping.fields.callback_url")}
                            />
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

                        <div className="my-5 border-y-[1px] border-neutral-90 py-5 md:my-10 md:py-10">
                            <AuthDataViewer
                                disabledEditJson={true}
                                authData={JSON.stringify(data.auth, null, 2)}
                                titleClassName="text-xl md:text-2xl"
                                tableClassName="rounded-16 overflow-hidden"
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
