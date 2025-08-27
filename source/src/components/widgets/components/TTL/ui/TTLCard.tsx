import { TTLConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useTranslate } from "react-admin";

interface LimitCardProps {
    ttl: TTLConfig;
    setEditClicked: (state: boolean) => void;
}

export const TTLCard = (props: LimitCardProps) => {
    const { ttl, setEditClicked } = props;

    const translate = useTranslate();

    return (
        <>
            <div className="mb-4 flex flex-col gap-4 rounded-8 bg-neutral-10 p-4 dark:bg-muted">
                <div className="items-left flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 flex-col gap-1 sm:gap-2">
                        <div className="grid grid-cols-2">
                            <TextField text={ttl.min?.toString() ?? ""} label="min" />
                            <TextField text={ttl.max?.toString() ?? ""} label="max" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-end gap-[10px] sm:flex-row">
                    <Button variant="outline" onClick={() => setEditClicked(true)} type="button">
                        {translate("app.ui.actions.edit")}
                    </Button>
                </div>
            </div>
        </>
    );
};
