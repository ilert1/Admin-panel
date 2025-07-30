import { useRefresh, useTranslate } from "react-admin";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

interface AddCustomDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    onConfirm: () => void;
    code: string;
    localOptions: {
        label: string;
        value: string;
        icon?: React.FC<{
            className?: string;
            small?: boolean;
        }>;
    }[];
    clear: () => void;
}

export const AddCustomDialog = (props: AddCustomDialogProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();

    const { open, code, localOptions, onOpenChange, onConfirm, clear } = props;

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [found, setFound] = useState("");
    const doesExist = localOptions.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (opt: any) => opt.value === code || opt.label?.toLowerCase() === code.toLowerCase()
    );
    useEffect(() => {
        if (doesExist) {
            setFound(
                localOptions.find((opt: any) => opt.value === code || opt.label?.toLowerCase() === code.toLowerCase())
                    ?.label ?? ""
            );
        }
    }, [doesExist]);

    const handleConfirm = () => {
        setButtonDisabled(true);
        onConfirm();
        refresh();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="h-auto max-h-56 !max-w-[370px] overflow-hidden rounded-16 bg-muted xl:max-h-none"
                onCloseAutoFocus={() => {
                    setButtonDisabled(false);
                }}>
                <DialogHeader>
                    <DialogTitle className="line-clamp-6 overflow-hidden overflow-ellipsis text-wrap break-words text-center">
                        {doesExist ? (
                            translate("app.widgets.multiSelect.confirmDialog.alreadyExists", { code, name: found })
                        ) : (
                            <span className="text-xl font-normal text-green-60 dark:text-white">
                                {translate("app.widgets.multiSelect.confirmDialog.areYouSure")}
                                <span className="line-clamp-6 overflow-hidden overflow-ellipsis text-wrap break-words break-all text-xl font-normal text-green-60 dark:text-white">
                                    {`'${code}'`}
                                </span>
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full justify-around gap-4">
                        <Button
                            className="w-full"
                            disabled={buttonDisabled}
                            onClick={() => {
                                handleConfirm();
                            }}>
                            {translate("app.widgets.multiSelect.confirmDialog.add")}
                        </Button>
                        <Button
                            className="w-full"
                            variant={"outline_gray"}
                            onClick={() => {
                                clear();
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
