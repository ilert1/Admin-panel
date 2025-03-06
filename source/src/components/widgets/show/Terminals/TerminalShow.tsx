import { useDataProvider, useTranslate } from "react-admin";
import { Fees } from "../../components/Fees";
import { FeesResource } from "@/data";
import { TextField } from "@/components/ui/text-field";
import { useQuery } from "react-query";
import { LoadingBlock } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { TerminalWithId } from "@/data/terminals";

interface TerminalShowProps {
    id: string;
    provider: string;
    setDeleteDialogOpen: (state: boolean) => void;
    setEditDialogOpen: (state: boolean) => void;
}
export const TerminalShow = (props: TerminalShowProps) => {
    const { id, provider, setEditDialogOpen, setDeleteDialogOpen } = props;
    const dataProvider = useDataProvider();
    const translate = useTranslate();

    const { data, isLoading } = useQuery({
        queryKey: ["terminal-fees", provider, id],
        queryFn: async () => {
            const { data } = await dataProvider.getOne<TerminalWithId>(`${provider}/terminal`, { id });
            return data;
        }
    });

    const { data: accountData, isLoading: accountsLoading } = useQuery({
        queryKey: ["account_data", data?.id],
        queryFn: async () => {
            const { data: queryData } = await dataProvider.getOne(`accounts`, { id: data?.id });
            console.log(queryData);
            return queryData;
        },
        enabled: !isLoading
    });

    if (isLoading || !data || accountsLoading || !accountData) {
        return <LoadingBlock />;
    }
    console.log(accountData);

    return (
        <div className="px-[45px] flex flex-col gap-4">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <TextField text={id} copyValue className="text-display-4" />
                    <div className="flex gap-6">
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
                    <div className="">
                        <Label className="mb-0">{translate("resources.terminals.fields.auth")}</Label>
                        <TextField text={JSON.stringify(data.auth)} copyValue />
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="flex gap-4">
                        <Button className="" onClick={() => setEditDialogOpen(true)}>
                            {translate("app.ui.actions.edit")}
                        </Button>
                        <Button className="" onClick={() => setDeleteDialogOpen(true)} variant={"outline_gray"}>
                            {translate("app.ui.actions.delete")}
                        </Button>
                    </div>
                </div>
            </div>
            <Fees
                fees={data?.fees}
                feesResource={FeesResource.TERMINAL}
                id={id}
                providerName={provider}
                padding={false}
            />
        </div>
    );
};
