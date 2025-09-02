import { useLocaleState, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useState } from "react";
import { useSheets } from "@/components/providers/SheetProvider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EditCascadeMerchantDialog } from "./EditCascadeMerchantDialog";
import { DeleteCascadeMerchantDialog } from "./DeleteCascadeMerchantDialog";

export interface CascadeMerchantShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeMerchantShow = ({ id, onOpenChange }: CascadeMerchantShowProps) => {
    const context = useAbortableShowController<MerchantCascadeSchema>({
        resource: "cascadeSettings/cascadeMerchants",
        id
    });
    const { openSheet } = useSheets();
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const cascadeMerchantData = context.record;

    if (context.isLoading || !context.record) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center justify-between md:flex-nowrap">
                <TextField
                    text={cascadeMerchantData?.cascade.name ?? ""}
                    copyValue
                    className="text-neutral-70 dark:text-neutral-30"
                />

                <div className="mt-2 flex items-center justify-center self-start text-white sm:mt-0 sm:self-center">
                    {cascadeMerchantData?.state === "active" && (
                        <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.active")}
                        </span>
                    )}
                    {cascadeMerchantData?.state === "inactive" && (
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
                                {new Date(cascadeMerchantData?.created_at ?? "").toLocaleDateString(locale)}
                            </p>
                            <p className="text-nowrap text-neutral-70">
                                {new Date(cascadeMerchantData?.created_at ?? "").toLocaleTimeString(locale)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.updated_at")}
                        </small>

                        <div>
                            <p className="text-nowrap">
                                {new Date(cascadeMerchantData?.updated_at ?? "").toLocaleDateString(locale)}
                            </p>
                            <p className="text-nowrap text-neutral-70">
                                {new Date(cascadeMerchantData?.updated_at ?? "").toLocaleTimeString(locale)}
                            </p>
                        </div>
                    </div>
                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.id")}
                        text={cascadeMerchantData?.id ?? ""}
                        wrap
                        copyValue
                    />
                    <div>
                        <TextField
                            label={translate("resources.cascadeSettings.cascadeMerchants.fields.merchant")}
                            text={cascadeMerchantData?.merchant.name ?? ""}
                            onClick={
                                cascadeMerchantData?.merchant_id
                                    ? () =>
                                          openSheet("merchant", {
                                              id: cascadeMerchantData?.merchant.id ?? "",
                                              merchantName: cascadeMerchantData?.merchant.name ?? ""
                                          })
                                    : undefined
                            }
                        />
                        <TextField
                            className="text-neutral-70"
                            text={cascadeMerchantData?.merchant.id ?? ""}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>
                    <div>
                        <Label className="mb-0 dark:!text-neutral-60">
                            {translate("resources.cascadeSettings.cascadeMerchants.fields.cascade")}
                        </Label>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("cascade", {
                                    id: cascadeMerchantData?.cascade_id ?? ""
                                });
                            }}>
                            {cascadeMerchantData?.cascade.name ?? ""}
                        </Button>
                        <TextField
                            className="text-neutral-70"
                            text={cascadeMerchantData?.cascade.id ?? ""}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>
                    <TextField
                        label={translate("resources.cascadeSettings.cascadeMerchants.fields.type")}
                        text={cascadeMerchantData?.cascade.type ?? ""}
                        wrap
                        copyValue
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascadeMerchants.fields.src_currency")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge key={cascadeMerchantData?.cascade.src_currency.code ?? ""} variant="currency">
                                {cascadeMerchantData?.cascade.src_currency.code ?? ""}
                            </Badge>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.cascadeSettings.cascadeMerchants.fields.cascade_state")}
                        text={translate("resources.cascadeSettings.cascades.state." + cascadeMerchantData?.state)}
                    />

                    <TextField
                        label={translate("resources.cascadeSettings.cascadeMerchants.fields.state")}
                        text={translate(
                            "resources.cascadeSettings.cascades.state." + cascadeMerchantData?.cascade.state
                        )}
                    />
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button
                        className=""
                        onClick={() => {
                            setEditDialogOpen(true);
                        }}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button
                        className=""
                        onClick={() => {
                            setDeleteDialogOpen(true);
                        }}
                        variant={"outline_gray"}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>
            </div>

            <DeleteCascadeMerchantDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />
            <EditCascadeMerchantDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} />
        </div>
    );
};
