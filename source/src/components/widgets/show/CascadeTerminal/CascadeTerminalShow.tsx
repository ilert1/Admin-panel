import { useLocaleState, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { CascadeTerminalSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Badge } from "@/components/ui/badge";
import { useSheets } from "@/components/providers/SheetProvider";
import { DeleteCascadeTerminalDialog } from "./DeleteCascadeTerminalDialog";
import { useState } from "react";
import { EditCascadeTerminalDialog } from "./EditCascadeTerminalDialog";
import { CountryTextField } from "../../components/CountryTextField";
import { useCountryCodes } from "@/hooks";

export interface CascadeTerminalShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeTerminalShow = ({ id, onOpenChange }: CascadeTerminalShowProps) => {
    const context = useAbortableShowController<CascadeTerminalSchema>({ resource: "cascade_terminals", id });
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { openSheet } = useSheets();
    const { countryCodesWithFlag } = useCountryCodes();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    if (context.isLoading || !context.record) {
        return <Loading />;
    }

    const terminal_dst_country = countryCodesWithFlag.find(
        item => item.alpha2 === context.record?.terminal.dst_country_code
    );

    const isPrioritized = context.record.condition?.extra;

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-col flex-wrap gap-2 md:flex-nowrap">
                <div className="flex gap-2">
                    <div className="flex flex-wrap gap-2">
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
                {isPrioritized && (
                    <Badge variant={"prioritized"} className="self-start">
                        {translate("resources.direction.fields.condition.prioritized")}
                    </Badge>
                )}
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-start">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascadeTerminals.fields.cascade")}
                        </small>

                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("cascade", {
                                    id: context.record.cascade.id
                                });
                            }}>
                            {context.record.cascade.name}
                        </Button>

                        <TextField
                            className="text-neutral-70"
                            text={context.record.cascade.id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascadeTerminals.fields.terminal")}
                        </small>

                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("terminal", {
                                    id: context.record.terminal.terminal_id
                                });
                            }}>
                            {context.record.terminal.verbose_name}
                        </Button>

                        <TextField
                            className="text-neutral-70"
                            text={context.record.terminal.terminal_id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascadeTerminals.fields.provider")}
                        </small>

                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                if (context.record.terminal.provider.id) {
                                    openSheet("terminal", {
                                        id: context.record.terminal.provider.id
                                    });
                                }
                            }}>
                            {context.record.terminal.provider.name}
                        </Button>
                    </div>
                    <CountryTextField
                        text={terminal_dst_country?.name || ""}
                        label={translate("resources.direction.destinationCountry")}
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascadeTerminals.fields.src_currency")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge variant="currency">{context.record.terminal.src_currency?.code}</Badge>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascadeTerminals.fields.dst_currency")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge variant="currency">{context.record.terminal.dst_currency?.code}</Badge>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.cascadeSettings.cascadeTerminals.fields.weight")}
                        text={context.record.condition?.weight?.toString() ?? ""}
                    />

                    <TextField
                        label={translate("resources.cascadeSettings.cascadeTerminals.fields.rank")}
                        text={context.record.condition?.rank?.toString() ?? ""}
                    />

                    <TextField
                        label={translate("resources.cascadeSettings.cascadeTerminals.fields.ttl_minmax")}
                        text={
                            (context.record.condition?.ttl?.min?.toString() ?? "-") +
                            " / " +
                            (context.record.condition?.ttl?.max?.toString() ?? "-")
                        }
                    />
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col">
                            <small className="mb-0.5 text-sm text-neutral-60">
                                {translate("resources.cascadeSettings.cascadeTerminals.fields.created_at")}
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
                                {translate("resources.cascadeSettings.cascadeTerminals.fields.updated_at")}
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
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button className="" onClick={() => setEditDialogOpen(true)}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="" onClick={() => setDeleteDialogOpen(true)} variant={"outline_gray"}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>
            </div>

            <DeleteCascadeTerminalDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
                termName={context.record.terminal.verbose_name}
                cascadeName={context.record.cascade.name}
            />

            <EditCascadeTerminalDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} />
        </div>
    );
};
