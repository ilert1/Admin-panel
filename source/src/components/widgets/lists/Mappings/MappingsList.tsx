import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetMappingsColumns } from "./Columns";
import { CreateMappingDialog } from "./CreateMappingDialog";
import { DeleteMappingDialog } from "./DeleteMappingDialog";
import { CallbackMappingRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { MappingsListFilter } from "./MappingsListFilter";

export const MappingsList = () => {
    const listContext = useAbortableListController<CallbackMappingRead>({
        resource: "callbridge/v1/mapping",
        sort: {
            field: "created_at",
            order: "DESC"
        }
    });

    const {
        columns,
        chosenId,
        createMappingClicked,
        deleteMappingClicked,
        setDeleteMappingClicked,
        setCreateMappingClicked
    } = useGetMappingsColumns();

    if (listContext.isLoading) {
        return <Loading />;
    }

    // listContext.setFilters({ name: "[OpenPay] OpenPay[P2PTrade]" });
    // listContext.setFilters(
    //     {
    //         internal_path:
    //             "http://openpay_callback:8000/openpay/v1/callback/LXZ2ZH1JEu2tkDVuNmJ8PKMXokSUFrTMnyWvYkhV8PGibsqbpJh1x1gzCQM19CwCmDho4BW1xqoMWN7n9YiHBXrDesd7z385Q8LPVKfxMRS1DaTcktzFqEjmiQ6qtvtYhVb3TX86YS84KEcWuJxBsKVD5oJVUdE4uDqeYMSgLnHJaW9nP2ShJHqmQfN151PJcKYnx49Pm7bQo4AJraWzN1LnhGxhbvWZ4ngJhXEpkmwYvMpP3NnMekVJ7mkFHtac2snspn7MCqveiysK3xhR31s1yYGxj5gd91sXB4hHVdSGUTK6S4SPSrD2AjDVwwHguyq8n7ZuqLMYxSFre4G5GvLijsxc7MwFocWSf4KnZLuAMQv7aqg2Z5tbvjudXXdiQarTzWszQqQ6mhRijMrNYXvfymWNdvpnAWhVzf74DRTCCuv8BjVQzhnyZF17YSPKpCjP2U5QNwJZ1wfJXFBeqSXYrDm4UmWJqwu9FeW6ZxJq88ZDaeQf22BGSAz4DZPCUfuArgvMxnEPWg6qxJHnkwwuQErrQ1dDJQCKaAEnhGzZxzrw88KLN2bGcEAFZFDhvMuVqQpAh2z63Kiz57iB61KjgQG6WrhyN3qBB4xRnCmTiFrkqXREtg2HqqjFYmPQFiVCuENp5LWyxdp2UdkKcDqRLaiWLAnva8dASdiyh12dzmpfknXdHe71HCG"
    //     },
    //     {
    //         internal_path:
    //             "http://openpay_callback:8000/openpay/v1/callback/LXZ2ZH1JEu2tkDVuNmJ8PKMXokSUFrTMnyWvYkhV8PGibsqbpJh1x1gzCQM19CwCmDho4BW1xqoMWN7n9YiHBXrDesd7z385Q8LPVKfxMRS1DaTcktzFqEjmiQ6qtvtYhVb3TX86YS84KEcWuJxBsKVD5oJVUdE4uDqeYMSgLnHJaW9nP2ShJHqmQfN151PJcKYnx49Pm7bQo4AJraWzN1LnhGxhbvWZ4ngJhXEpkmwYvMpP3NnMekVJ7mkFHtac2snspn7MCqveiysK3xhR31s1yYGxj5gd91sXB4hHVdSGUTK6S4SPSrD2AjDVwwHguyq8n7ZuqLMYxSFre4G5GvLijsxc7MwFocWSf4KnZLuAMQv7aqg2Z5tbvjudXXdiQarTzWszQqQ6mhRijMrNYXvfymWNdvpnAWhVzf74DRTCCuv8BjVQzhnyZF17YSPKpCjP2U5QNwJZ1wfJXFBeqSXYrDm4UmWJqwu9FeW6ZxJq88ZDaeQf22BGSAz4DZPCUfuArgvMxnEPWg6qxJHnkwwuQErrQ1dDJQCKaAEnhGzZxzrw88KLN2bGcEAFZFDhvMuVqQpAh2z63Kiz57iB61KjgQG6WrhyN3qBB4xRnCmTiFrkqXREtg2HqqjFYmPQFiVCuENp5LWyxdp2UdkKcDqRLaiWLAnva8dASdiyh12dzmpfknXdHe71HCG"
    //     }
    // );
    return (
        <>
            <MappingsListFilter setCreateMappingClicked={setCreateMappingClicked} setFilters={listContext.setFilters} />

            <ListContextProvider value={listContext}>
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
            <CreateMappingDialog open={createMappingClicked} onOpenChange={setCreateMappingClicked} />
            <DeleteMappingDialog
                deleteId={chosenId}
                open={deleteMappingClicked}
                onOpenChange={setDeleteMappingClicked}
            />
        </>
    );
};
