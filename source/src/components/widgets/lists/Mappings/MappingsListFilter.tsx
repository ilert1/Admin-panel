import { Input } from "@/components/ui/Input/input";
import { useTranslate } from "react-admin";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

interface MappingsListFilterProps {
    setCreateMappingClicked: (state: boolean) => void;
    setFilters: (filters: unknown, displayedFilters?: unknown, debounce?: boolean) => void;
}

interface FilterObjectType {
    name?: string;
    description?: string;
    internal_path?: string;
    external_path?: string;
}

export const MappingsListFilter = (props: MappingsListFilterProps) => {
    const { setCreateMappingClicked, setFilters } = props;
    const translate = useTranslate();

    const [nameValue, setNameValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [extPathValue, setExtPathValue] = useState("");
    const [intPathValue, setIntPathValue] = useState("");

    const onClearFilters = () => {
        setNameValue("");
        setDescriptionValue("");
        setExtPathValue("");
        setIntPathValue("");
    };

    useEffect(() => {
        const filtersObj: FilterObjectType = {};

        nameValue ? (filtersObj.name = nameValue) : "";
        descriptionValue ? (filtersObj.description = descriptionValue) : "";
        intPathValue ? (filtersObj.internal_path = intPathValue) : "";
        extPathValue ? (filtersObj.external_path = extPathValue) : "";
        console.log(filtersObj);

        setFilters(filtersObj, filtersObj, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [descriptionValue, extPathValue, intPathValue, nameValue]);

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !nameValue && !descriptionValue && !extPathValue && !intPathValue;

    return (
        <>
            <div className="mb-4">
                <div className="mb-6 flex flex-wrap justify-between gap-2">
                    <ResourceHeaderTitle />
                    <div className="flex gap-4">
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
                    <div className="flex gap-2">
                        <Input
                            value={nameValue}
                            onChange={e => setNameValue(e.target.value)}
                            label={translate("resources.callbridge.mapping.fields.name")}
                            labelSize="title-2"
                        />
                        <Input
                            value={descriptionValue}
                            onChange={e => setDescriptionValue(e.target.value)}
                            label={translate("resources.callbridge.mapping.fields.description")}
                            labelSize="title-2"
                        />
                        <Input
                            value={extPathValue}
                            onChange={e => setExtPathValue(e.target.value)}
                            label={translate("resources.callbridge.mapping.fields.ext_path")}
                            labelSize="title-2"
                        />
                        <Input
                            value={intPathValue}
                            onChange={e => setIntPathValue(e.target.value)}
                            label={translate("resources.callbridge.mapping.fields.int_path")}
                            labelSize="title-2"
                        />
                    </div>
                </AnimatedContainer>
            </div>
        </>
    );
};
