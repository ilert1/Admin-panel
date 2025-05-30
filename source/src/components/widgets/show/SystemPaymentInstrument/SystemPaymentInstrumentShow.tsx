import { SystemPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TextField } from "@/components/ui/text-field";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocale, useTranslate } from "react-admin";
import { DeleteSystemPaymentInstrumentDialog } from "../../lists/SystemPaymentInstruments/DeleteSystemPaymentInstrumentDialog";
import { EditPaymentInstrumentDialog } from "./EditSystemPaymentInstrumentDialog";

interface SystemPaymentInstrumentShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const SystemPaymentInstrumentShow = (props: SystemPaymentInstrumentShowProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, onOpenChange } = props;
    const translate = useTranslate();
    const locale = useLocale();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const context = useAbortableShowController<SystemPaymentInstrument>({
        resource: "systemPaymentInstruments",
        id
    });

    const handleEditClicked = () => {
        setEditDialogOpen(true);
    };

    const handleDeleteClicked = () => {
        setDeleteDialogOpen(true);
    };

    if (context.isLoading || !context.record) {
        return <Loading />;
    }

    const code = JSON.stringify(context.record.meta, null, "\t");

    return (
        <>
            <div className="flex h-full min-h-[300px] flex-col overflow-auto pt-0">
                <div className="flex flex-col gap-1 md:gap-4">
                    <div className="flex items-center justify-between px-4 md:px-[42px]">
                        <TextField text={context.record.name} copyValue fontSize="title-2" />
                        <Badge
                            className={cn("rounded-[20px] px-[12px] py-[6px] !text-title-2 text-white", {
                                "bg-green-50 hover:bg-green-50": context.record.status === "active",
                                "bg-red-50 hover:bg-red-50": context.record.status === "inactive",
                                "bg-extra-2 hover:bg-extra-2": context.record.status === "test_only"
                            })}
                            variant="default">
                            {translate(
                                `resources.paymentTools.systemPaymentInstruments.statuses.${context.record.status}`
                            )}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 px-4 md:px-[42px]">
                        <div>
                            <TextField
                                fontSize="title-2"
                                label={translate("resources.paymentTools.systemPaymentInstruments.list.createdAt")}
                                text={new Date(context.record.created_at).toLocaleDateString(locale) || ""}
                            />
                            <TextField
                                fontSize="title-2"
                                text={new Date(context.record.created_at).toLocaleTimeString(locale) || ""}
                            />
                        </div>
                        <div>
                            <TextField
                                fontSize="title-2"
                                label={translate("resources.paymentTools.systemPaymentInstruments.list.updatedAt")}
                                text={new Date(context.record.updated_at).toLocaleDateString(locale) || ""}
                            />
                            <TextField
                                fontSize="title-2"
                                text={new Date(context.record.updated_at).toLocaleTimeString(locale) || ""}
                            />
                        </div>
                        <TextField
                            fontSize="title-2"
                            label={translate("resources.paymentTools.systemPaymentInstruments.list.id")}
                            text={context.record.id}
                            copyValue
                        />
                        <TextField
                            fontSize="title-2"
                            label={translate("resources.paymentTools.systemPaymentInstruments.list.paymentType")}
                            text={context.record.payment_type_code}
                            copyValue
                        />
                        <TextField
                            fontSize="title-2"
                            label={translate(
                                "resources.paymentTools.systemPaymentInstruments.list.financialInstitution"
                            )}
                            text={context.record.financial_institution.name}
                            onClick={() => {}}
                            copyValue
                        />
                        <TextField
                            fontSize="title-2"
                            label={translate("resources.paymentTools.systemPaymentInstruments.list.direction")}
                            text={context.record.direction}
                        />
                        <TextField
                            fontSize="title-2"
                            label={translate("resources.paymentTools.systemPaymentInstruments.fields.description")}
                            text={context.record.description ?? ""}
                        />
                        <div className="col-span-2 flex flex-col">
                            <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                                {translate("resources.paymentTools.systemPaymentInstruments.fields.meta")}
                            </Label>
                            <div className="flex h-full">
                                <MonacoEditor
                                    disabled
                                    height="h-48"
                                    width="100%"
                                    onMountEditor={() => {}}
                                    onErrorsChange={() => {}}
                                    onValidChange={() => {}}
                                    code={code ?? ""}
                                    setCode={() => {}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="self-end px-[42px]">
                        <div className="flex gap-2">
                            <Button className="" onClick={handleEditClicked}>
                                {translate("app.ui.actions.edit")}
                            </Button>
                            <Button className="" variant={"outline_gray"} onClick={handleDeleteClicked}>
                                {translate("app.ui.actions.delete")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteSystemPaymentInstrumentDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                deleteId={context.record?.id}
            />
            <EditPaymentInstrumentDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                id={context.record?.id}
            />
        </>
    );
};
