import { FeesResource, MerchantsDataProvider, CascadeMerchantsDataProvider } from "@/data";
import { useTranslate } from "react-admin";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantShowColumns } from "./Columns";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import { Fees } from "../../components/Fees";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import clsx from "clsx";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Button } from "@/components/ui/Button";
import { EditMerchantDialog } from "../../lists/Merchants/EditMerchantDialog";
import { useState } from "react";
import { DeleteMerchantDialog } from "../../lists/Merchants/DeleteMerchantDialog";
import { useQuery } from "@tanstack/react-query";
import { PaymentsTypesShowComponent } from "../../components/PaymentsTypesShowComponent";
import { useFetchDictionaries } from "@/hooks";
import { MerchantSettingsDialog } from "./MerchantSettingsDialog";
import { MerchantSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Badge } from "@/components/ui/badge";
import { CreateCascadeMerchantsDialog } from "../../lists/CascadeMerchants/CreateCascadeMerchantDialog";

interface MerchantShowProps {
    id: string;
    merchantName?: string;
    onOpenChange: (state: boolean) => void;
}

export const MerchantShow = (props: MerchantShowProps) => {
    const { id, merchantName, onOpenChange } = props;
    const translate = useTranslate();
    const data = useFetchDictionaries();
    const dataProvider = new MerchantsDataProvider();
    const cascadeMerchantsDataProvider = new CascadeMerchantsDataProvider();

    const appToast = useAppToast();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [uniqeunessOpen, setuniqeunessOpen] = useState(false);
    const [createCascadeLinkDialogOpen, setCreateCascadeLinkDialogOpen] = useState(false);

    if (!id) {
        appToast("error", translate("resources.merchant.errors.notFound", { name: merchantName }));
        onOpenChange(false);
    }

    const context = useAbortableShowController<MerchantSchema>({
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

    const {
        data: cascadeMerchants,
        isLoading: isCascadeMerchantsLoading,
        isFetching: isFetchingCascadeMerchantData
    } = useQuery({
        queryKey: ["cascadeMerchants", context.record?.id],
        queryFn: async ({ signal }) => {
            if (context.record?.id)
                return await cascadeMerchantsDataProvider.getList("cascadeSettings/cascadeMerchants", {
                    pagination: { page: 1, perPage: 10000 },
                    filter: { merchant_id: context.record?.id },
                    signal
                });
        },
        select: data => data?.data,
        enabled: !!context.record?.id
    });

    const { directionColumns, cascadeMerchantsColumns } = useGetMerchantShowColumns({
        isFetchingMerchantData: isMerchantDirectionsFetching,
        isFetchingCascadeMerchantData
    });

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
                    <div className="grid grid-cols-1 gap-y-2 px-4 md:grid-cols-2 md:px-[42px]">
                        <TextField
                            label={translate("resources.merchant.fields.descr")}
                            text={context.record.description || ""}
                        />
                        <TextField label="Keycloak ID" copyValue text={context.record.keycloak_id || ""} />

                        <div className="mr-2 flex flex-col pr-2">
                            <small className="mb-0.5 text-sm text-neutral-60">
                                {translate("resources.merchant.fields.currencies")}
                            </small>

                            <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                                {context.record.allowed_src_currencies &&
                                context.record.allowed_src_currencies.length > 0 ? (
                                    context.record.allowed_src_currencies.map(value => (
                                        <Badge key={value.code} variant="currency">
                                            {value.code}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="title-1">-</span>
                                )}
                            </div>
                        </div>

                        <PaymentsTypesShowComponent payment_types={payment_types} />

                        <TextField
                            label={translate("app.widgets.ttl.TTLDep")}
                            text={`${String(context.record.settings?.deposit?.ttl?.min ?? "-")} / ${String(context.record.settings?.deposit?.ttl?.max ?? "-")}`}
                        />

                        <TextField
                            label={translate("app.widgets.ttl.TTLWith")}
                            text={`${String(context.record.settings?.withdraw?.ttl?.min ?? "-")} / ${String(context.record.settings?.withdraw?.ttl?.max ?? "-")}`}
                        />
                    </div>
                    <div className="self-end px-[42px]">
                        <div className="flex gap-2">
                            <Button className="" onClick={() => setuniqeunessOpen(true)}>
                                {translate("resources.merchant.settings.title")}
                            </Button>
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
                        className="max-h-[30dvh]"
                        padding={false}
                    />

                    <div className="mt-1 flex w-full flex-col gap-[8px] md:mt-5">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-display-3 text-neutral-90 dark:text-neutral-30">
                                {translate("resources.cascadeSettings.cascadeMerchants.nameMerchantShow")}
                            </span>

                            <Button className="" onClick={() => setCreateCascadeLinkDialogOpen(true)}>
                                {translate("resources.cascadeSettings.cascadeMerchants.link")}
                            </Button>
                        </div>

                        {isCascadeMerchantsLoading ? (
                            <LoadingBlock />
                        ) : (
                            <SimpleTable
                                columns={cascadeMerchantsColumns}
                                tableType={TableTypes.COLORED}
                                data={cascadeMerchants || []}
                                className={clsx(
                                    "min-h-20",
                                    cascadeMerchants && cascadeMerchants.length > 1 && "min-h-44"
                                )}
                            />
                        )}
                    </div>

                    <div className="mt-1 flex w-full flex-col gap-[8px] md:mt-5">
                        <span className="text-display-3 text-neutral-90 dark:text-neutral-30">
                            {translate("resources.merchant.fields.directions")}
                        </span>

                        {isMerchantDirectionsLoading ? (
                            <LoadingBlock />
                        ) : (
                            <SimpleTable
                                columns={directionColumns}
                                tableType={TableTypes.COLORED}
                                data={merchantDirections || []}
                                className={clsx(
                                    "min-h-20",
                                    merchantDirections && merchantDirections.length > 1 && "min-h-44"
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
            <MerchantSettingsDialog open={uniqeunessOpen} onOpenChange={setuniqeunessOpen} merchantId={id} />
            <EditMerchantDialog id={id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
            <DeleteMerchantDialog
                id={id}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onCloseSheet={onOpenChange}
            />
            <CreateCascadeMerchantsDialog
                merchantId={id}
                open={createCascadeLinkDialogOpen}
                onOpenChange={setCreateCascadeLinkDialogOpen}
            />
        </>
    );
};
