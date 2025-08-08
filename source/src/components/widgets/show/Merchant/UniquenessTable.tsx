import { Loading, useRefresh, useTranslate } from "react-admin";
import { useState } from "react";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { MerchantsDataProvider } from "@/data";
import { SimpleTable } from "../../shared";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { TableTypes } from "../../shared/SimpleTable";
import { UniqunessActivityButton } from "./UniqunessActivityButton";
import { Button } from "@/components/ui/Button";
import { AddUniqunessDialog } from "./AddUniqunessDialog";

interface UniquenessTableProps {
    id: string;
}

export const UniquenessTable = (props: UniquenessTableProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = new MerchantsDataProvider();

    const appToast = useAppToast();

    const { id } = props;

    const [addUniquenessModalOpen, setAddUniquenessModalOpen] = useState(false);
    const [uniqunessDirection, setUniqunessDirection] = useState<UniqunessDirectionType>("deposit");

    const { data, isLoading } = useQuery({
        queryKey: ["merchantUniqueness", id],
        queryFn: () => dataProvider.getMerchantUniqueness(id),
        enabled: !!id,
        select: data => data?.[0]
    });

    const uniqunessColumns: ColumnDef<UniqunessItem>[] = [
        {
            id: "mode",
            accessorKey: "mode",
            header: translate("resources.merchant.uniqueness.columns.mode"),
            cell: ({ row }) => {
                return <TextField text={row.original.mode} />;
            }
        },
        {
            id: "minmax",
            accessorKey: "minmax",
            header: translate("resources.merchant.uniqueness.columns.minmax"),
            cell: ({ row }) => {
                return <TextField text={row.original.min + " - " + row.original.max} />;
            }
        },
        {
            id: "chance",
            accessorKey: "chance",
            header: translate("resources.merchant.uniqueness.columns.chance"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.chance)} />;
            }
        }
    ];
    console.log(data);

    if (isLoading || !data) {
        return <Loading />;
    }

    return (
        <>
            <div className="mt-5 w-full">
                <div className="flex w-full flex-col gap-2">
                    <div className="flex justify-between">
                        <h3 className="text-display-3 text-neutral-90 dark:text-neutral-30">
                            {translate("resources.merchant.uniqueness.deposit")}
                        </h3>
                        <UniqunessActivityButton
                            id={id}
                            directionName="deposit"
                            activityState={data?.uniqueness?.deposit?.enable ?? false}
                            isFetching={isLoading}
                            disabled={!data?.uniqueness?.deposit || !Object.keys(data?.uniqueness?.deposit).length}
                        />
                    </div>
                    <SimpleTable
                        columns={uniqunessColumns}
                        data={data?.uniqueness?.deposit ? [data?.uniqueness?.deposit] : []}
                        tableType={TableTypes.COLORED}
                        className="overflow-hidden"
                        notFoundMessage={
                            <Button
                                onClick={() => {
                                    setAddUniquenessModalOpen(true);
                                    setUniqunessDirection("deposit");
                                }}>
                                <div>Добавить</div>
                            </Button>
                        }
                    />
                </div>
                <div className="flex w-full flex-col gap-2">
                    <div className="flex justify-between">
                        <h3 className="text-display-3 text-neutral-90 dark:text-neutral-30">
                            {translate("resources.merchant.uniqueness.withdraw")}
                        </h3>
                        <UniqunessActivityButton
                            id={id}
                            directionName="withdraw"
                            activityState={data?.uniqueness?.withdraw?.enable ?? false}
                            isFetching={isLoading}
                            disabled={!data?.uniqueness?.withdraw || !Object.keys(data?.uniqueness?.withdraw).length}
                        />
                    </div>
                    <SimpleTable
                        columns={uniqunessColumns}
                        data={data?.uniqueness?.withdraw ? [data?.uniqueness?.withdraw] : []}
                        tableType={TableTypes.COLORED}
                        className="overflow-hidden"
                        notFoundMessage={
                            <Button
                                onClick={() => {
                                    setAddUniquenessModalOpen(true);
                                    setUniqunessDirection("withdraw");
                                }}>
                                <div>Добавить</div>
                            </Button>
                        }
                    />
                </div>
            </div>
            <AddUniqunessDialog
                open={addUniquenessModalOpen}
                onOpenChange={setAddUniquenessModalOpen}
                merchantId={id}
                directionName={uniqunessDirection}
                prevData={data}
            />
        </>
    );
};
