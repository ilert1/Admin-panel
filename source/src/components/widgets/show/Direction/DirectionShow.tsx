import { useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { useCallback, useEffect, useState } from "react";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { FeesResource } from "@/data";
import { DeleteDirectionDialog } from "./DeleteDirectionDialog";
import { EditDirectionDialog } from "./EditDirectionDialog";
import { Fees } from "../../components/Fees";
import { Direction, MerchantFees } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { LimitsList } from "../../components/Limits/ui/LimitsList";
import { useSheets } from "@/components/providers/SheetProvider";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { PaymentsTypesShowComponent } from "../../components/PaymentsTypesShowComponent";

export interface DirectionsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const DirectionsShow = ({ id, onOpenChange }: DirectionsShowProps) => {
    const context = useAbortableShowController<Direction>({ resource: "direction", id });
    const data = fetchDictionaries();
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const [fees, setFees] = useState<MerchantFees>();

    const handleDeleteClicked = useCallback(() => {
        setDeleteDialogOpen(prev => !prev);
    }, []);

    const handleEditClicked = useCallback(() => {
        setEditDialogOpen(prev => !prev);
    }, []);

    useEffect(() => {
        if (context?.record?.fees) {
            setFees(context?.record?.fees);
        }
    }, [context.record]);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    const feesVariants = [context.record.src_currency.code];
    !(context.record.dst_currency.code === context.record.src_currency.code) &&
        feesVariants.push(context.record.dst_currency.code);

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center justify-between md:flex-nowrap">
                <TextField text={context.record.id} copyValue className="text-neutral-70 dark:text-neutral-30" />

                <div className="mt-2 flex items-center justify-center self-start text-white sm:mt-0 sm:self-center">
                    {context.record.state === "active" ? (
                        <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.direction.fields.stateActive")}
                        </span>
                    ) : (
                        <span className="whitespace-nowrap rounded-20 bg-red-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.direction.fields.stateInactive")}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-2 md:ml-[32px] md:gap-[24px]">
                        <TextField label={translate("resources.direction.fields.name")} text={context.record.name} />

                        <TextField
                            label={translate("resources.direction.fields.srcCurr")}
                            text={context.record.src_currency.code}
                        />

                        <TextField
                            label={translate("resources.direction.fields.destCurr")}
                            text={context.record.dst_currency.code}
                        />

                        <TextField
                            label={translate("resources.direction.fields.terminal")}
                            className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                            text={context.record.terminal.verbose_name}
                            onClick={() => {
                                openSheet("terminal", {
                                    id: context.record.terminal.terminal_id,
                                    provider: context.record.terminal.provider
                                });
                            }}
                        />

                        <TextField
                            label={translate("resources.direction.fields.accountNumber")}
                            text={context.record.account_id || ""}
                            wrap
                            copyValue
                        />
                        <TextField
                            label={translate("resources.direction.weight")}
                            text={String(context.record.weight)}
                            wrap
                        />
                    </div>

                    <div className="ml-2 flex flex-col gap-2 md:ml-[32px] md:gap-[24px]">
                        <TextField
                            label={translate("resources.direction.merchant")}
                            text={context.record.merchant.name}
                            onClick={() => {
                                openSheet("merchant", {
                                    id: context.record.merchant.id ?? "",
                                    merchantName: context.record.merchant.name ?? ""
                                });
                            }}
                        />

                        <TextField
                            label={translate("resources.direction.provider")}
                            className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                            text={context.record.provider.name}
                            onClick={() => {
                                openSheet("provider", {
                                    id: context.record.provider.name
                                });
                            }}
                        />

                        <TextField
                            label={translate("resources.direction.types.type")}
                            text={
                                context.record.type
                                    ? translate(`resources.direction.types.${context.record.type}`)
                                    : "-"
                            }
                        />

                        <TextField
                            label={translate("resources.direction.fields.description")}
                            text={context.record.description ?? ""}
                        />
                        <PaymentsTypesShowComponent payment_types={context.record.payment_types} />
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button className="" onClick={handleEditClicked}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="" onClick={handleDeleteClicked} variant={"outline_gray"}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>

                <Fees
                    id={id}
                    fees={fees}
                    feesResource={FeesResource.DIRECTION}
                    feesVariants={feesVariants}
                    className="max-h-[45dvh]"
                />

                <LimitsList id={context.record.id} limits={context.record.limits} />
            </div>

            <DeleteDirectionDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />

            <EditDirectionDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} />
        </div>
    );
};
