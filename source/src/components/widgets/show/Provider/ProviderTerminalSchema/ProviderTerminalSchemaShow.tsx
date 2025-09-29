import { BaseFieldConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useRefresh, useTranslate } from "react-admin";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { ProvidersDataProvider } from "@/data";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ProviderUpdateParams } from "@/data/providers";
import { ProviderTerminalSchemaForm } from "./ProviderTerminalSchemaForm";
import { ProviderTerminalSchemaTable } from "./ProviderTerminalSchemaTable";

interface IProviderTerminalSchemaShow {
    schemaType: "auth" | "details";
    providerId: string;
    authSchemaFields: BaseFieldConfig[];
    isFetching: boolean;
}

export const ProviderTerminalSchemaShow = ({
    schemaType,
    authSchemaFields,
    providerId,
    isFetching
}: IProviderTerminalSchemaShow) => {
    const providersDataProvider = new ProvidersDataProvider();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [editMethod, setEditMethod] = useState("");
    const [addMethodForm, setAddMethodForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [keyForRemove, setKeyForRemove] = useState("");

    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const handleDeleteClick = (key: string) => {
        setKeyForRemove(key);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setKeyForRemove("");
        setDeleteDialogOpen(false);
    };

    const updateProviderMethods = async (tempAuthSchemaFieldsData: typeof authSchemaFields) =>
        await providersDataProvider.update("provider", {
            id: providerId,
            data: {
                [schemaType === "auth" ? "terminal_auth_schema" : "terminal_details_schema"]: {
                    fields: tempAuthSchemaFieldsData
                }
            },
            previousData:
                schemaType === "auth"
                    ? ({ terminal_details_schema: { fields: tempAuthSchemaFieldsData } } as ProviderUpdateParams)
                    : ({ terminal_details_schema: { fields: tempAuthSchemaFieldsData } } as ProviderUpdateParams)
        });

    const onAddMethod = async (value: BaseFieldConfig) => {
        if (authSchemaFields.length > 0 && authSchemaFields.filter(item => item.key === value.key).length > 0) {
            appToast("error", translate("resources.provider.errors.methodAlreadyExist"));
            return;
        }

        try {
            setButtonDisabled(true);

            await updateProviderMethods([...authSchemaFields, { ...value }]);

            appToast("success", translate("resources.provider.methodAddSuccess"));
            refresh();
            setAddMethodForm(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.toast.error"));
        } finally {
            setButtonDisabled(false);
        }
    };

    const onChangeMethod = async (originalKey: string, value: BaseFieldConfig) => {
        const tempMethodsData = [...authSchemaFields.filter(item => item.key !== originalKey), { ...value }];

        try {
            setButtonDisabled(true);

            await updateProviderMethods(tempMethodsData);

            appToast("success", translate("resources.provider.methodEditSuccess"));
            refresh();
            setEditMethod("");
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.toast.error"));
        } finally {
            setButtonDisabled(false);
        }
    };

    const onRemoveMethod = async (originalKey: string) => {
        const tempMethodsData = authSchemaFields.filter(item => item.key !== originalKey);

        try {
            setButtonDisabled(true);

            await updateProviderMethods(tempMethodsData);

            appToast("success", translate("resources.provider.methodDeleteSuccess"));
            refresh();
            closeDeleteDialog();
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.toast.error"));
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 rounded-8 bg-neutral-0 px-8 py-4 dark:bg-neutral-100">
            <h3 className="text-2xl text-neutral-90 dark:text-neutral-30">
                {schemaType === "auth"
                    ? translate("resources.provider.fields.terminal_auth_schema")
                    : translate("resources.provider.fields.terminal_details_schema")}
            </h3>

            {authSchemaFields.length > 0 ? (
                <Accordion type="multiple">
                    {authSchemaFields.map(schema => (
                        <AccordionItem key={schema.key} value={schema.key}>
                            <AccordionTrigger className="text-neutral-90 dark:text-neutral-0">
                                {schema.key}
                            </AccordionTrigger>

                            <AccordionContent>
                                {editMethod === schema.key ? (
                                    <ProviderTerminalSchemaForm
                                        schemaKey={schema.key}
                                        schemaValue={schema}
                                        disabledProcess={isFetching || buttonDisabled}
                                        onChangeMethod={value => onChangeMethod(schema.key, value)}
                                        onCancel={() => setEditMethod("")}
                                    />
                                ) : (
                                    <ProviderTerminalSchemaTable
                                        disabledProcess={isFetching || buttonDisabled}
                                        disabledEditButton={!!editMethod}
                                        onDeleteClick={() => handleDeleteClick(schema.key)}
                                        onEditClick={() => setEditMethod(schema.key)}
                                        schemaValue={schema}
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <span className="self-center text-lg text-neutral-50">
                    {translate("resources.provider.terminalSchema.notFound")}
                </span>
            )}

            <Button
                disabled={addMethodForm || isFetching || buttonDisabled}
                className="flex items-center gap-1 self-end"
                onClick={() => setAddMethodForm(true)}>
                <CirclePlus className="h-[16px] w-[16px]" />
                <span className="text-title-1">{translate("resources.provider.terminalSchema.addSchema")}</span>
            </Button>

            {addMethodForm && (
                <ProviderTerminalSchemaForm
                    disabledProcess={isFetching || buttonDisabled}
                    onChangeMethod={onAddMethod}
                    onCancel={() => setAddMethodForm(false)}
                />
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="!z-[200] h-auto max-h-56 !w-72 overflow-hidden rounded-16 bg-muted xl:max-h-none">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            {translate("resources.provider.terminalSchema.removeSchemaDialog")}
                        </DialogTitle>
                        <DialogDescription />
                    </DialogHeader>

                    <DialogFooter>
                        <div className="flex w-full justify-around">
                            <Button onClick={() => onRemoveMethod(keyForRemove)}>
                                {translate("app.ui.actions.delete")}
                            </Button>

                            <Button
                                className="bg-neutral-0 dark:bg-neutral-100"
                                variant={"outline"}
                                onClick={closeDeleteDialog}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
