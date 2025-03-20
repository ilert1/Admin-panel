import { useDataProvider, useTranslate } from "react-admin";
import { Fees } from "../../components/Fees";
import { FeesResource } from "@/data";
import { TextField } from "@/components/ui/text-field";
import { useQuery } from "react-query";
import { LoadingBlock } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { TerminalWithId } from "@/data/terminals";
import { EditTerminalDialog } from "../../lists/Terminals/EditTerminalDialog";
import { DeleteTerminalDialog } from "../../lists/Terminals/DeleteTerminalDialog";
import { useState } from "react";

interface TerminalShowProps {
    id: string;
    provider: string;
    onOpenChange: (state: boolean) => void;
}
export const TerminalShow = (props: TerminalShowProps) => {
    const { id, provider, onOpenChange } = props;

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const dataProvider = useDataProvider();
    const translate = useTranslate();

    const { data, isLoading } = useQuery({
        queryKey: ["terminal-fees", provider, id],
        queryFn: async () => {
            try {
                const { data } = await dataProvider.getOne<TerminalWithId>(`${provider}/terminal`, { id });

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
            <div className="px-4 md:px-[45px] flex flex-col gap-2 md:gap-4">
                <div className="flex flex-col gap-3 md:gap-6">
                    <div className="flex flex-col gap-2">
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
                        </div>

                        <div>
                            <Label className="mb-0">{translate("resources.terminals.fields.auth")}</Label>
                            <TextField text={JSON.stringify(data.auth)} copyValue />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="flex gap-3 md:gap-4">
                            <Button className="" onClick={() => setEditDialogOpen(true)}>
                                {translate("app.ui.actions.edit")}
                            </Button>

                            <Button className="" onClick={() => setDeleteDialogOpen(true)} variant={"outline_gray"}>
                                {translate("app.ui.actions.delete")}
                            </Button>
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
