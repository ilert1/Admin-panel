import { Label } from "@/components/ui/label";
import useTerminalPaymentInstrumentFilter from "./useTerminalPaymentInstrumentFilter";
import { Button } from "@/components/ui/Button";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { useState } from "react";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/Input/input";
import { ProviderSelect } from "../../components/Selects/ProviderSelect";
import { PopoverSelect } from "../../components/Selects/PopoverSelect";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ImportSingleFileDialog } from "./ImportSingleFileDialog";
import { ImportMultipleFilesDialog } from "./ImportMultipleFilesDialog";
import { ExportReportDialog } from "./ExportReportDialog";
import { DeleteAllTPIDialog } from "./DeleteAllTPIDialog";
import { useListContext } from "react-admin";

interface TerminalPaymentInstrumentFilterProps {
    createFn: () => void;
}

export const TerminalPaymentInstrumentFilter = ({ createFn }: TerminalPaymentInstrumentFilterProps) => {
    const {
        providersData,
        providersLoadingProcess,
        onClearFilters,
        onProviderChanged,
        translate,
        terminalPaymentTypeCode,
        terminalCurrencyCode,
        terminalFinancialInstitutionCode,
        terminalFinancialInstitutionOutgoingCode,
        terminalCountry,
        onTerminalPaymentTypeCodeChanged,
        onTerminalCurrencyCodeChanged,
        onTerminalFinancialInstitutionCodeChanged,
        onTerminalFinancialInstitutionOutgoingCodeChanged,
        onTerminalCountryChanged,
        terminalsLoadingProcess,
        providerName,
        terminalFilterName,
        terminalsData,
        terminalFilterId,
        onTerminalNameChanged,
        onTerminalIdFieldChanged,
        handleUploadReport,
        handleUploadMultipleFiles,
        handleDownloadReport,
        onSystemPaymentInstrumentCodeChanged,
        selectSpiCode,
        filtering
    } = useTerminalPaymentInstrumentFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(true);
    // const [showInitializeDialog, setShowInitializeDialog] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [uploadSingleDialogOpen, setUploadSingleDialogOpen] = useState(false);
    const [uploadMultipleDialogOpen, setUploadMultipleDialogOpen] = useState(false);
    const [deleteAllTPIDialogOpen, setDeleteAllTPIDialogOpen] = useState(false);

    const { isLoading, isPending, isFetching, data } = useListContext();
    console.log(isLoading, isPending, isFetching);

    const clearDisabled =
        !providerName &&
        !terminalFilterId &&
        !terminalPaymentTypeCode &&
        !terminalCurrencyCode &&
        !terminalCountry &&
        !terminalFinancialInstitutionCode &&
        !terminalFinancialInstitutionOutgoingCode &&
        !selectSpiCode;

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <SyncDisplayedFilters />
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[
                            providerName,
                            terminalFilterId,
                            terminalPaymentTypeCode,
                            terminalCurrencyCode,
                            terminalCountry,
                            terminalFinancialInstitutionCode,
                            terminalFinancialInstitutionOutgoingCode,
                            selectSpiCode
                        ]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />

                    <div className="flex justify-end gap-2">
                        <Button onClick={createFn} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate(
                                    "resources.paymentSettings.terminalPaymentInstruments.createTerminalPaymentInstrument"
                                )}
                            </span>
                        </Button>
                        <Button
                            onClick={() => setExportDialogOpen(true)}
                            disabled={!terminalFilterName}
                            className="flex flex-1 items-center justify-center gap-1 font-normal sm:flex-none sm:self-end">
                            <span>{translate("resources.paymentSettings.reports.export")}</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="mt-1 sm:mt-0 md:ml-auto" variant="default" size="sm">
                                    {translate("resources.paymentSettings.reports.import")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="border-green-50 p-0" align="end">
                                <DropdownMenuItem
                                    className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-neutral-40 focus:dark:text-white"
                                    onClick={() => setUploadSingleDialogOpen(true)}>
                                    {translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fileDownloadUpload.singleFile"
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer rounded-none px-4 py-1.5 text-sm text-neutral-80 focus:bg-green-50 focus:text-white dark:text-neutral-40 focus:dark:text-white"
                                    onClick={() => setUploadMultipleDialogOpen(true)}>
                                    {translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fileDownloadUpload.multipleFiles"
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <AnimatedContainer open={openFiltersClicked}>
                <div className="mb-6">
                    <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:flex-row md:items-end">
                        <div className="md: flex min-w-36 flex-1 flex-col gap-1 sm:max-w-96 md:max-w-60">
                            <Label className="mb-0" variant="title-2">
                                {translate("resources.terminals.selectHeader")}
                            </Label>

                            <ProviderSelect
                                style="Black"
                                providers={providersData || []}
                                value={providerName}
                                onChange={onProviderChanged}
                                disabled={providersLoadingProcess}
                                isLoading={providersLoadingProcess}
                            />
                        </div>

                        <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col flex-wrap gap-1 sm:max-w-96 md:max-w-[400px]">
                            <Label variant="title-2" className="mb-0 md:text-nowrap">
                                {translate("resources.terminals.filter.filterByName")}
                            </Label>

                            <PopoverSelect
                                style="Black"
                                variants={terminalsData || []}
                                variantKey="verbose_name"
                                value={terminalFilterName}
                                onChange={onTerminalNameChanged}
                                idField="terminal_id"
                                setIdValue={onTerminalIdFieldChanged}
                                disabled={terminalsLoadingProcess || !providerName}
                                placeholder={
                                    providerName
                                        ? translate("resources.terminals.selectPlaceholder")
                                        : translate("resources.direction.noTerminals")
                                }
                                commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                notFoundMessage={translate("resources.terminals.notFoundMessage")}
                                isLoading={terminalsLoadingProcess}
                            />
                        </div>
                        <Button
                            className="mt-4 sm:mt-0"
                            onClick={() => setDeleteAllTPIDialogOpen(true)}
                            disabled={isLoading || filtering || !terminalFilterId || !data || data.length === 0}>
                            {translate(
                                "resources.paymentSettings.terminalPaymentInstruments.deleteAllTerminalPaymentInstruments"
                            )}
                        </Button>

                        {/* <Button
                            onClick={() => setShowInitializeDialog(true)}
                            disabled={!terminalFilterId || terminalsLoadingProcess || !providerName}>
                            {translate("resources.paymentSettings.terminalPaymentInstruments.initInstruments")}
                        </Button> */}
                    </div>
                    <div>
                        <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                            <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-64 md:max-w-[350px]">
                                <Input
                                    labelSize="title-2"
                                    value={selectSpiCode}
                                    onChange={onSystemPaymentInstrumentCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_code_filter"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_code_name"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>

                            <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-52 md:max-w-[350px]">
                                <Input
                                    labelSize="title-2"
                                    value={terminalCurrencyCode}
                                    onChange={onTerminalCurrencyCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>

                            <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-52 md:max-w-[350px]">
                                <Input
                                    labelSize="title-2"
                                    value={terminalCountry}
                                    onChange={onTerminalCountryChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_country"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_country"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>

                            <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-64 md:max-w-[350px]">
                                <Input
                                    labelSize="title-2"
                                    value={terminalFinancialInstitutionCode}
                                    onChange={onTerminalFinancialInstitutionCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code_filter"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>

                            <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-80 md:max-w-[350px]">
                                <Input
                                    labelSize="title-2"
                                    value={terminalFinancialInstitutionOutgoingCode}
                                    onChange={onTerminalFinancialInstitutionOutgoingCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_outgoing_code_filter"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_outgoing_code"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>

                            <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56 md:max-w-[350px]">
                                <Input
                                    labelSize="title-2"
                                    value={terminalPaymentTypeCode}
                                    onChange={onTerminalPaymentTypeCodeChanged}
                                    label={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"
                                    )}
                                    placeholder={translate(
                                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"
                                    )}
                                    disabled={!providerName}
                                />
                            </div>

                            {/* <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                                <Button
                                    onClick={() => setExportDialogOpen(true)}
                                    disabled={reportLoading}
                                    className="mt-2 flex flex-1 items-center justify-center gap-1 font-normal sm:mt-0 sm:flex-none sm:self-end">
                                    <span>{translate("resources.paymentSettings.reports.export")}</span>
                                </Button>
                                <Button
                                    onClick={() => setUploadDialogOpen(true)}
                                    disabled={reportLoading}
                                    className="flex flex-1 items-center justify-center gap-1 font-normal sm:flex-none sm:self-end">
                                    <span>{translate("resources.paymentSettings.reports.import")}</span>
                                </Button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </AnimatedContainer>
            {/* <InitializeTerminalPaymentInstrumentsDialog
                terminal={terminalsData?.find(item => item.terminal_id === terminalFilterId)}
                open={showInitializeDialog}
                onOpenChange={setShowInitializeDialog}
            /> */}
            <ImportSingleFileDialog
                open={uploadSingleDialogOpen}
                onOpenChange={setUploadSingleDialogOpen}
                handleImport={handleUploadReport}
                providersList={providersData}
            />
            <ImportMultipleFilesDialog
                open={uploadMultipleDialogOpen}
                onOpenChange={setUploadMultipleDialogOpen}
                handleImport={handleUploadMultipleFiles}
                providersList={providersData}
            />
            <ExportReportDialog
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                handleExport={handleDownloadReport}
                terminalId={terminalFilterId}
            />
            <DeleteAllTPIDialog
                open={deleteAllTPIDialogOpen}
                onOpenChange={setDeleteAllTPIDialogOpen}
                terminalName={terminalFilterName}
                terminalIdClearCallback={() => {
                    onTerminalIdFieldChanged("");
                    onTerminalNameChanged("");
                }}
            />
        </>
    );
};
