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

export interface EditBlockedIPsDialogProps {
    id: string;
    IpList: string[] | undefined;
    open: boolean;
    onOpenChange: (state: boolean) => void;
    variant: "Blocked" | "Allowed";
}

const isValidIP = (ip: string) => {
    const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    return regex.test(ip);
};

export const EditIPsDialog = (props: EditBlockedIPsDialogProps) => {
    const { open, id, IpList, variant, onOpenChange } = props;

    const [newIpList, setNewIpList] = useState<string[]>([]);

    const [newIp, setNewIp] = useState("");
    const [saveClicked, setSaveClicked] = useState(false);
    const [somethingEdited, setSomethingEdited] = useState(false);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

    const refresh = useRefresh();

    const appToast = useAppToast();
    const dataProvider = useDataProvider();
    const containerEndRef = useRef<HTMLDivElement>(null);

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
    }, [IpList]);

    const translate = useTranslate();

    const addIp = () => {
        setSomethingEdited(true);
        setSaveButtonDisabled(true);
        if (!isValidIP(newIp)) {
            appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.wrongFormatOfIp"));
        } else if (newIpList.includes(newIp)) {
            appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.alreadyExists"));
        } else {
            setNewIpList([...newIpList, newIp]);
            appToast("success", translate("resources.callbridge.mapping.sec_policy_edit.addedSuccessfully"));
            setNewIp("");
        }

        setSaveButtonDisabled(false);
    };

    const deleteIp = (val?: string) => {
        setSomethingEdited(true);
        setSaveButtonDisabled(true);

        if (val) {
            setNewIpList(prev => prev.filter(el => el !== val));
        } else {
            if (!isValidIP(newIp)) {
                appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.wrongFormatOfIp"));
            } else if (!newIpList.includes(newIp)) {
                appToast("error", translate("resources.callbridge.mapping.sec_policy_edit.errors.notExist"));
            } else {
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
            return;
        }

        try {
            const data: CallbackMappingUpdate =
                variant === "Blocked"
                    ? {
                          security_policy: { blocked_ips: newIpList }
                      }
                    : {
                          security_policy: { allowed_ips: newIpList }
                      };

            await dataProvider.update("callbridge/v1/mapping", {
                data,
                id,
                previousData: undefined
            });

            refresh();
            appToast("success", translate("app.ui.toast.success"));
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.edit.editError"));
        } finally {
            onOpenChange(false);
            setSaveButtonDisabled(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    onInteractOutside={e => {
                        e.preventDefault();
                        if (!saveClicked && somethingEdited) onSave();
                        onOpenChange(false);
                    }}
                    onCloseAutoFocus={e => {
                        e.preventDefault();
                        if (!saveClicked && somethingEdited) onSave();
                        onOpenChange(false);
                    }}
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
                                {newIpList.length > 0 ? (
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
                            <Input value={newIp} onChange={e => setNewIp(e.target.value)} />
                        </div>
                        <div>
                            <div className="flex w-full flex-wrap items-center justify-center gap-2">
                                <Button
                                    className="flex w-full gap-2 sm:w-auto"
                                    onClick={addIp}
                                    variant={"default"}
                                    disabled={saveButtonDisabled}>
                                    <PlusCircle className="h-4 w-4" />
                                    {translate("resources.callbridge.mapping.sec_policy_edit.addIp")}
                                </Button>
                                <Button
                                    disabled={saveButtonDisabled}
                                    className="flex w-full gap-2 sm:w-auto"
                                    onClick={() => deleteIp()}
                                    variant={"alert"}>
                                    <MinusCircle className="h-4 w-4" />
                                    {translate("resources.callbridge.mapping.sec_policy_edit.deleteIp")}
                                </Button>
                                <Button
                                    className="w-full flex-1 sm:w-auto"
                                    onClick={onSave}
                                    disabled={saveButtonDisabled}>
                                    {translate("app.ui.actions.save")}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
