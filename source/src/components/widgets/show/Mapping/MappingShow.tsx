import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";

import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { EditMappingDialog } from "./EditMappingDialog";
import { useState } from "react";
import {
    SecurityPolicyConfigAllowedIpsItem,
    SecurityPolicyConfigBlockedIpsItem,
    CallbackMappingRead,
    CallbackMappingUpdate
} from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { EditRetryStatusDialog } from "./EditRetryStatusDialog";
import { EditIPsDialog } from "./EditIPsDialog";
import clsx from "clsx";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useFetchDictionaries } from "@/hooks";

interface MappingShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
    externalData?: CallbackMappingRead;
}

export const MappingShow = (props: MappingShowProps) => {
    const { id, onOpenChange, externalData } = props;
    const translate = useTranslate();
    const data = useFetchDictionaries();
    const appToast = useAppToast();
    const dataProvider = useDataProvider();
    const refresh = useRefresh();

    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const [editMappingClicked, setEditMappingClicked] = useState(false);
    const [editRetryStatusClicked, setEditRetryStatusClicked] = useState(false);
    const [editAllowedIPsClicked, setEditAllowedIPsClicked] = useState(false);
    const [editBlockedIPsClicked, setEditBlockedIPsClicked] = useState(false);

    const allowedIPColumn: ColumnDef<SecurityPolicyConfigAllowedIpsItem>[] = [
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: () => (
                <div className="flex items-center justify-center">
                    {translate("resources.callbridge.mapping.fields.allowed_ips")}
                </div>
            ),
            cell: ({ row }) => {
                return <div className="text-center">{row.original}</div>;
            }
        }
    ];

    const blockedIPColumn: ColumnDef<SecurityPolicyConfigBlockedIpsItem>[] = [
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: () => (
                <div className="flex items-center justify-center">
                    {translate("resources.callbridge.mapping.fields.blocked_ips")}
                </div>
            ),
            cell: ({ row }) => {
                return <div className="text-center">{row.original}</div>;
            }
        }
    ];

    const context = useAbortableShowController<CallbackMappingRead>({
        resource: "callbridge/v1/mapping",
        id,
        queryOptions: {
            onError: () => {
                if (!externalData) {
                    appToast("error", translate("Mapping not found"));
                    onOpenChange(false);
                }
            }
        }
    });

    // Use externalData if provided, otherwise fall back to context.record

    const record = externalData || context.record;

    if (((context.isLoading || !context.record) && !externalData) || !data) {
        return <Loading />;
    }

    if (!record) {
        return <Loading />;
    }

    const currentStateReversed = !record.security_policy?.blocked;

    const handleConfirmClicked = async () => {
        if (buttonsDisabled) return;
        setButtonsDisabled(true);

        try {
            const data: CallbackMappingUpdate = { security_policy: { blocked: currentStateReversed } };

            await dataProvider.update("callbridge/v1/mapping", {
                data,
                id,
                previousData: undefined
            });
            refresh();
            if (record.security_policy?.blocked) {
                appToast(
                    "success",
                    translate("resources.callbridge.mapping.statusActivatedSuccessfully", {
                        mappingName: record.name
                    })
                );
            } else {
                appToast(
                    "success",
                    translate("resources.callbridge.mapping.statusDeactivatedSuccessfully", {
                        mappingName: record.name
                    })
                );
            }
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            setButtonsDisabled(false);
        }
    };

    const burst_limit = record.security_policy?.burst_limit;
    const base_delay = record.retry_policy?.base_delay;
    const max_attempts = record.retry_policy?.max_attempts;
    const controlsDisabled = !context.record && !!externalData;

    return (
        <>
            <div className="flex h-full min-h-[300px] flex-col overflow-auto pt-0">
                <div className="px-4 md:px-[42px]">
                    <div className="flex flex-col gap-1 md:gap-4">
                        <div className="flex flex-col justify-between sm:flex-row">
                            <div className="mb-2 md:mb-4">
                                <TextField text={record.name} className="!text-display-2" />
                                <TextField text={record.id} copyValue />
                            </div>
                            <Button disabled={controlsDisabled} onClick={() => setEditMappingClicked(true)}>
                                {translate("app.ui.actions.edit")}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.ext_path")}
                                text={record.external_path}
                                copyValue
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.callback_url")}
                                text={record.callback_url}
                                copyValue
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.int_path")}
                                text={record.internal_path ?? ""}
                                copyValue
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.nats_subject")}
                                text={record.adapter_nats_subject ?? ""}
                                copyValue
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.created_at")}
                                text={new Date(record.created_at).toLocaleDateString()}
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.description")}
                                text={record.description ?? ""}
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.updated_at")}
                                text={new Date(record.updated_at).toLocaleDateString()}
                            />
                        </div>
                        <div className="mt-5 border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:mt-10 md:pt-10">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col justify-between sm:flex-row">
                                    <h3 className="mb-2 text-display-3 text-neutral-90 dark:text-neutral-0 md:mb-4">
                                        {translate("resources.callbridge.mapping.fields.retry_policy")}
                                    </h3>
                                    <Button
                                        disabled={controlsDisabled}
                                        onClick={() => {
                                            setEditRetryStatusClicked(true);
                                        }}>
                                        {translate("resources.callbridge.mapping.fields.retryStatusChange")}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.state")}
                                        text={
                                            record.retry_policy?.enabled
                                                ? translate("resources.callbridge.mapping.fields.active")
                                                : translate("resources.callbridge.mapping.fields.disabled")
                                        }
                                    />
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.base_delay")}
                                        text={base_delay ? String(record.retry_policy?.base_delay) : ""}
                                    />
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.max_attempts")}
                                        text={max_attempts ? String(record.retry_policy?.max_attempts) : ""}
                                    />
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.strategy")}
                                        text={record.retry_policy?.strategy ?? ""}
                                    />
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.retryOn")}
                                        text={record.retry_policy?.retry_on_status?.join(", ") ?? ""}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:mt-10 md:pt-10">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col justify-between sm:flex-row">
                                    <h3 className="flex-2 mb-2 !min-w-72 flex-grow text-display-3 text-neutral-90 dark:text-neutral-0 md:mb-4">
                                        {translate("resources.callbridge.mapping.fields.security_policy")}
                                    </h3>

                                    <div className="flex flex-col flex-wrap gap-2 md:flex-row">
                                        <Button
                                            disabled={controlsDisabled}
                                            onClick={() => {
                                                setEditBlockedIPsClicked(true);
                                            }}>
                                            {translate("resources.callbridge.mapping.fields.blackListEdit")}
                                        </Button>
                                        <Button
                                            disabled={controlsDisabled}
                                            onClick={() => {
                                                setEditAllowedIPsClicked(true);
                                            }}>
                                            {translate("resources.callbridge.mapping.fields.whiteListEdit")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <TextField
                                            label={translate("resources.callbridge.mapping.fields.state")}
                                            text=" "
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={buttonsDisabled || controlsDisabled}
                                                onClick={handleConfirmClicked}
                                                className={clsx(
                                                    "flex h-[27px] w-[50px] cursor-pointer items-center rounded-20 border-none p-0.5 outline-none transition-colors disabled:grayscale",
                                                    currentStateReversed ? "bg-green-50" : "bg-red-40"
                                                )}>
                                                <span
                                                    className={clsx(
                                                        "flex h-[23px] w-[23px] items-center justify-center rounded-full bg-white p-1 transition-transform",
                                                        currentStateReversed ? "translate-x-full" : "translate-x-0"
                                                    )}>
                                                    {currentStateReversed ? (
                                                        <LockKeyholeOpen className="h-[15px] w-[15px] text-green-50" />
                                                    ) : (
                                                        <LockKeyhole className="h-[15px] w-[15px] text-red-40" />
                                                    )}
                                                </span>
                                            </button>
                                            <TextField
                                                text={
                                                    record.security_policy?.blocked
                                                        ? translate("resources.callbridge.mapping.fields.blocked")
                                                        : translate("resources.callbridge.mapping.fields.permitted")
                                                }
                                            />
                                        </div>
                                    </div>
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.auth")}
                                        text={
                                            record.security_policy?.auth_required
                                                ? translate("resources.callbridge.mapping.fields.auth_required")
                                                : translate("resources.callbridge.mapping.fields.auth_not_required")
                                        }
                                    />
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.burst_limit")}
                                        text={burst_limit ? String(burst_limit) : ""}
                                    />
                                    <TextField
                                        label={translate("resources.callbridge.mapping.fields.strategy")}
                                        text={record.security_policy?.enforcement_mode ?? ""}
                                    />
                                </div>
                                <div className="flex w-full flex-col gap-2 sm:flex-row md:w-1/2">
                                    <div className="w-full">
                                        <SimpleTable
                                            data={record.security_policy?.blocked_ips ?? []}
                                            columns={blockedIPColumn}
                                            tableType={TableTypes.COLORED}
                                            className="max-h-96 overflow-auto overflow-x-hidden"
                                        />
                                    </div>

                                    <div className="w-full">
                                        <SimpleTable
                                            data={record.security_policy?.allowed_ips ?? []}
                                            columns={allowedIPColumn}
                                            tableType={TableTypes.COLORED}
                                            className="max-h-96 overflow-auto overflow-x-hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditMappingDialog id={id} open={editMappingClicked} onOpenChange={setEditMappingClicked} />
            <EditRetryStatusDialog
                id={id}
                open={editRetryStatusClicked}
                onOpenChange={setEditRetryStatusClicked}
                oldStatuses={record.retry_policy?.retry_on_status}
            />

            <EditIPsDialog
                IpList={record.security_policy?.blocked_ips}
                secondaryList={record.security_policy?.allowed_ips}
                id={record.id}
                onOpenChange={setEditBlockedIPsClicked}
                open={editBlockedIPsClicked}
                variant="Blocked"
            />

            <EditIPsDialog
                IpList={record.security_policy?.allowed_ips}
                secondaryList={record.security_policy?.blocked_ips}
                id={record.id}
                onOpenChange={setEditAllowedIPsClicked}
                open={editAllowedIPsClicked}
                variant="Allowed"
            />
        </>
    );
};
