import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { FeeCard } from "@/components/widgets/components/FeeCard";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { CircleChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ShowControllerResult, useTranslate } from "react-admin";
import { DeleteDirectionDialog, EditDirectionDialog } from "./Forms";
import { EditAuthData } from "./Forms/EditAuthData";
import { FeesResource } from "@/data";
import { AddFeeCard } from "@/components/widgets/components/AddFeeCard";
import { LoadingAlertDialog } from "@/components/ui/loading";

interface QuickShowProps {
    context: ShowControllerResult<Directions.Direction>;
    onOpenChange: (state: boolean) => void;
    id: string;
}
export const QuickShowDirections = (props: QuickShowProps) => {
    const { context, id, onOpenChange } = props;

    const data = fetchDictionaries();
    const translate = useTranslate();

    const [createNew, setCreateNew] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [changeAuthDataClicked, setChangeAuthDataClicked] = useState(false);
    const [addNewFeeClicked, setAddNewFeeClicked] = useState(false);

    const [fees, setFees] = useState<Directions.Fees>();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleCreateClicked = () => {
        if (createNew) {
            // TODO блокировать создание нового пока старый открыт
        }
        setCreateNew(true);
    };

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

    if (!context.record || !data) return <LoadingAlertDialog />;
    return (
        <div className="px-[42px] ">
            <div className="flex justify-between">
                <TextField text={context.record.id} copyValue />
                <div className="flex items-center justify-center text-white">
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
                <div className="flex justify-end gap-[16px]">
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
                                          feeAmount={fee.value.quantity}
                                          feeType={data.feeTypes[fee.type]?.type_descr || ""}
                                          id={id}
                                          resource={FeesResource.DIRECTION}
                                      />
                                  );
                              })
                            : ""}
                        {addNewFeeClicked && (
                            <AddFeeCard id={id} onOpenChange={setAddNewFeeClicked} resource={FeesResource.DIRECTION} />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => setAddNewFeeClicked(true)} className="my-6 w-1/4 flex gap-[4px]">
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
