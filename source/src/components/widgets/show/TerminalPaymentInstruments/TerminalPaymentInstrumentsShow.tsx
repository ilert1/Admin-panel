import { useLocaleState, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { Button } from "@/components/ui/Button";
import { useCallback, useState } from "react";
import { DeleteTerminalPaymentInstrumentsDialog } from "../../lists/TerminalPaymentInstruments/DeleteTerminalPaymentInstrumentsDialog";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TerminalPaymentInstrumentsActivityBtn } from "../../lists/TerminalPaymentInstruments/TerminalPaymentInstrumentsActivityBtn";
import { EditTerminalPaymentInstrumentsDialog } from "./EditTerminalPaymentInstrumentsDialog";
import { useSheets } from "@/components/providers/SheetProvider";
import { useFetchDictionaries } from "@/hooks";

export interface TerminalPaymentInstrumentsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const TerminalPaymentInstrumentsShow = ({ id, onOpenChange }: TerminalPaymentInstrumentsShowProps) => {
    const context = useAbortableShowController<TerminalPaymentInstrument>({
        resource: "terminalPaymentInstruments",
        id
    });

    const data = useFetchDictionaries();
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { openSheet } = useSheets();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEditClicked = useCallback(() => {
        setEditDialogOpen(prev => !prev);
    }, []);

    const handleDeleteClicked = useCallback(() => {
        setDeleteDialogOpen(prev => !prev);
    }, []);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center gap-2 md:flex-nowrap">
                <TextField text={context.record.id} copyValue className="text-neutral-70 dark:text-neutral-30" />

                <div className="mt-2 flex items-center justify-center self-start text-white sm:mt-0 sm:self-center">
                    <TerminalPaymentInstrumentsActivityBtn
                        id={context.record.id}
                        terminalPaymentInstrumentName={context.record.id}
                        activityState={context.record.status === "ACTIVE" ? true : false}
                        isFetching={context.isFetching}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-[24px]">
                    <TextField
                        label={translate("resources.paymentSettings.terminalPaymentInstruments.fields.terminal_id")}
                        className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                        text={context.record.terminal.verbose_name}
                        onClick={() => {
                            openSheet("terminal", {
                                id: context.record.terminal_id
                            });
                        }}
                    />

                    <TextField
                        label={translate(
                            "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_code"
                        )}
                        className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                        text={context.record.system_payment_instrument_code}
                        onClick={() => {
                            openSheet("systemPaymentInstrument", {
                                id: context.record.system_payment_instrument_code
                            });
                        }}
                    />

                    <TextField
                        fontSize="title-2"
                        label={translate("resources.paymentSettings.systemPaymentInstruments.list.direction")}
                        text={
                            context.record.direction
                                ? translate(`resources.direction.types.${context.record.direction}`)
                                : ""
                        }
                    />

                    <TextField
                        label={translate(
                            "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"
                        )}
                        text={context.record.terminal_payment_type_code || ""}
                    />

                    <TextField
                        label={translate(
                            "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"
                        )}
                        text={context.record.terminal_currency_code || ""}
                    />

                    <TextField
                        label={translate(
                            "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_country"
                        )}
                        text={context.record.terminal_country || ""}
                    />

                    <TextField
                        label={translate(
                            "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
                        )}
                        text={context.record.terminal_financial_institution_code || ""}
                    />

                    <TextField
                        label={translate(
                            "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_outgoing_code"
                        )}
                        text={context.record.terminal_financial_institution_outgoing_code || ""}
                    />

                    <div>
                        <TextField
                            fontSize="title-2"
                            label={translate("resources.paymentSettings.terminalPaymentInstruments.fields.created_at")}
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
                            label={translate("resources.paymentSettings.terminalPaymentInstruments.fields.updated_at")}
                            text={new Date(context.record.updated_at).toLocaleDateString(locale) || ""}
                        />
                        <TextField
                            fontSize="title-2"
                            text={new Date(context.record.updated_at).toLocaleTimeString(locale) || ""}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <small className="text-sm text-neutral-60">
                        {translate(
                            "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_specific_parameters"
                        )}
                    </small>

                    <MonacoEditor
                        disabled
                        code={JSON.stringify(context.record.terminal_specific_parameters || "{}", null, 2)}
                    />
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

            <EditTerminalPaymentInstrumentsDialog id={id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

            <DeleteTerminalPaymentInstrumentsDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />
        </div>
    );
};
