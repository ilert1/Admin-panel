import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TextField } from "@/components/ui/text-field";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useState } from "react";
import { useLocale, useTranslate } from "react-admin";
import { DeleteSystemPaymentInstrumentDialog } from "../../lists/SystemPaymentInstruments/DeleteSystemPaymentInstrumentDialog";
import { EditPaymentInstrumentDialog } from "./EditSystemPaymentInstrumentDialog";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { SystemPaymentInstrumentWithId } from "@/data/systemPaymentInstruments";
import { Badge } from "@/components/ui/badge";

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
    const { openSheet } = useSheets();
    const context = useAbortableShowController<SystemPaymentInstrumentWithId>({
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
                        <TextField text={context.record.code} copyValue fontSize="title-2" />
                    </div>
                    {context.record.description && (
                        <div className="flex items-center justify-between px-4 md:px-[42px]">
                            <TextField
                                fontSize="title-2"
                                label={translate(
                                    "resources.paymentSettings.systemPaymentInstruments.fields.description"
                                )}
                                text={context.record.description ?? ""}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-y-2 px-4 md:px-[42px]">
                        <div>
                            <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                                {translate("resources.paymentSettings.systemPaymentInstruments.list.paymentType")}
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                <PaymentTypeIcon type={context.record.payment_type_code} />
                            </div>
                        </div>

                        <TextField
                            fontSize="title-2"
                            label={translate(
                                "resources.paymentSettings.systemPaymentInstruments.list.financialInstitution"
                            )}
                            text={context.record.financial_institution.name}
                            onClick={() => {
                                openSheet("financialInstitution", { id: context.record.financial_institution_code });
                            }}
                            copyValue
                        />

                        <div className="flex flex-col">
                            <small className="mb-0.5 text-sm text-neutral-60">
                                {translate("resources.paymentSettings.systemPaymentInstruments.fields.currency_code")}
                            </small>

                            <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                                <Badge key={context.record.currency.code} variant="currency">
                                    {context.record.currency.code}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div>
                                <TextField
                                    fontSize="title-2"
                                    label={translate(
                                        "resources.paymentSettings.systemPaymentInstruments.list.createdAt"
                                    )}
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
                                    label={translate(
                                        "resources.paymentSettings.systemPaymentInstruments.list.updatedAt"
                                    )}
                                    text={new Date(context.record.updated_at).toLocaleDateString(locale) || ""}
                                />
                                <TextField
                                    fontSize="title-2"
                                    text={new Date(context.record.updated_at).toLocaleTimeString(locale) || ""}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 flex flex-col">
                            <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                                {translate("resources.paymentSettings.systemPaymentInstruments.fields.meta")}
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
                onOpenChange={state => {
                    setDeleteDialogOpen(state);
                    onOpenChange(state);
                }}
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
