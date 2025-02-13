import { useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import { Fees } from "../../components/Fees";
import { FeesResource } from "@/data";
import { TextField } from "@/components/ui/text-field";
import { useQuery } from "react-query";
import { LoadingBlock } from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";

interface TerminalShowProps {
    id: string;
    provider: string;
}
export const TerminalShow = (props: TerminalShowProps) => {
    const { id, provider } = props;
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [data, setData] = useState<Directions.Terminal>();

    const { isLoading } = useQuery({
        queryKey: ["terminal-fees", provider, id],
        queryFn: async () => {
            const { data } = await dataProvider.getOne(`provider/${provider}/terminal`, { id });
            setData(data);
        }
    });

    if (isLoading || !data) {
        return <LoadingBlock />;
    }

    return (
        <div className="px-[45px] ">
            <div className="flex flex-col gap-2">
                <TextField text={id} copyValue className="text-display-4" />
                <div className="flex gap-6">
                    <TextField text={data.verbose_name} label={translate("resources.terminals.fields.verbose_name")} />
                    <TextField text={data.provider} label={translate("resources.terminals.fields.description")} />
                    <TextField text={data.description ?? ""} label={translate("resources.terminals.fields.provider")} />
                </div>
                <div className="">
                    <Label className="mb-0">{translate("resources.terminals.fields.auth")}</Label>
                    <TextField text={JSON.stringify(data.auth)} />
                    {/* <span className="text-ellipsis overflow-hidden text-nowrap block">{JSON.stringify(data.auth)}</span> */}
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
