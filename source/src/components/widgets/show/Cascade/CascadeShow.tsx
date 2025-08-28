import { useLocaleState, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Badge } from "@/components/ui/badge";
import { useFetchDictionaries } from "@/hooks";
import { DeleteCascadeDialog } from "./DeleteCascadeDialog";
import { useState } from "react";
import { EditCascadeDialog } from "./EditCascadeDialog";

export interface DirectionsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeShow = ({ id, onOpenChange }: DirectionsShowProps) => {
    const context = useAbortableShowController<CascadeSchema>({ resource: "cascades", id });
    const data = useFetchDictionaries();
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center justify-between md:flex-nowrap">
                <TextField text={context.record.name} copyValue className="text-neutral-70 dark:text-neutral-30" />

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

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.created_at")}
                        </small>

                        <div>
                            <p className="text-nowrap">
                                {new Date(context.record.created_at).toLocaleDateString(locale)}
                            </p>
                            <p className="text-nowrap text-neutral-70">
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
                            <p className="text-nowrap text-neutral-70">
                                {new Date(context.record.updated_at).toLocaleTimeString(locale)}
                            </p>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.id")}
                        text={context.record.id}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.type")}
                        text={context.record.type ?? ""}
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.src_currency_code")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge variant="currency">{context.record.src_currency_code}</Badge>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.cascade_kind")}
                        text={context.record.cascade_kind ?? ""}
                    />

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.rank")}
                        text={context.record.priority_policy.rank.toString()}
                    />

                    <TextField
                        className="grid-cols-1 md:grid-cols-2"
                        label={translate("resources.cascadeSettings.cascades.fields.description")}
                        text={context.record.description ?? ""}
                    />
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button className="" onClick={() => {}}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="" onClick={() => {}} variant={"outline_gray"}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>
            </div>

            <DeleteCascadeDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />

            <EditCascadeDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} />
        </div>
    );
};
