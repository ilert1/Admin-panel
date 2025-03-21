import { useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { useCallback, useEffect, useState } from "react";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { FeesResource } from "@/data";
import { DeleteDirectionDialog } from "./DeleteDirectionDialog";
import { EditDirectionDialog } from "./EditDirectionDialog";
import { EditAuthData } from "./EditAuthData";
import { Fees } from "../../components/Fees";
import { Direction, MerchantFees } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { LimitsList } from "../../components/Limits/ui/LimitsList";
import { useSheets } from "@/components/providers/SheetProvider";

export interface DirectionsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const DirectionsShow = ({ id, onOpenChange }: DirectionsShowProps) => {
    const context = useShowController<Direction>({ resource: "direction", id });
    const data = fetchDictionaries();
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [changeAuthDataClicked, setChangeAuthDataClicked] = useState(false);

    const [fees, setFees] = useState<MerchantFees>();

    const handleDeleteClicked = useCallback(() => {
        setDeleteDialogOpen(prev => !prev);
    }, []);

    const handleEditClicked = useCallback(() => {
        setEditDialogOpen(prev => !prev);
    }, []);

    const handleChangeAuthDataClicked = useCallback(() => {
        setChangeAuthDataClicked(prev => !prev);
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
            <div className="flex flex-row flex-wrap md:flex-nowrap items-center justify-between">
                <TextField text={context.record.id} copyValue className="text-neutral-70 dark:text-neutral-30" />

                <div className="flex justify-center items-center self-start sm:self-center mt-2 sm:mt-0 text-white">
                    {context.record.state === "active" ? (
                        <span className="bg-green-50 px-3 py-0.5 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                            {translate("resources.direction.fields.stateActive")}
                        </span>
                    ) : (
                        <span className="bg-red-50 px-3 py-0.5 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                            {translate("resources.direction.fields.stateInactive")}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 md:gap-[24px] pt-2 md:pt-[24px]">
                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-2 md:gap-[24px] md:ml-[32px]">
                        <TextField label={translate("resources.direction.fields.name")} text={context.record.name} />

                        <TextField
                            label={translate("resources.direction.fields.srcCurr")}
                            text={context.record.src_currency.code}
                        />

                        <TextField
                            label={translate("resources.direction.fields.destCurr")}
                            text={context.record.dst_currency.code}
                        />

                        {context.record.terminal?.verbose_name ? (
                            <TextField
                                label={translate("resources.direction.fields.terminal")}
                                className="!text-green-50 dark:!text-green-40 hover:!text-green-40 dark:hover:!text-green-50 !cursor-pointer transition-all duration-300"
                                text={context.record.terminal?.verbose_name || ""}
                                onClick={() => {
                                    openSheet("terminal", {
                                        id: context.record?.terminal?.terminal_id,
                                        provider: context.record?.terminal?.provider
                                    });
                                }}
                            />
                        ) : (
                            <TextField label={translate("resources.direction.fields.terminal")} text="" />
                        )}
                    </div>

                    <div className="flex flex-col gap-2 md:gap-[24px] ml-2 md:ml-[32px]">
                        <TextField
                            label={translate("resources.direction.merchant")}
                            text={context.record.merchant.name}
                        />

                        <TextField
                            label={translate("resources.direction.provider")}
                            text={context.record.provider.name}
                        />

                        <TextField
                            label={translate("resources.direction.authInfo")}
                            text={JSON.stringify(context.record.auth_data)}
                            copyValue={JSON.stringify(context.record.auth_data).length === 0 ? false : true}
                        />

                        <TextField
                            label={translate("resources.direction.types.type")}
                            text={context.record.type ?? ""}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button className="" onClick={handleEditClicked}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="dark:bg-muted" variant={"outline"} onClick={handleChangeAuthDataClicked}>
                        {translate("app.ui.actions.changeSecretKey")}
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

            <EditAuthData open={changeAuthDataClicked} onOpenChange={setChangeAuthDataClicked} id={id} />
        </div>
    );
};
