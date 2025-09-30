import {
    ExecutionMethodInput,
    ExecutionMethodOutput,
    ProviderBaseMethods,
    ProviderUpdateMethodsAnyOf
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useRefresh, useTranslate } from "react-admin";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProviderMethodsTable } from "./ProviderMethodsTable";
import { Button } from "@/components/ui/Button";
import { CirclePlus, Copy, EyeIcon } from "lucide-react";
import { useState } from "react";
import { ProviderMethodsForm } from "./ProviderMethodsForm";
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
import { useCopy } from "@/hooks/useCopy";
import { ProviderSettingsJsonShowDialog } from "../ProviderSettingsJsonShowDialog";

interface IProviderMethodsShow {
    providerId: string;
    methods: ProviderBaseMethods | ProviderUpdateMethodsAnyOf;
    isFetching: boolean;
}

export const ProviderMethodsShow = ({ methods, providerId, isFetching }: IProviderMethodsShow) => {
    const providersDataProvider = new ProvidersDataProvider();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [editMethod, setEditMethod] = useState("");
    const [addMethodForm, setAddMethodForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [keyForRemove, setKeyForRemove] = useState("");
    const [showMethodsDialog, setShowMethodsDialog] = useState(false);

    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();
    const { copy } = useCopy();

    const handleDeleteClick = (key: string) => {
        setKeyForRemove(key);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setKeyForRemove("");
        setDeleteDialogOpen(false);
    };

    const updateProviderMethods = async (tempMethodsData: typeof methods) =>
        await providersDataProvider.update("provider", {
            id: providerId,
            data: { methods: { ...tempMethodsData } },
            previousData: { methods } as ProviderUpdateParams
        });

    const onAddMethod = async (key: string, value: ExecutionMethodInput) => {
        if (Object.keys(methods).includes(key)) {
            appToast("error", translate("resources.provider.errors.methodAlreadyExist"));
            return;
        }

        try {
            setButtonDisabled(true);

            await updateProviderMethods({ ...methods, [key]: { ...value } });

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

    const onChangeMethod = async (originalKey: string, key: string, value: ExecutionMethodInput) => {
        const tempMethodsData = { ...methods };

        if (originalKey === key) {
            tempMethodsData[originalKey] = { ...value };
        } else {
            delete tempMethodsData[originalKey];
            tempMethodsData[key] = { ...value };
        }

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
        const tempMethodsData = { ...methods };
        delete tempMethodsData[originalKey];

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

    const stringifiedMethods = JSON.stringify(methods || "{}", null, 4);

    return (
        <div className="flex flex-col gap-4 rounded-8 bg-neutral-0 px-8 py-4 dark:bg-neutral-100">
            <div className="flex items-center gap-4">
                <h3 className="text-2xl text-neutral-90 dark:text-neutral-30">
                    {translate("resources.provider.fields.methods")}
                </h3>
                <div className="flex flex-col items-center">
                    <Button className="flex flex-col py-6" onClick={() => copy(stringifiedMethods)}>
                        <Copy className="min-h-4 min-w-4" />
                        <span>Json</span>
                    </Button>
                </div>
                <div className="flex flex-col items-center">
                    <Button
                        onClick={() => setShowMethodsDialog(true)}
                        variant="text_btn"
                        className="flex flex-col py-6">
                        <EyeIcon className="min-h-4 min-w-4" />
                        <span>Json</span>
                    </Button>
                </div>
            </div>
            {Object.keys(methods).length > 0 ? (
                <Accordion type="multiple">
                    {Object.keys(methods).map(methodKey => (
                        <AccordionItem key={methodKey} value={methodKey}>
                            <AccordionTrigger className="text-neutral-90 dark:text-neutral-0">
                                {methodKey}
                            </AccordionTrigger>

                            <AccordionContent>
                                {editMethod === methodKey ? (
                                    <ProviderMethodsForm
                                        methodKey={methodKey}
                                        methodValue={methods[methodKey]}
                                        disabledProcess={isFetching || buttonDisabled}
                                        onChangeMethod={(key, value) => onChangeMethod(methodKey, key, value)}
                                        onCancel={() => setEditMethod("")}
                                    />
                                ) : (
                                    <ProviderMethodsTable
                                        disabledProcess={isFetching || buttonDisabled}
                                        disabledEditButton={!!editMethod}
                                        onDeleteClick={() => handleDeleteClick(methodKey)}
                                        onEditClick={() => setEditMethod(methodKey)}
                                        methodValue={methods[methodKey] as ExecutionMethodOutput}
                                        disabledDeleteButton={methodKey === "callback"}
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <span className="self-center text-lg text-neutral-50">
                    {translate("resources.provider.methodNotFound")}
                </span>
            )}

            <Button
                disabled={addMethodForm || isFetching || buttonDisabled}
                className="flex items-center gap-1 self-end"
                onClick={() => setAddMethodForm(true)}>
                <CirclePlus className="h-[16px] w-[16px]" />
                <span className="text-title-1">{translate("resources.provider.addMethod")}</span>
            </Button>

            {addMethodForm && (
                <ProviderMethodsForm
                    disabledProcess={isFetching || buttonDisabled}
                    onChangeMethod={onAddMethod}
                    onCancel={() => setAddMethodForm(false)}
                />
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="!z-[200] h-auto max-h-56 !w-[251px] overflow-hidden rounded-16 bg-muted xl:max-h-none">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            {translate("resources.provider.removeMethodDialog")}
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

            <ProviderSettingsJsonShowDialog
                open={showMethodsDialog}
                setOpen={setShowMethodsDialog}
                label={translate("resources.provider.fields.methods")}
                json={stringifiedMethods}
            />
        </div>
    );
};
