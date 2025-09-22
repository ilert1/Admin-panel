import { useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { useCallback, useEffect, useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { FeesResource } from "@/data";
import { DeleteDirectionDialog } from "./DeleteDirectionDialog";
import { EditDirectionDialog } from "./EditDirectionDialog";
import { Fees } from "../../components/Fees";
import { Direction, MerchantBaseFees } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { LimitsList } from "../../components/Limits/ui/LimitsList";
import { useSheets } from "@/components/providers/SheetProvider";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { PaymentsTypesShowComponent } from "../../components/PaymentsTypesShowComponent";
import { Badge } from "@/components/ui/badge";
import { useCountryCodes, useFetchDictionaries } from "@/hooks";
import { CountryTextField } from "../../components/CountryTextField";

export interface DirectionsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const DirectionsShow = ({ id, onOpenChange }: DirectionsShowProps) => {
    const context = useAbortableShowController<Direction>({ resource: "direction", id });
    const data = useFetchDictionaries();
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const { countryCodesWithFlag } = useCountryCodes();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const [fees, setFees] = useState<MerchantBaseFees>();

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

    const feesVariants = [context.record.src_currency];
    !(context.record.dst_currency.code === context.record.src_currency.code) &&
        feesVariants.push(context.record.dst_currency);
    const isPrioritized = context.record.condition?.extra ?? false;

    const controlsDisabled = !!context.record.cascade_id;
    const dst_country = countryCodesWithFlag.find(item => item.alpha2 === context.record?.dst_country_code);

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col flex-wrap gap-2 md:flex-nowrap">
                    <div className="flex gap-2">
                        <div className="flex flex-col">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-title-2 text-neutral-90 dark:text-neutral-0">
                                    {context.record.name}
                                </span>
                            </div>
                            <TextField
                                text={context.record.id}
                                copyValue
                                className="text-neutral-70 dark:text-neutral-30"
                            />
                        </div>

                        <div className="mt-2 flex items-center justify-center self-start text-white sm:mt-0">
                            {context.record.state === "active" && (
                                <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                                    {translate("resources.cascadeSettings.cascades.state.active")}
                                </span>
                            )}
                            {context.record.state === "inactive" && (
                                <span className="whitespace-nowrap rounded-20 bg-red-50 px-3 py-0.5 text-center text-title-2 font-normal">
                                    {translate("resources.cascadeSettings.cascades.state.inactive")}
                                </span>
                            )}
                        </div>
                    </div>
                    {!isPrioritized && (
                        <Badge variant={"destructive"} className="self-start !rounded-16 bg-red-50 py-0">
                            {translate("resources.direction.fields.condition.prioritized")}
                        </Badge>
                    )}
                </div>

                {context.record.description && (
                    <div className="md:col-span-2">
                        <TextField
                            label={translate("resources.cascadeSettings.cascades.fields.description")}
                            text={context.record.description ?? ""}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-2 gap-2">
                    <TextField
                        label={translate("resources.direction.types.type")}
                        text={context.record.type ? translate(`resources.direction.types.${context.record.type}`) : "-"}
                    />
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
                    <PaymentsTypesShowComponent payment_types={context.record.payment_types} />

                    <CountryTextField
                        text={dst_country?.name || ""}
                        label={translate("resources.direction.destinationCountry")}
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.direction.fields.srcCurr")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge key={context.record.src_currency.code} variant="currency">
                                {context.record.src_currency.code}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.direction.fields.destCurr")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge key={context.record.dst_currency.code} variant="currency">
                                {context.record.dst_currency.code}
                            </Badge>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.direction.fields.accountNumber")}
                        text={context.record.account_id || ""}
                        wrap
                        copyValue
                    />

                    <div className="col-span-2 mt-2 border-t-[1px] border-neutral-90 pt-2 dark:border-neutral-100 md:mt-5 md:pt-5" />

                    <TextField
                        label={translate("resources.direction.fields.cascade")}
                        text={context.record.cascade_id ?? ""}
                        onClick={
                            context.record.cascade_id
                                ? () => {
                                      openSheet("cascade", {
                                          id: context.record.cascade_id ?? ""
                                      });
                                  }
                                : undefined
                        }
                    />
                    <TextField
                        label={translate("resources.direction.fields.kinds.cascadeKind")}
                        text={
                            context.record.cascade_kind
                                ? translate(`resources.direction.fields.kinds.${context.record.cascade_kind}`)
                                : ""
                        }
                    />
                    <div className="col-span-2 mt-2 border-t-[1px] border-neutral-90 pt-2 dark:border-neutral-100 md:mt-5 md:pt-5" />

                    <TextField
                        label={translate("resources.direction.provider")}
                        className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                        text={context.record.provider.name}
                        onClick={() => {
                            openSheet("provider", {
                                id: context.record.provider.id as string
                            });
                        }}
                    />
                    <TextField
                        label={translate("resources.direction.fields.terminal")}
                        className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                        text={context.record.terminal.verbose_name}
                        onClick={() => {
                            openSheet("terminal", {
                                id: context.record.terminal.terminal_id
                            });
                        }}
                    />
                    <TextField
                        label={translate("resources.direction.weight")}
                        text={String(context.record.weight)}
                        wrap
                    />

                    <TextField
                        label={translate("resources.direction.fields.condition.rank")}
                        text={String(context.record.condition?.rank ?? "")}
                    />

                    {/* <TextField
                            label={translate("resources.direction.fields.condition.rank")}
                            text={String(context.record.cascade_id)}
                        /> */}
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button className="" onClick={handleEditClicked} disabled={controlsDisabled}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button
                        className=""
                        onClick={handleDeleteClicked}
                        variant={"outline_gray"}
                        disabled={controlsDisabled}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>

                <Fees
                    id={id}
                    fees={fees}
                    feesResource={FeesResource.DIRECTION}
                    feesVariants={feesVariants}
                    disabled={controlsDisabled}
                    className="max-h-[45dvh]"
                />

                <LimitsList
                    id={context.record.id}
                    limits={context.record.limits}
                    resource="direction"
                    disabled={controlsDisabled}
                />
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
