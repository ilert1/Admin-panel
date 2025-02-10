import { useEffect } from "react";
import { fetchUtils, useDataProvider } from "react-admin";

interface TerminalShowProps {
    id: string;
    provider: string;
}
export const TerminalShow = (props: TerminalShowProps) => {
    const { id, provider } = props;
    const dataProvider = useDataProvider();
    // const { data, isFetching } = useShowController({ id });

    useEffect(() => {
        async function fetch() {
            const data = await dataProvider.getOne(`provider/${provider}/terminal`, { id });

            // const data = await fetchUtils.fetchJson(
            //     `https://apigate.develop.blowfish.api4ftx.cloud/enigma/v1/provider/${provider}/terminal/${id}`
            // );

            console.log(data);
        }
        fetch();
    }, []);

    return (
        <div>
            <div></div>
        </div>
    );
};
