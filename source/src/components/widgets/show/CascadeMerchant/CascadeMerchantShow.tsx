import { useLocaleState, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Badge } from "@/components/ui/badge";
import { useFetchDictionaries } from "@/hooks";
import { useState } from "react";

export interface CascadeMerchantShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeMerchantShow = ({ id, onOpenChange }: CascadeMerchantShowProps) => {
    const context = useAbortableShowController<MerchantCascadeSchema>({ resource: "cascade_merchants", id });
    const data = useFetchDictionaries();
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const cascadeMerchantData = context.record ?? {
        merchant: {
            id: "1",
            name: "Merchant",
            description: "descr"
        },
        cascade: {
            id: "1",
            name: "Cascade",
            description: "descr",
            type: "deposit",
            src_currency_code: "USD",
            cascade_kind: "sequential",
            state: "active",
            priority_policy: { rank: 1 },
            created_at: Date.now().toString(),
            updated_at: Date.now().toString()
        },
        state: "active",
        created_at: Date.now().toString(),
        updated_at: Date.now().toString(),
        id: "1",
        cascade_id: "1",
        merchant_id: "1"
    };

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center justify-between md:flex-nowrap">
                <TextField
                    text={cascadeMerchantData.cascade.name}
                    copyValue
                    className="text-neutral-70 dark:text-neutral-30"
                />

                <div className="mt-2 flex items-center justify-center self-start text-white sm:mt-0 sm:self-center">
                    {cascadeMerchantData.state === "active" && (
                        <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.active")}
                        </span>
                    )}
                    {cascadeMerchantData.state === "inactive" && (
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
                                {new Date(cascadeMerchantData.created_at).toLocaleDateString(locale)}
                            </p>
                            <p className="text-nowrap text-neutral-70">
                                {new Date(cascadeMerchantData.created_at).toLocaleTimeString(locale)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.updated_at")}
                        </small>

                        <div>
                            <p className="text-nowrap">
                                {new Date(cascadeMerchantData.updated_at).toLocaleDateString(locale)}
                            </p>
                            <p className="text-nowrap text-neutral-70">
                                {new Date(cascadeMerchantData.updated_at).toLocaleTimeString(locale)}
                            </p>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.id")}
                        text={cascadeMerchantData.id}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.type")}
                        text={cascadeMerchantData.type ?? ""}
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.cascadeSettings.cascades.fields.src_currency_code")}
                        </small>

                        <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                            <Badge variant="currency">{cascadeMerchantData.src_currency_code}</Badge>
                        </div>
                    </div>

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.cascade_kind")}
                        text={cascadeMerchantData.cascade_kind ?? ""}
                    />

                    <TextField
                        label={translate("resources.cascadeSettings.cascades.fields.rank")}
                        text={cascadeMerchantData.priority_policy.rank.toString()}
                    />

                    <TextField
                        className="grid-cols-1 md:grid-cols-2"
                        label={translate("resources.cascadeSettings.cascades.fields.description")}
                        text={cascadeMerchantData.description ?? ""}
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

            {/* <DeleteCascadeDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />

            <EditCascadeDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} /> */}
        </div>
    );
};
