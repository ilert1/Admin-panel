import { useRefresh, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { useCallback, useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { IProvider, ProvidersDataProvider } from "@/data/providers";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { DeleteProviderDialog } from "./DeleteProviderDialog";
import { EditProviderDialog } from "./EditProviderDialog";
import { ProviderMethodsShow } from "./ProviderMethods";
import { useFetchDictionaries } from "@/hooks";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { CallbridgeHistoryTechnicalInfoShow } from "../CallbridgeHistory/CallbridgeHistoryTechnicalInfoShow";
import { EditIPsDialog } from "../Mapping/EditIPsDialog";
import { SimpleTable } from "../../shared";
import { ColumnDef } from "@tanstack/react-table";
import {
    ProviderUpdate,
    SecurityPolicyConfigAllowedIpsItem,
    SecurityPolicyConfigBlockedIpsItem
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TableTypes } from "../../shared/SimpleTable";
import clsx from "clsx";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { EditProviderSecPolicy } from "./EditProviderSecPolicy";

export interface ProviderShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const ProviderShow = ({ id, onOpenChange }: ProviderShowProps) => {
    const context = useAbortableShowController<IProvider>({ resource: "provider", id });
    const data = useFetchDictionaries();
    const dataProvider = new ProvidersDataProvider();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const translate = useTranslate();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editSecPolicyClicked, setEditSecPolicyClicked] = useState(false);

    const [buttonsDisabled, setButtonsDisabled] = useState(false);
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

    const handleConfirmClicked = async () => {
        if (buttonsDisabled) return;
        setButtonsDisabled(true);

        try {
            const data: ProviderUpdate = {
                settings: {
                    callback: {
                        security_policy: {
                            blocked: currentStateReversed
                        },
                        adapter_nats_subject: context.record?.settings?.callback?.adapter_nats_subject ?? "",
                        callback_nats_queue: context.record?.settings?.callback?.callback_nats_queue ?? ""
                    }
                }
            };

            await dataProvider.update("callbridge/v1/mapping", {
                data,
                id,
                previousData: undefined
            });
            refresh();
            if (sec_policy?.blocked) {
                appToast(
                    "success",
                    translate("resources.callbridge.mapping.statusActivatedSuccessfully", {
                        mappingName: "aa"
                    })
                );
            } else {
                appToast(
                    "success",
                    translate("resources.callbridge.mapping.statusDeactivatedSuccessfully", {
                        mappingName: "aa"
                    })
                );
            }
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            setButtonsDisabled(false);
        }
    };

    const handleDeleteClicked = useCallback(() => {
        setDeleteDialogOpen(prev => !prev);
    }, []);

    const handleEditClicked = useCallback(() => {
        setEditDialogOpen(prev => !prev);
    }, []);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    const callback = context.record.settings?.callback;
    const sec_policy = callback?.security_policy;
    const delivery_policy = callback?.delivery_policy;
    const retryPolicy = delivery_policy?.retry_policy;
    const currentStateReversed = !sec_policy?.blocked;

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div>
                <span className="text-title-1 text-neutral-90 dark:text-neutral-0">{context.record.name}</span>
                <TextField text={context.record.id} copyValue className="text-neutral-70 dark:text-neutral-30" />
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-[24px]">
                    <TextField
                        label={translate("resources.provider.fields.pk")}
                        text={context.record.public_key || ""}
                        copyValue
                        lineClamp
                        linesCount={1}
                    />

                    <TextField
                        label={translate("resources.provider.fields.json_schema")}
                        text={
                            context.record.fields_json_schema
                                ? String(context.record.fields_json_schema).length > 30
                                    ? String(context.record.fields_json_schema).substring(0, 30) + "..."
                                    : context.record.fields_json_schema
                                : ""
                        }
                    />
                    <TextField
                        label={translate("resources.callbridge.mapping.fields.nats_subject")}
                        text={callback?.adapter_nats_subject ?? ""}
                        copyValue
                    />

                    <TextField
                        label={translate("resources.provider.fields.callback_nats_queue")}
                        text={callback?.callback_nats_queue ?? ""}
                        copyValue
                    />

                    <div className="flex flex-col">
                        <small className="mb-0.5 text-sm text-neutral-60">
                            {translate("resources.paymentSettings.financialInstitution.fields.payment_types")}
                        </small>

                        <div className="max-w-auto flex flex-wrap gap-2">
                            {context.record.payment_types && context.record.payment_types?.length > 0 ? (
                                context.record.payment_types.map(pt => {
                                    return <PaymentTypeIcon key={pt.code} type={pt.code} className="h-7 w-7" />;
                                })
                            ) : (
                                <span className="title-1">-</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button className="" onClick={handleEditClicked}>
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button className="" onClick={handleDeleteClicked} variant={"outline_gray"}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>

                <div className="mt-5 border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:mt-10 md:pt-10">
                    <div>
                        <div className="flex flex-col justify-between sm:flex-row">
                            <h3 className="mb-2 text-display-3 text-neutral-90 dark:text-neutral-0 md:mb-4">
                                {translate("resources.callbridge.mapping.fields.delivery_policy.name")}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.delivery_policy.strategy")}
                                text={
                                    delivery_policy?.strategy
                                        ? translate(
                                              "resources.callbridge.mapping.fields.delivery_policy.strategies." +
                                                  delivery_policy?.strategy
                                          )
                                        : ""
                                }
                            />
                            <TextField
                                label={translate(
                                    "resources.callbridge.mapping.fields.delivery_policy.timeout_config.rpc_timeout"
                                )}
                                text={String(delivery_policy?.timeout_config?.rpc_timeout)}
                            />
                            <TextField
                                label={translate(
                                    "resources.callbridge.mapping.fields.delivery_policy.timeout_config.async_timeout"
                                )}
                                text={String(delivery_policy?.timeout_config?.async_timeout)}
                            />
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col gap-2 border-t-[1px] border-neutral-50 pt-5 dark:border-neutral-80 md:mt-5 md:pt-5">
                        <div className="flex flex-col justify-between sm:flex-row">
                            <h4 className="mb-2 text-display-4 text-neutral-90 dark:text-neutral-0 md:mb-4">
                                {translate("resources.callbridge.mapping.fields.retry_policy")}
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.state")}
                                text={
                                    delivery_policy?.retry_policy?.enabled
                                        ? translate("resources.callbridge.mapping.fields.active")
                                        : translate("resources.callbridge.mapping.fields.disabled")
                                }
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.base_delay")}
                                text={retryPolicy?.base_delay ? String(retryPolicy.base_delay) : ""}
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.max_attempts")}
                                text={retryPolicy?.max_attempts ? String(retryPolicy.max_attempts) : ""}
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.strategy")}
                                text={translate(
                                    "resources.callbridge.mapping.fields.strategies." +
                                        delivery_policy?.retry_policy?.strategy
                                )}
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.backoff_multiplier")}
                                text={String(delivery_policy?.retry_policy?.backoff_multiplier)}
                            />
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col gap-2 border-t-[1px] border-neutral-50 pt-5 dark:border-neutral-80 md:mt-5 md:pt-5">
                        <div className="flex flex-col justify-between sm:flex-row">
                            <h4 className="mb-2 text-display-4 text-neutral-90 dark:text-neutral-0 md:mb-4">
                                {translate("resources.callbridge.mapping.fields.delivery_policy.response_policy.name") +
                                    " (" +
                                    translate(
                                        "resources.callbridge.mapping.fields.delivery_policy.response_policy.type"
                                    ) +
                                    ": " +
                                    translate(
                                        "resources.callbridge.mapping.fields.delivery_policy.response_policy.types." +
                                            delivery_policy?.response_policy?.type
                                    ) +
                                    ")"}
                            </h4>
                        </div>
                        <div>
                            <CallbridgeHistoryTechnicalInfoShow
                                label={translate(
                                    "resources.callbridge.mapping.fields.delivery_policy.response_policy.template"
                                )}
                                technicalInfo={{
                                    response_headers: delivery_policy?.response_policy?.template?.headers ?? {}
                                }}
                                bodies={{
                                    response_body: delivery_policy?.response_policy?.template?.body ?? "{}"
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-5 border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:mt-10 md:pt-10">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div className="mb-2 flex flex-col items-center justify-start gap-2 sm:mb-4 sm:flex-row">
                                <h3 className="flex-2 !min-w-72 text-display-3 text-neutral-90 dark:text-neutral-0">
                                    {translate("resources.callbridge.mapping.fields.security_policy")}
                                </h3>
                                <div>
                                    {/* <TextField label={translate("resources.callbridge.mapping.fields.state")} text=" " /> */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={buttonsDisabled}
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
                                                sec_policy?.blocked
                                                    ? translate("resources.callbridge.mapping.fields.blocked")
                                                    : translate("resources.callbridge.mapping.fields.permitted")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditSecPolicyClicked(true);
                                }}>
                                {translate("app.ui.actions.edit")}
                            </Button>
                        </div>
                        <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.rate_limit")}
                                text={sec_policy?.rate_limit ? String(sec_policy?.rate_limit) : ""}
                            />
                            <TextField
                                label={translate("resources.callbridge.mapping.fields.enforcement_mode")}
                                text={
                                    sec_policy?.enforcement_mode
                                        ? translate(
                                              "resources.callbridge.mapping.fields.enforcement_modes." +
                                                  sec_policy?.enforcement_mode
                                          )
                                        : ""
                                }
                            />
                        </div>
                        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-1/2">
                            <div className="flex w-full flex-col">
                                <SimpleTable
                                    data={sec_policy?.blocked_ips ?? []}
                                    columns={blockedIPColumn}
                                    tableType={TableTypes.COLORED}
                                    className="max-h-96 overflow-auto overflow-x-hidden"
                                />
                                <Button
                                    onClick={() => {
                                        setEditBlockedIPsClicked(true);
                                    }}>
                                    {/* {translate("resources.callbridge.mapping.fields.blackListEdit")} */}
                                    Изменить
                                </Button>
                            </div>

                            <div className="flex w-full flex-col">
                                <SimpleTable
                                    data={sec_policy?.allowed_ips ?? []}
                                    columns={allowedIPColumn}
                                    tableType={TableTypes.COLORED}
                                    className="max-h-96 overflow-auto overflow-x-hidden"
                                />
                                <Button
                                    onClick={() => {
                                        setEditAllowedIPsClicked(true);
                                    }}>
                                    {/* {translate("resources.callbridge.mapping.fields.whiteListEdit")} */}
                                    Изменить
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:mt-10 md:pt-10">
                    <ProviderMethodsShow
                        providerId={id}
                        methods={context.record.methods}
                        isFetching={context.isFetching}
                    />
                </div>
            </div>

            <DeleteProviderDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />

            <EditProviderDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={id} />

            <EditIPsDialog
                IpList={sec_policy?.blocked_ips}
                secondaryList={sec_policy?.allowed_ips}
                id={context.record.id}
                onOpenChange={setEditBlockedIPsClicked}
                open={editBlockedIPsClicked}
                variant="Blocked"
                resource="provider"
                adapter_nats_subject={callback?.adapter_nats_subject}
                callback_nats_queue={callback?.callback_nats_queue}
            />

            <EditIPsDialog
                IpList={sec_policy?.allowed_ips}
                secondaryList={sec_policy?.blocked_ips}
                id={context.record.id}
                onOpenChange={setEditAllowedIPsClicked}
                open={editAllowedIPsClicked}
                variant="Allowed"
                resource="provider"
                adapter_nats_subject={callback?.adapter_nats_subject}
                callback_nats_queue={callback?.callback_nats_queue}
            />
            <EditProviderSecPolicy id={id} onOpenChange={setEditSecPolicyClicked} open={editSecPolicyClicked} />
        </div>
    );
};
