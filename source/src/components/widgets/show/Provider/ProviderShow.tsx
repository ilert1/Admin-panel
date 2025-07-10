import { useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { useCallback, useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { ProviderWithId } from "@/data/providers";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { DeleteProviderDialog } from "./DeleteProviderDialog";
import { EditProviderDialog } from "./EditProviderDialog";
import { ProviderMethodsShow } from "./ProviderMethods";
import { useFetchDictionaries } from "@/hooks";

export interface ProviderShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const ProviderShow = ({ id, onOpenChange }: ProviderShowProps) => {
    const context = useAbortableShowController<ProviderWithId>({ resource: "provider", id });
    const data = useFetchDictionaries();
    const translate = useTranslate();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleDeleteClicked = useCallback(() => {
        setDeleteDialogOpen(prev => !prev);
    }, []);

    const handleEditClicked = useCallback(() => {
        setEditDialogOpen(prev => !prev);
    }, []);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center justify-between md:flex-nowrap">
                <TextField text={context.record.name} copyValue className="text-neutral-70 dark:text-neutral-30" />
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-[24px]">
                    <TextField
                        label={translate("resources.provider.fields.pk")}
                        text={context.record.public_key || ""}
                        copyValue
                        lineClamp
                        linesCount={1}
                    />

                    <TextField
                        label={translate("resources.provider.fields.json_schema")}
                        text={
                            context.record.fields_json_schema
                                ? String(context.record.fields_json_schema).length > 30
                                    ? String(context.record.fields_json_schema).substring(0, 30) + "..."
                                    : context.record.fields_json_schema
                                : ""
                        }
                    />

                    <div className="flex flex-col md:col-span-2">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.paymentSettings.financialInstitution.fields.payment_types")}
                        </small>

                        <div className="max-w-auto flex flex-wrap gap-2">
                            {context.record.payment_types && context.record.payment_types?.length > 0 ? (
                                context.record.payment_types.map(pt => {
                                    return <PaymentTypeIcon key={pt.code} type={pt.code} className="h-7 w-7" />;
                                })
                            ) : (
                                <span className="title-1">-</span>
                            )}
                        </div>
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

                <ProviderMethodsShow providerId={id} methods={context.record.methods} isFetching={context.isFetching} />
            </div>

            <DeleteProviderDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />

            <EditProviderDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} />
        </div>
    );
};
