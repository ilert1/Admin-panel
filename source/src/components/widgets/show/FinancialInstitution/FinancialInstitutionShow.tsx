import { useLocaleState, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { TextField } from "@/components/ui/text-field";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Button } from "@/components/ui/Button";
import { useCallback, useState } from "react";
import { DeleteFinancialInstitutionDialog } from "./DeleteFinancialInstitutionDialog";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { EditFinancialInstitutionDialog } from "./EditFinancialInstitutionDialog";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";
import { FinancialInstitutionWithId } from "@/data/financialInstitution";
import { Badge } from "@/components/ui/badge";

export interface FinancialInstitutionShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const FinancialInstitutionShow = ({ id, onOpenChange }: FinancialInstitutionShowProps) => {
    const context = useAbortableShowController<FinancialInstitutionWithId>({ resource: "financialInstitution", id });
    const data = fetchDictionaries();
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const { isLoading: financialInstitutionTypesLoading, data: financialInstitutionTypes } =
        useFetchFinancialInstitutionTypes();

    const handleDeleteClicked = useCallback(() => {
        setDeleteDialogOpen(prev => !prev);
    }, []);

    const handleEditClicked = useCallback(() => {
        setEditDialogOpen(prev => !prev);
    }, []);

    if (context.isLoading || !context.record || !data || financialInstitutionTypesLoading) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center justify-between md:flex-nowrap">
                <TextField text={context.record.name} copyValue className="text-neutral-70 dark:text-neutral-30" />
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-[24px]">
                    <div className="flex flex-col">
                        <small className="mb-1 text-sm text-neutral-60">
                            {translate("resources.paymentSettings.financialInstitution.fields.created_at")}
                        </small>
                        <p className="text-nowrap text-base leading-[18px]">
                            {new Date(context.record.created_at).toLocaleDateString(locale)}
                        </p>
                        <p className="text-nowrap text-base leading-[18px]">
                            {new Date(context.record.created_at).toLocaleTimeString(locale)}
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <small className="mb-1 text-sm text-neutral-60">
                            {translate("resources.paymentSettings.financialInstitution.fields.updated_at")}
                        </small>
                        <p className="text-nowrap text-base leading-[18px]">
                            {new Date(context.record.updated_at).toLocaleDateString(locale)}
                        </p>
                        <p className="text-nowrap text-base leading-[18px]">
                            {new Date(context.record.updated_at).toLocaleTimeString(locale)}
                        </p>
                    </div>

                    <TextField
                        label={translate("resources.paymentSettings.financialInstitution.fields.code")}
                        text={context.record.code || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentSettings.financialInstitution.fields.legal_name")}
                        text={context.record.legal_name || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentSettings.financialInstitution.fields.nspk_member_id")}
                        text={context.record.nspk_member_id || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentSettings.financialInstitution.fields.institution_type")}
                        text={
                            context.record.institution_type
                                ? financialInstitutionTypes?.find(
                                      type => type.value === context.record.institution_type
                                  )?.label || ""
                                : ""
                        }
                    />

                    <div className="flex flex-col">
                        <small className="mb-1 text-sm text-neutral-60">
                            {translate("resources.paymentSettings.financialInstitution.fields.payment_types")}
                        </small>

                        <div className="max-w-auto flex flex-wrap gap-2">
                            {context.record.payment_types && context.record.payment_types?.length > 0 ? (
                                context.record.payment_types.map(pt => (
                                    <PaymentTypeIcon
                                        className="h-7 w-7"
                                        key={pt.code}
                                        type={pt.code}
                                        metaIcon={pt.meta?.["icon"] as string}
                                        tooltip
                                    />
                                ))
                            ) : (
                                <span className="title-1">-</span>
                            )}
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.paymentSettings.financialInstitution.fields.country_code")}
                        text={context.record.country_code}
                    />

                    <div className="flex flex-col md:col-span-2">
                        <small className="mb-1 text-sm text-neutral-60">
                            {translate("resources.paymentSettings.financialInstitution.fields.currencies")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            {context.record.currencies && context.record.currencies.length > 0 ? (
                                context.record.currencies.map(value => (
                                    <Badge
                                        key={value.code}
                                        className="cursor-default border border-neutral-50 bg-transparent font-normal hover:bg-transparent">
                                        <span className="max-w-28 overflow-hidden text-ellipsis break-words">
                                            {value.code}
                                        </span>
                                    </Badge>
                                ))
                            ) : (
                                <span className="title-1">-</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <small className="text-sm text-neutral-60">
                        {translate("resources.paymentSettings.financialInstitution.fields.meta")}
                    </small>

                    <MonacoEditor disabled code={JSON.stringify(context.record.meta || "{}", null, 2)} />
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button className="" onClick={handleEditClicked}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="" onClick={handleDeleteClicked} variant={"outline_gray"}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>
            </div>

            <EditFinancialInstitutionDialog id={id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

            <DeleteFinancialInstitutionDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />
        </div>
    );
};
