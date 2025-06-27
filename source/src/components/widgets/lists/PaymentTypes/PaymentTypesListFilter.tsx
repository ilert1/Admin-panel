import { useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input/input";
import usePaymentTypesListFilter from "../../../../hooks/usePaymentTypesListFilter";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { PaymentCategory } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { UploadCsvFileDialog } from "./UploadCsvFileDialog";
import { ExportPSReportDialog } from "./ExportPSReportDialog";
import { useListContext } from "react-admin";

interface PaymentTypesListFilterProps {
    handleCreateClicked: () => void;
}

export const PaymentTypesListFilter = (props: PaymentTypesListFilterProps) => {
    const { handleCreateClicked } = props;

    const {
        translate,
        code,
        title,
        reportLoading,
        category,
        onCategoryChanged,
        onClearFilters,
        onCodeChanged,
        onTitleChanged,
        handleDownloadReport,
        handleUploadReport
    } = usePaymentTypesListFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const { total } = useListContext();

    const paymentTypeCategories = Object.keys(PaymentCategory);
    const clearDisabled = !code && !title && !category;

    return (
        <div className="mb-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <FilterButtonGroup
                            filterList={[code, title, category]}
                            onClearFilters={onClearFilters}
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            clearButtonDisabled={clearDisabled}
                        />
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate("resources.paymentSettings.paymentType.createNew")}
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
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        <div className="flex w-full flex-col gap-2 md:flex-row">
                            <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
                                <Input
                                    label={translate("resources.paymentSettings.paymentType.fields.code")}
                                    labelSize="title-2"
                                    value={code}
                                    onChange={onCodeChanged}
                                    className="min-w-40"
                                    placeholder={translate("resources.paymentSettings.paymentType.placeholders.code")}
                                />
                                <Input
                                    label={translate("resources.paymentSettings.paymentType.fields.title")}
                                    labelSize="title-2"
                                    value={title}
                                    onChange={onTitleChanged}
                                    className="min-w-40"
                                    placeholder={translate("resources.paymentSettings.paymentType.placeholders.title")}
                                />
                                <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
                                    <div className="flex min-w-[50%] max-w-full flex-1 flex-col gap-1 sm:min-w-44 sm:max-w-[25%]">
                                        <Label variant="title-2" className="mb-0">
                                            {translate("resources.paymentSettings.paymentType.fields.category")}
                                        </Label>

                                        <Select
                                            value={category}
                                            onValueChange={value =>
                                                value === "null" ? onCategoryChanged("") : onCategoryChanged(value)
                                            }>
                                            <SelectTrigger className="h-[38px] !w-full text-ellipsis">
                                                <SelectValue
                                                    placeholder={translate(
                                                        "resources.transactions.filter.filterAllPlaceholder"
                                                    )}
                                                />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="null">
                                                        {translate("resources.transactions.filter.showAll")}
                                                    </SelectItem>
                                                    {paymentTypeCategories.map(el => {
                                                        return (
                                                            <SelectItem key={el} value={el}>
                                                                {el}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
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
