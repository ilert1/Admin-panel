import { Loading } from "@/components/ui/loading";
import { useQueryWithAuth } from "@/hooks/useQueryWithAuth";
import { CallbridgeDataProvider } from "@/data";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

interface CallbridgeHistoryShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CallbridgeHistoryShow = (props: CallbridgeHistoryShowProps) => {
    const { id } = props;
    const dataProvider = new CallbridgeDataProvider();

    const { data: queryData, isLoading } = useQueryWithAuth({
        queryKey: ["GetHistoryById"],
        queryFn: async () => {
            const res = await dataProvider.getHistoryById("callbridge/v1/history", { id });
            return res.data.items;
        }
    });

    if (isLoading) return <Loading />;

    const code = queryData?.map(el => JSON.stringify(el, null, "\t")).join(",\n");

    return (
        <>
            <div className="flex h-full min-h-[300px] flex-col overflow-auto pt-0">
                <div className="flex h-full flex-col gap-2 px-4 md:px-[42px]">
                    <MonacoEditor
                        disabled
                        height="h-full"
                        width="100%"
                        onMountEditor={() => {}}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                        code={code ?? ""}
                        setCode={() => {}}
                    />
                </div>
            </div>
        </>
    );
};
