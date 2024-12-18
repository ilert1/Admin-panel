import { useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { useCallback, useEffect, useRef, useState } from "react";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { FeeCard } from "../../components/FeeCard";
import { AddFeeCard } from "../../components/AddFeeCard";
import { FeesResource } from "@/data";
import { CircleChevronRight } from "lucide-react";
import { DeleteDirectionDialog } from "./DeleteDirectionDialog";
import { EditDirectionDialog } from "./EditDirectionDialog";
import { EditAuthData } from "./EditAuthData";

export interface DirectionsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const DirectionsShow = ({ id, onOpenChange }: DirectionsShowProps) => {
    const context = useShowController<Directions.Direction>({ id });
    const data = fetchDictionaries();
    const translate = useTranslate();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [changeAuthDataClicked, setChangeAuthDataClicked] = useState(false);
    const [addNewFeeClicked, setAddNewFeeClicked] = useState(false);

    const [fees, setFees] = useState<Directions.Fees>();

    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (messagesEndRef.current) {
            if (addNewFeeClicked) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [addNewFeeClicked]);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    const feesVariants = [context.record.src_currency.code];
    !(context.record.dst_currency.code === context.record.src_currency.code) &&
        feesVariants.push(context.record.dst_currency.code);

    return (
        <div className="px-[42px] ">
            <div className="flex flex-col sm:flex-row justify-between">
                <TextField text={context.record.id} copyValue />

                <div className="flex self-start mt-2 sm:mt-0 sm:self-center items-center justify-center text-white">
                    {context.record.active ? (
                        <span className="px-3 py-0.5 bg-green-50 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                            {translate("resources.direction.fields.stateActive")}
                        </span>
                    ) : (
                        <span className="px-3 py-0.5 bg-red-50 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                            {translate("resources.direction.fields.stateInactive")}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-[24px] pt-[24px]">
                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-[24px] ml-[32px]">
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
                            text={context.record.terminal?.verbose_name || ""}
                        />
                    </div>

                    <div className="flex flex-col gap-[24px] ml-[32px]">
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
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-[16px]">
                    <Button className="" onClick={handleEditClicked}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="bg-muted" variant={"outline"} onClick={handleChangeAuthDataClicked}>
                        {translate("app.ui.actions.changeSecretKey")}
                    </Button>

                    <Button className="" onClick={handleDeleteClicked}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>

                <div className="flex flex-col bg-neutral-0 px-[32px] rounded-[8px] w-full mx-[10px] mt-[10px]">
                    <h3 className="text-display-3 mt-[16px] mb-[16px]">{translate("resources.direction.fees.fees")}</h3>

                    <div className="max-h-[40vh] overflow-auto pr-[10px]">
                        {fees && Object.keys(fees).length !== 0
                            ? Object.keys(fees).map(key => {
                                  const fee = fees[key];
                                  return (
                                      <FeeCard
                                          key={fee.id}
                                          account={fee.id}
                                          currency={fee.currency}
                                          feeAmount={fee.value.quantity / fee.value.accuracy}
                                          feeType={data.feeTypes[fee.type]?.type_descr || ""}
                                          id={id}
                                          resource={FeesResource.DIRECTION}
                                          description={fee.description}
                                      />
                                  );
                              })
                            : ""}

                        {addNewFeeClicked && (
                            <AddFeeCard
                                id={id}
                                onOpenChange={setAddNewFeeClicked}
                                resource={FeesResource.DIRECTION}
                                variants={feesVariants}
                            />
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => setAddNewFeeClicked(true)} className="my-6 w-full sm:w-1/4 flex gap-[4px]">
                        <CircleChevronRight className="w-[16px] h-[16px]" />
                        {translate("resources.direction.fees.addFee")}
                    </Button>
                </div>
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
