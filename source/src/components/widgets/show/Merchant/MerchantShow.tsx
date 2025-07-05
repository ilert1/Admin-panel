import { FeesResource, MerchantsDataProvider } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useTranslate } from "react-admin";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantShowColumns } from "./Columns";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import { Fees } from "../../components/Fees";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import clsx from "clsx";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Button } from "@/components/ui/Button";
import { EditMerchantDialog } from "../../lists/Merchants/EditMerchantDialog";
import { useState } from "react";
import { DeleteMerchantDialog } from "../../lists/Merchants/DeleteMerchantDialog";
import { useQuery } from "@tanstack/react-query";
import { PaymentsTypesShowComponent } from "../../components/PaymentsTypesShowComponent";

interface MerchantShowProps {
    id: string;
    merchantName?: string;
    onOpenChange: (state: boolean) => void;
}

export const MerchantShow = (props: MerchantShowProps) => {
    const { id, merchantName, onOpenChange } = props;
    const translate = useTranslate();
    const data = fetchDictionaries();
    const dataProvider = new MerchantsDataProvider();

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
        queryFn: async ({ signal }) => {
            if (context.record?.id)
                return await dataProvider.getMerchantDirections("merchant", context.record.id, signal);
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
    const payment_types = context.record.payment_types;
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
                    <div className="grid grid-cols-2 gap-y-2 px-4 md:px-[42px]">
                        <TextField
                            label={translate("resources.merchant.fields.descr")}
                            text={context.record.description || ""}
                        />
                        <TextField label="Keycloak ID" copyValue text={context.record.keycloak_id || ""} />

                        <PaymentsTypesShowComponent payment_types={payment_types} />
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
