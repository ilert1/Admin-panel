import { FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useTranslate } from "react-admin";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantShowColumns } from "./Columns";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import { Fees } from "../../components/Fees";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { directionEndpointsListDirectionsByMerchantIdEnigmaV1DirectionMerchantMerchantIdGet } from "@/api/enigma/direction/direction";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import clsx from "clsx";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { EditMerchantDialog } from "../../lists/Merchants/EditMerchantDialog";
import { useState } from "react";
import { DeleteMerchantDialog } from "../../lists/Merchants/DeleteMerchantDialog";

interface MerchantShowProps {
    id: string;
    merchantName?: string;
    onOpenChange: (state: boolean) => void;
}

export const MerchantShow = (props: MerchantShowProps) => {
    const { id, merchantName, onOpenChange } = props;
    const translate = useTranslate();
    const data = fetchDictionaries();
    const appToast = useAppToast();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    if (!id) {
        appToast("error", translate("resources.merchant.errors.notFound", { name: merchantName }));
        onOpenChange(false);
    }

    const context = useAbortableShowController<Merchant>({
        resource: "merchant",
        id,
        queryOptions: {
            onError: () => {
                appToast("error", translate("resources.merchant.errors.notFound", { name: merchantName }));
                onOpenChange(false);
            }
        }
    });

    const {
        data: merchantDirections,
        isLoading: isMerchantDirectionsLoading,
        isFetching: isMerchantDirectionsFetching
    } = useQuery({
        queryKey: ["merchantDirections", "MerchantShow", context.record?.id],
        queryFn: async () => {
            if (context.record?.id) {
                try {
                    const res =
                        await directionEndpointsListDirectionsByMerchantIdEnigmaV1DirectionMerchantMerchantIdGet(
                            context.record.id,
                            {
                                currentPage: 1,
                                pageSize: 1000,
                                orderBy: "weight",
                                sortOrder: "desc"
                            },
                            {
                                headers: {
                                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                                }
                            }
                        );

                    if ("data" in res.data && res.data.success) {
                        return res.data.data.items;
                    } else if ("data" in res.data && !res.data.success) {
                        throw new Error(res.data.error?.error_message);
                    } else if ("detail" in res.data) {
                        throw new Error(res.data.detail?.[0].msg);
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        appToast("error", error.message);
                    }
                }
            }
        },
        enabled: !!context.record?.id
    });

    const { columns } = useGetMerchantShowColumns({ isFetching: isMerchantDirectionsFetching });

    const handleEditClicked = () => {
        setEditDialogOpen(true);
    };

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    const fees = context.record.fees;
    return (
        <>
            <div className="flex h-full min-h-[300px] flex-col overflow-auto pt-0">
                <div className="flex flex-col gap-1 md:gap-4">
                    <div className="px-4 md:px-[42px]">
                        <span className="text-title-1 text-neutral-90 dark:text-neutral-0">{context.record.name}</span>
                        <TextField
                            text={context.record.id}
                            copyValue
                            className="text-neutral-70 dark:text-neutral-30"
                        />
                    </div>
                    <div className="grid grid-cols-2 px-4 md:px-[42px]">
                        <TextField
                            label={translate("resources.merchant.fields.descr")}
                            text={context.record.description || ""}
                        />
                        <TextField label="Keycloak ID" text={context.record.keycloak_id || ""} />
                    </div>
                    <div className="self-end px-[42px]">
                        <div className="flex gap-2">
                            <Button className="" onClick={handleEditClicked}>
                                {translate("app.ui.actions.edit")}
                            </Button>
                            <Button className="" variant={"outline_gray"} onClick={() => setDeleteDialogOpen(true)}>
                                {translate("app.ui.actions.delete")}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-1 w-full flex-1 px-4 md:mt-4 md:px-[42px]">
                    <Fees
                        id={id}
                        fees={fees}
                        feesResource={FeesResource.MERCHANT}
                        className="max-h-[40dvh]"
                        padding={false}
                    />

                    <div className="mt-1 flex w-full flex-col gap-[8px] md:mt-5">
                        <span className="text-display-3 text-neutral-90 dark:text-neutral-30">
                            {translate("resources.merchant.fields.directions")}
                        </span>

                        {isMerchantDirectionsLoading ? (
                            <LoadingBlock />
                        ) : (
                            <SimpleTable
                                columns={columns}
                                tableType={TableTypes.COLORED}
                                data={merchantDirections || []}
                                className={clsx(
                                    "max-h-[30dvh] min-h-20",
                                    merchantDirections && merchantDirections.length > 1 && "min-h-44"
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
            <EditMerchantDialog id={id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
            <DeleteMerchantDialog
                id={id}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onCloseSheet={onOpenChange}
            />
        </>
    );
};
