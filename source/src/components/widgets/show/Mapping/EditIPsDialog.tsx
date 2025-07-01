import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { Input } from "@/components/ui/Input/input";
import { useEffect, useRef, useState } from "react";
import { Button, TrashButton } from "@/components/ui/Button";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CallbackMappingUpdate } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { ConfirmCloseDialog } from "./ConfirmCloseDialog";

export interface EditBlockedIPsDialogProps {
    id: string;
    IpList: string[] | undefined;
    open: boolean;
    onOpenChange: (state: boolean) => void;
    variant: "Blocked" | "Allowed";
    secondaryList: string[] | undefined;
}

const isValidIP = (ip: string) => {
    if (!ip || ip.trim() === "") return false;

    const parts = ip.split(".");
    if (parts.length !== 4) return false;

    return parts.every(part => {
        if (part === "" || part.length === 0) return false;
        const num = parseInt(part, 10);
        return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
    });
};

export const EditIPsDialog = (props: EditBlockedIPsDialogProps) => {
    const { open, id, IpList, variant, secondaryList, onOpenChange } = props;
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [newIp, setNewIp] = useState("");
    const [saveClicked, setSaveClicked] = useState(false);
    const [somethingEdited, setSomethingEdited] = useState(false);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);

    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();
    const dataProvider = useDataProvider();
    const containerEndRef = useRef<HTMLDivElement>(null);

    const [newIpList, setNewIpList] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        const cursorPosition = e.target.selectionStart || 0;

        value = value.replace(/[^\d.]/g, "");

        if (value.endsWith("..")) {
            value = value.slice(0, -1);
        }

        const parts = value.split(".");

        if (parts.length > 4) {
            parts.splice(4);
            value = parts.join(".");
        }

        let shouldAddDot = false;
        let newCursorPosition = cursorPosition;

        const validatedParts = parts.map(part => {
            if (part.length > 3) {
                part = part.substring(0, 3);
            }

            if (part && !isNaN(parseInt(part, 10))) {
                const num = parseInt(part, 10);
                if (num > 255) {
                    part = "255";
                }
            }

            return part;
        });

        const lastPartIndex = validatedParts.length - 1;
        const lastPart = validatedParts[lastPartIndex];

        if (lastPart && lastPart.length === 3 && validatedParts.length < 4 && !value.endsWith(".")) {
            shouldAddDot = true;
        }

        let validatedValue = validatedParts.join(".");

        if (shouldAddDot) {
            validatedValue += ".";
            newCursorPosition = validatedValue.length;
        }

        if (!shouldAddDot && newIpList.findIndex(el => el === validatedValue) >= 0) {
            setDeleteButtonDisabled(false);
        } else {
            setDeleteButtonDisabled(true);
        }

        setNewIp(validatedValue);

        setTimeout(() => {
            if (inputRef.current && shouldAddDot) {
                inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            const input = e.target as HTMLInputElement;
            const cursorPosition = input.selectionStart || 0;
            const value = newIp;

            if (cursorPosition > 0 && value[cursorPosition - 1] === ".") {
                e.preventDefault();
                const newValue = value.substring(0, cursorPosition - 1) + value.substring(cursorPosition);
                setNewIp(newValue);

                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                    }
                }, 0);
            } else if (cursorPosition === value.length && value.endsWith(".")) {
                e.preventDefault();
                const newValue = value.slice(0, -1);
                setNewIp(newValue);

                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.setSelectionRange(newValue.length, newValue.length);
                    }
                }, 0);
            }
        }

        if (e.key === "Enter" && newIp && isValidIP(newIp)) {
            addIp();
        }
    };

    useEffect(() => {
        if (newIpList && containerEndRef.current) {
            const parent = containerEndRef.current.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const childRect = containerEndRef.current.getBoundingClientRect();

                if (childRect.bottom > parentRect.bottom) {
                    containerEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
        }
    }, [newIpList]);

    useEffect(() => {
        if (IpList) setNewIpList(IpList);
        else setNewIpList([]);
        () => {
            setSaveClicked(false);
        };
    }, [IpList]);

    const addIp = () => {
        setSaveButtonDisabled(true);
        if (!isValidIP(newIp)) {
            appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.wrongFormatOfIp"));
        } else if (newIpList.includes(newIp)) {
            appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.alreadyExists"));
        } else {
            setSomethingEdited(true);
            setNewIpList([...newIpList, newIp]);
            appToast("success", translate("resources.callbridge.mapping.sec_policy_edit.addedSuccessfully"));
            setNewIp("");
        }

        setSaveButtonDisabled(false);
    };

    const deleteIp = (val?: string) => {
        setSaveButtonDisabled(true);

        if (val) {
            setSomethingEdited(true);
            setNewIpList(prev => prev.filter(el => el !== val));
        } else {
            if (!isValidIP(newIp)) {
                appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.wrongFormatOfIp"));
            } else if (!newIpList.includes(newIp)) {
                appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.notExist"));
            } else {
                setSomethingEdited(true);
                setDeleteButtonDisabled(true);
                setNewIpList(prev => prev.filter(el => el !== newIp));
                appToast("success", translate("resources.callbridge.mapping.sec_policy_edit.deletedSuccessfully"));
                setNewIp("");
            }
        }

        setSaveButtonDisabled(false);
    };

    const onSave = async () => {
        setSaveClicked(true);
        setSaveButtonDisabled(true);

        if (!somethingEdited) {
            onOpenChange(false);
            setSaveButtonDisabled(false);
            return;
        }

        try {
            const data: CallbackMappingUpdate =
                variant === "Blocked"
                    ? {
                          security_policy: { blocked_ips: newIpList, allowed_ips: secondaryList }
                      }
                    : {
                          security_policy: { allowed_ips: newIpList, blocked_ips: secondaryList }
                      };

            await dataProvider.update("callbridge/v1/mapping", {
                data,
                id,
                previousData: undefined
            });

            refresh();
            appToast(
                "success",
                translate("resources.callbridge.mapping.sec_policy_edit.ipAdressListUpdatedSuccessfully")
            );
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.edit.editError"));
        } finally {
            onOpenChange(false);
            setSaveButtonDisabled(false);
            setDeleteButtonDisabled(true);
            setSomethingEdited(false);
        }
    };

    const onCloseFn = () => {
        setSomethingEdited(false);
        setSaveClicked(false);
        setNewIpList(IpList ?? []);
        onOpenChange(false);
        setNewIp("");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogCloseFn = (e: any) => {
        e.preventDefault();
        if (!saveClicked && somethingEdited) {
            setConfirmDialogOpen(true);
        } else {
            setSaveClicked(false);
            onOpenChange(false);
            setNewIp("");
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    onInteractOutside={e => dialogCloseFn(e)}
                    onEscapeKeyDown={e => dialogCloseFn(e)}
                    onCloseAutoFocus={e => dialogCloseFn(e)}
                    disableOutsideClick
                    className="!max-w-[530px] !overflow-x-hidden !overflow-y-hidden bg-muted">
                    <DialogHeader>
                        <DialogTitle className="mb-4 w-full text-center">
                            {variant === "Blocked"
                                ? translate("resources.callbridge.mapping.sec_policy_edit.editingBlockedPolicy")
                                : translate("resources.callbridge.mapping.sec_policy_edit.editingAllowedPolicy")}
                        </DialogTitle>
                        <DialogDescription />
                    </DialogHeader>

                    <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="max-h-52 overflow-auto">
                                {newIpList?.length > 0 ? (
                                    newIpList.map((el, i) => {
                                        return (
                                            <div
                                                key={el}
                                                className={cn(
                                                    "flex items-center justify-between p-2",
                                                    i % 2
                                                        ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                        : "bg-neutral-0 dark:bg-neutral-100"
                                                )}>
                                                <span> {el}</span>
                                                <TrashButton className="h-4 w-4" onClick={() => deleteIp(el)} />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex justify-center">
                                        {translate("resources.callbridge.mapping.sec_policy_edit.noIps")}
                                    </div>
                                )}
                                <div ref={containerEndRef} />
                            </div>
                            <Input
                                value={newIp}
                                onChange={handleInputChange}
                                ref={inputRef}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div>
                            <div className="grid grid-cols-1 items-center justify-center gap-2 sm:grid-cols-2">
                                <Button
                                    className="flex w-full gap-2 sm:w-auto"
                                    onClick={addIp}
                                    variant={"default"}
                                    disabled={saveButtonDisabled || !deleteButtonDisabled}>
                                    <PlusCircle className="h-4 w-4" />
                                    {translate("resources.callbridge.mapping.sec_policy_edit.addIp")}
                                </Button>
                                <Button
                                    disabled={deleteButtonDisabled}
                                    className="flex w-full gap-2 sm:w-auto"
                                    onClick={() => deleteIp()}
                                    variant={deleteButtonDisabled ? "default" : "alert"}>
                                    <MinusCircle className="h-4 w-4" />
                                    {translate("resources.callbridge.mapping.sec_policy_edit.deleteIp")}
                                </Button>
                                <Button
                                    className="w-full flex-1 sm:w-auto"
                                    onClick={onSave}
                                    disabled={saveButtonDisabled || !somethingEdited}>
                                    {translate("app.ui.actions.save")}
                                </Button>
                                <Button
                                    className="w-full flex-1 sm:w-auto"
                                    variant={"alert"}
                                    onClick={dialogCloseFn}
                                    disabled={saveButtonDisabled}>
                                    {translate("app.ui.actions.close")}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter></DialogFooter>
                </DialogContent>
            </Dialog>
            <ConfirmCloseDialog
                onOpenChange={setConfirmDialogOpen}
                onSave={onSave}
                open={confirmDialogOpen}
                onClose={onCloseFn}
            />
        </>
    );
};
