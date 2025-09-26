import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import useFinancialInstitutionsListFilter from "./useFinancialInstitutionsListFilter";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";
import { UploadCsvFileDialog } from "../PaymentTypes/UploadCsvFileDialog";
import { ExportPSReportDialog } from "../PaymentTypes/ExportPSReportDialog";
import { useListContext } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { CurrenciesMultiSelect } from "../../components/MultiSelectComponents/CurrenciesMultiSelect";
import { CountrySelect } from "../../components/Selects/CountrySelect";

interface FinancialInstitutionsListFilterProps {
    handleCreateClicked: () => void;
}

export const FinancialInstitutionsListFilter = (props: FinancialInstitutionsListFilterProps) => {
    const { handleCreateClicked } = props;

    const {
        translate,
        name,
        code,
        institutionType,
        countryCodeName,
        countryCode,
        nspkMemberId,
        currencyCodes,
        currenciesData,
        currenciesLoadingProcess,
        reportLoading,
        setCountryCodeName,
        onCodeChanged,
        onInstitutionTypeChanged,
        onCountryCodeChanged,
        onNspkMemberIdChanged,
        onCurrencyCodesChanged,
        onClearFilters,
        onNameChanged,
        handleDownloadReport,
        handleUploadReport
    } = useFinancialInstitutionsListFilter();
    const { isLoading: financialInstitutionTypesLoading, data: financialInstitutionTypes } =
        useFetchFinancialInstitutionTypes();
    const { total } = useListContext();
    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const clearDisabled =
        !name && !code && !institutionType && !countryCode && !nspkMemberId && currencyCodes.length === 0;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-4 sm:flex-row">
                    <FilterButtonGroup
                        filterList={[name, code, institutionType, countryCode, nspkMemberId, currencyCodes.length > 0]}
                        onClearFilters={onClearFilters}
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                    />

                    <div className="flex flex-wrap justify-end gap-2">
                        <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />
                            <span className="text-title-1">
                                {translate(
                                    "resources.paymentSettings.financialInstitution.createFinancialInstitutionBtn"
                                )}
                            </span>
                        </Button>
                        <Button
                            onClick={() => setExportDialogOpen(true)}
                            disabled={!total || reportLoading}
                            className="flex flex-1 items-center justify-center gap-1 font-normal sm:flex-none sm:self-end">
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
            </div>
            <AnimatedContainer open={openFiltersClicked}>
                <div className="mb-4 flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-3">
                    <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-56">
                        <Input
                            label={translate("resources.paymentSettings.financialInstitution.fields.name")}
                            labelSize="title-2"
                            value={name}
                            onChange={onNameChanged}
                            placeholder={translate("resources.paymentSettings.financialInstitution.placeholders.name")}
                        />
                    </div>

                    <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-24">
                        <Input
                            label={translate("resources.paymentSettings.financialInstitution.fields.code")}
                            labelSize="title-2"
                            value={code}
                            onChange={onCodeChanged}
                            placeholder={translate("resources.paymentSettings.financialInstitution.fields.code")}
                        />
                    </div>

                    <div className="flex min-w-36 flex-1 flex-col">
                        <Label variant={"title-2"}>
                            {translate("resources.paymentSettings.financialInstitution.fields.country_code")}
                        </Label>

                        <CountrySelect
                            style="Black"
                            value={countryCodeName}
                            onChange={setCountryCodeName}
                            setIdValue={onCountryCodeChanged}
                        />
                    </div>

                    <div className="flex min-w-36 flex-1 flex-col items-start gap-2 md:min-w-24">
                        <Input
                            label={translate("resources.paymentSettings.financialInstitution.fields.nspk_member_id")}
                            labelSize="title-2"
                            value={nspkMemberId}
                            onChange={onNspkMemberIdChanged}
                            placeholder={translate(
                                "resources.paymentSettings.financialInstitution.fields.nspk_member_id"
                            )}
                        />
                    </div>

                    <div className="flex min-w-36 flex-1 flex-col">
                        <Label variant={"title-2"}>
                            {translate("resources.paymentSettings.financialInstitution.fields.institution_type")}
                        </Label>
                        <Select
                            value={institutionType}
                            onValueChange={value =>
                                value === "null" ? onInstitutionTypeChanged("") : onInstitutionTypeChanged(value)
                            }>
                            <SelectTrigger
                                disabled={financialInstitutionTypesLoading}
                                className="h-[38px] !w-full text-ellipsis">
                                {financialInstitutionTypesLoading ? (
                                    <div className="flex w-full items-center justify-center">
                                        <LoadingBlock className="!h-4 !w-4" />
                                    </div>
                                ) : (
                                    <SelectValue
                                        placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                    />
                                )}
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="null">
                                        {translate("resources.transactions.filter.showAll")}
                                    </SelectItem>

                                    {financialInstitutionTypes?.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex min-w-36 flex-1 flex-col gap-1">
                        <CurrenciesMultiSelect
                            labelSize="title-2"
                            variant="secondary"
                            options={currenciesData}
                            onChange={onCurrencyCodesChanged}
                            value={currencyCodes}
                            className="bg-neutral-0 hover:bg-neutral-0 active:bg-neutral-0 dark:bg-neutral-100 dark:hover:bg-neutral-100 dark:active:bg-neutral-100"
                            placeholder={translate(
                                "resources.paymentSettings.financialInstitution.fields.currenciesToChoose"
                            )}
                            modal={false}
                            isLoading={currenciesLoadingProcess}
                        />
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
