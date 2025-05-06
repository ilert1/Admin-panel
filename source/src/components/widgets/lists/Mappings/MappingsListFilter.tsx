import { Input } from "@/components/ui/Input/input";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import useMappingFilter from "@/hooks/useMappingFilter";
import { useState } from "react";

interface MappingsListFilterProps {
    setCreateMappingClicked: (state: boolean) => void;
}

export const MappingsListFilter = ({ setCreateMappingClicked }: MappingsListFilterProps) => {
    const {
        translate,
        nameValue,
        descriptionValue,
        extPathValue,
        intPathValue,
        onNameValueChanged,
        onDescriptionValueChanged,
        onExtPathValueChanged,
        onIntPathValueChanged,
        onClearFilters
    } = useMappingFilter();

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !nameValue && !descriptionValue && !extPathValue && !intPathValue;

    return (
        <>
            <div className="mb-4">
                <div className="mb-6 flex flex-wrap justify-between gap-2">
                    <ResourceHeaderTitle />
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                            className="flex gap-1"
                            onClick={() => {
                                setCreateMappingClicked(true);
                            }}>
                            <PlusCircle className="h-4 w-4" /> {translate("resources.callbridge.mapping.create")}
                        </Button>

                        <FilterButtonGroup
                            filterList={[nameValue, descriptionValue, extPathValue, intPathValue]}
                            onClearFilters={onClearFilters}
                            open={openFiltersClicked}
                            onOpenChange={setOpenFiltersClicked}
                            clearButtonDisabled={clearDisabled}
                        />
                    </div>
                </div>
                <div className="w mb-2 flex gap-2"></div>

                <AnimatedContainer open={openFiltersClicked}>
                    <div className="flex flex-wrap gap-2 md:flex-nowrap">
                        <Input
                            value={nameValue}
                            onChange={onNameValueChanged}
                            label={translate("resources.callbridge.mapping.fields.name")}
                            labelSize="title-2"
                        />
                        <Input
                            value={descriptionValue}
                            onChange={onDescriptionValueChanged}
                            label={translate("resources.callbridge.mapping.fields.description")}
                            labelSize="title-2"
                        />
                        <Input
                            value={extPathValue}
                            onChange={onExtPathValueChanged}
                            label={translate("resources.callbridge.mapping.fields.ext_path")}
                            labelSize="title-2"
                        />
                        <Input
                            value={intPathValue}
                            onChange={onIntPathValueChanged}
                            label={translate("resources.callbridge.mapping.fields.int_path")}
                            labelSize="title-2"
                        />
                    </div>
                </AnimatedContainer>
            </div>
        </>
    );
};
