import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";
import useSystemPaymentInstrumentsListFilter from "../../../../hooks/useSystemPaymentInstrumentsListFilter";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { CurrencySelect } from "../../components/Selects/CurrencySelect";
import { PopoverSelect } from "../../components/Selects/PopoverSelect";
import { ExportPSReportDialog } from "../PaymentTypes/ExportPSReportDialog";
import { UploadCsvFileDialog } from "../PaymentTypes/UploadCsvFileDialog";

interface SystemPaymentInstrumentsListFilterProps {
    handleCreateClicked: () => void;
}

export const SystemPaymentInstrumentsListFilter = (props: SystemPaymentInstrumentsListFilterProps) => {
    const { handleCreateClicked } = props;

    const {
        translate,
        code,
        currencyCode,
        paymentTypeCode,
        currencies,
        isLoadingCurrencies,
        paymentTypes,
        isLoadingPaymentTypes,
        onPaymentTypeCodeChanged,
        onClearFilters,
        onCodeChanged,
        onCurrencyCodeChanged,
        reportLoading,
        handleDownloadReport,
        handleUploadReport
    } = useSystemPaymentInstrumentsListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const clearDisabled = !code && !currencyCode && !paymentTypeCode;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[code, currencyCode, paymentTypeCode]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />

                    <div className="flex justify-end">
                        <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate("resources.paymentSettings.systemPaymentInstruments.createNew")}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            <AnimatedContainer open={openFiltersClicked}>
                <div className="mb-4 flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                    <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                        <Input
                            label={translate("resources.paymentSettings.systemPaymentInstruments.list.code")}
                            labelSize="title-2"
                            value={code}
                            placeholder={translate(
                                "resources.paymentSettings.systemPaymentInstruments.placeholders.code"
                            )}
                            onChange={onCodeChanged}
                        />
                    </div>
                    <div className="flex min-w-36 flex-1 flex-col gap-1">
                        <Label variant={"title-2"}>
                            {translate("resources.paymentSettings.systemPaymentInstruments.fields.currency_code")}
                        </Label>
                        <CurrencySelect
                            currencies={currencies ?? []}
                            value={currencyCode}
                            onChange={onCurrencyCodeChanged}
                            disabled={isLoadingCurrencies}
                            style="Black"
                            placeholder={translate(
                                "resources.paymentSettings.systemPaymentInstruments.placeholders.currencyCode"
                            )}
                        />
                    </div>
                    <div className="flex min-w-36 flex-1 flex-col gap-1">
                        <Label variant={"title-2"}>
                            {translate("resources.paymentSettings.systemPaymentInstruments.list.paymentType")}
                        </Label>
                        <PopoverSelect
                            variants={paymentTypes ?? []}
                            value={paymentTypeCode}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(e: any) => onPaymentTypeCodeChanged(e)}
                            variantKey={"code"}
                            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                            notFoundMessage={translate("resources.paymentSettings.paymentType.notFoundMessage")}
                            disabled={isLoadingPaymentTypes}
                            style="Black"
                            placeholder={translate("resources.paymentSettings.paymentType.placeholders.code")}
                            iconForPaymentTypes
                        />
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
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
                    </div>
                </div>
            </AnimatedContainer>
            <UploadCsvFileDialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
                handleUplaod={handleUploadReport}
            />
            <ExportPSReportDialog
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                handleExport={handleDownloadReport}
            />
        </div>
    );
};
