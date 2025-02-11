import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import { Fees } from "../../components/Fees";
import { FeesResource } from "@/data";

interface TerminalShowProps {
    id: string;
    provider: string;
}
export const TerminalShow = (props: TerminalShowProps) => {
    const { id, provider } = props;
    const dataProvider = useDataProvider();
    const [fees, setFees] = useState<Directions.Fees>();

    useEffect(() => {
        async function fetch() {
            const data = await dataProvider.getOne(`provider/${provider}/terminal`, { id });
            setFees(data.data.fees);
        }
        fetch();
    }, [dataProvider, id, provider]);

    console.log(fees);
    return (
        <div>
            <Fees fees={fees} feesResource={FeesResource.TERMINAL} id={id} providerName={provider} />
        </div>
    );
};
