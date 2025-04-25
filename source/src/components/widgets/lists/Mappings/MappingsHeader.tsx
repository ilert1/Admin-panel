import { Button } from "@/components/ui/Button";
import { ResourceHeaderTitle, TestEnvText } from "../../components/ResourceHeaderTitle";
import { useTranslate } from "react-admin";
import { PlusCircle } from "lucide-react";

interface MappingsHeaderProps {
    setCreateMappingClicked: (state: boolean) => void;
}

export const MappingsHeader = (props: MappingsHeaderProps) => {
    const { setCreateMappingClicked } = props;
    const translate = useTranslate();

    return (
        <>
            <TestEnvText />
            <ResourceHeaderTitle />
            <Button
                className="flex gap-1"
                onClick={() => {
                    setCreateMappingClicked(true);
                }}>
                <PlusCircle className="h-4 w-4" /> {translate("resources.callbridge.mapping.create")}
            </Button>
        </>
    );
};
