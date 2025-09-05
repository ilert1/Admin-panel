import { useLocaleState, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Badge } from "@/components/ui/badge";
import { DeleteCascadeDialog } from "./DeleteCascadeDialog";
import { useState } from "react";
import { EditCascadeDialog } from "./EditCascadeDialog";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import clsx from "clsx";
import { useGetCascadeShowColumns } from "./Columns";
import { CirclePlus } from "lucide-react";
import { CreateCascadeTerminalsDialog } from "../../lists/CascadeTerminals/CreateCascadeTerminalsDialog";

export interface CascadeShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeShow = ({ id, onOpenChange }: CascadeShowProps) => {
    const context = useAbortableShowController<CascadeSchema>({ resource: "cascades", id });
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createCascadeTerminalDialogOpen, setCreateCascadeTerminalDialogOpen] = useState(false);

    const { cascadeTerminalColumns } = useGetCascadeShowColumns();

    if (context.isLoading || !context.record) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap items-center gap-5 md:flex-nowrap">
                    {/* <TextField text={context.record.name} copyValue className="text-neutral-70 dark:text-neutral-30" /> */}
                    <div className="">
                        <span className="text-title-2 text-neutral-90 dark:text-neutral-0">{context.record.name}</span>
                        <TextField
                            text={context.record.id}
                            copyValue
                            className="text-neutral-70 dark:text-neutral-30"
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-center self-start text-white sm:mt-0 sm:self-center">
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
                        label={translate("resources.cascadeSettings.cascades.fields.cascade_kind")}
                        text={
                            context.record.cascade_kind
                                ? translate(`resources.cascadeSettings.cascades.kinds.${context.record.cascade_kind}`)
                                : ""
                        }
                    />
                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.src_currency_code")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge variant="currency">{context.record.src_currency?.code}</Badge>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.type")}
                        text={
                            context.record.type
                                ? translate(`resources.cascadeSettings.cascades.types.${context.record.type}`)
                                : ""
                        }
                    />

                    <TextField
                        text={context.record?.dst_country_code ?? ""}
                        label={translate("resources.direction.destinationCountry")}
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.payment_types")}
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

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.rank")}
                        text={context.record.priority_policy.rank.toString()}
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.created_at")}
                        </small>

                        <div>
                            <p className="text-nowrap">
                                {new Date(context.record.created_at).toLocaleDateString(locale)}
                            </p>
                            <p className="text-nowrap">
                                {new Date(context.record.created_at).toLocaleTimeString(locale)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.updated_at")}
                        </small>

                        <div>
                            <p className="text-nowrap">
                                {new Date(context.record.updated_at).toLocaleDateString(locale)}
                            </p>
                            <p className="text-nowrap">
                                {new Date(context.record.updated_at).toLocaleTimeString(locale)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <small className="text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.details")}
                        </small>

                        <MonacoEditor disabled code={JSON.stringify(context.record.details || "{}", null, 2)} />
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button
                        onClick={() => setCreateCascadeTerminalDialogOpen(true)}
                        variant="default"
                        className="flex gap-[4px]">
                        <CirclePlus className="h-[16px] w-[16px]" />

                        <span className="text-title-1">
                            {translate("resources.cascadeSettings.cascadeTerminals.createNew")}
                        </span>
                    </Button>

                    <Button className="" onClick={() => setEditDialogOpen(true)}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="" onClick={() => setDeleteDialogOpen(true)} variant={"outline_gray"}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <span>{translate("resources.cascadeSettings.cascades.linkedTerminals")}</span>

                    <SimpleTable
                        columns={cascadeTerminalColumns}
                        data={context.record.cascade_terminals || []}
                        tableType={TableTypes.COLORED}
                        className={clsx(
                            "flex-shrink-1 h-auto",
                            !context.record.cascade_terminals && "min-h-24",
                            context.record.cascade_terminals &&
                                context.record.cascade_terminals.length > 1 &&
                                "max-h-96"
                        )}
                    />
                </div>
            </div>

            <DeleteCascadeDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />

            <EditCascadeDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} />

            <CreateCascadeTerminalsDialog
                open={createCascadeTerminalDialogOpen}
                onOpenChange={setCreateCascadeTerminalDialogOpen}
            />
        </div>
    );
};
