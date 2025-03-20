import { FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useEffect, useState } from "react";
import { useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantShowColumns } from "./Columns";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import { Fees } from "../../components/Fees";
import { Direction, Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { directionEndpointsListDirectionsByMerchantIdEnigmaV1DirectionMerchantMerchantIdGet } from "@/api/enigma/direction/direction";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import clsx from "clsx";

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

    const context = useShowController<Merchant>({
        resource: "merchant",
        id,
        queryOptions: {
            onError: () => {
                appToast("error", translate("resources.merchant.errors.notFound", { name: merchantName }));
                onOpenChange(false);
            }
        }
    });

    const { columns } = useGetMerchantShowColumns();

    const [merchantDirections, setMerchantDirections] = useState<Direction[]>([]);

    useEffect(() => {
        const fetchMerchantDirections = async () => {
            if (context.record?.id) {
                try {
                    const res =
                        await directionEndpointsListDirectionsByMerchantIdEnigmaV1DirectionMerchantMerchantIdGet(
                            context.record.id,
                            {
                                currentPage: 1,
                                pageSize: 1000
                            },
                            {
                                headers: {
                                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                                }
                            }
                        );

                    if ("data" in res.data && res.data.success) {
                        setMerchantDirections(res.data.data.items);
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
        };

        if (context.record) {
            fetchMerchantDirections();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.record]);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    const fees = context.record.fees;
    return (
        <>
            <div className="pt-0 h-full min-h-[300px] flex flex-col overflow-auto">
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
                </div>
                <div className="flex-1 mt-1 md:mt-4 w-full px-4 md:px-[42px]">
                    <Fees
                        id={id}
                        fees={fees}
                        feesResource={FeesResource.MERCHANT}
                        className="max-h-[40dvh]"
                        padding={false}
                    />

                    <div className="mt-1 md:mt-5 w-full flex flex-col gap-[8px] ">
                        <span className="text-display-3 text-neutral-90 dark:text-neutral-30">
                            {translate("resources.merchant.fields.directions")}
                        </span>
                        <SimpleTable
                            columns={columns}
                            tableType={TableTypes.COLORED}
                            data={merchantDirections}
                            className={clsx("max-h-[30dvh] min-h-20", merchantDirections.length > 1 && "min-h-44")}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
