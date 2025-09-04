import { Direction, CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { CurrencyWithId } from "@/data/currencies";
import { IProvider } from "@/data/providers";
import { ColumnDef } from "@tanstack/react-table";
import { useRefresh, useTranslate } from "react-admin";
import { DirectionActivityBtn } from "../../lists/Directions/DirectionActivityBtn";
import makeSafeSpacesInBrackets from "@/helpers/makeSafeSpacesInBrackets";
import { Badge } from "@/components/ui/badge";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { useState } from "react";
import { DeleteCascadeDialog } from "../Cascade/DeleteCascadeDialog";

export const useGetMerchantShowColumns = ({ isFetching = false }: { isFetching?: boolean }) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const { openSheet } = useSheets();

    const [deleteCascadeDialogOpen, setDeleteCascadeDialogOpen] = useState(false);

    const directionColumns: ColumnDef<Direction>[] = [
        {
            id: "name",
            header: translate("resources.direction.fields.name"),
            cell: ({ row }) => {
                return (
                    <div>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("direction", { id: row.original.id });
                            }}
                            className="whitespace-break-spaces text-left">
                            {row.original.name ? makeSafeSpacesInBrackets(row.original.name) : ""}
                        </Button>
                        <TextField
                            text={row.original.id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                            className="text-neutral-70"
                        />
                    </div>
                );
            }
        },
        {
            id: "account_id",
            accessorKey: "account_id",
            header: translate("resources.direction.fields.accountNumber"),
            cell: ({ row }) => {
                return <TextField text={row.original.account_id || ""} wrap copyValue />;
            }
        },
        {
            id: "src_currency",
            accessorKey: "src_currency",
            header: translate("resources.direction.fields.srcCurr"),
            cell: ({ row }) => {
                const obj: CurrencyWithId = row.getValue("src_currency");
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        <Badge variant="currency">{obj.code}</Badge>
                    </div>
                );
            }
        },
        {
            id: "dst_currency",
            accessorKey: "dst_currency",
            header: translate("resources.direction.fields.destCurr"),
            cell: ({ row }) => {
                const obj: CurrencyWithId = row.getValue("dst_currency");
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        <Badge variant="currency">{obj.code}</Badge>
                    </div>
                );
            }
        },
        {
            id: "type",
            header: () => (
                <div className="flex items-center justify-center">{translate("resources.direction.types.type")}</div>
            ),
            cell: ({ row }) => {
                const type = row.original.type;
                return type ? translate(`resources.direction.types.${row.original.type}`) : "-";
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.direction.provider"),
            cell: ({ row }) => {
                const obj: IProvider = row.getValue("provider");
                return <TextField text={obj.name} wrap />;
            }
        },
        {
            id: "weight",
            accessorKey: "weight",
            header: translate("resources.direction.weight"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.weight)} wrap />;
            }
        },
        {
            id: "active",
            accessorKey: "active",
            header: () => {
                return <div className="text-center">{translate("resources.direction.fields.isActive")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <DirectionActivityBtn
                        id={row.original.id}
                        directionName={row.original.name}
                        activityState={row.original.state === "active"}
                        isFetching={isFetching}
                    />
                );
            }
        }
    ];

    const cascadeMerchantsColumns: ColumnDef<CascadeSchema>[] = [
        {
            id: "cascade",
            accessorKey: "cascade",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.cascade"),
            cell: ({ row }) => (
                <div>
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("cascade", {
                                id: row.original.id
                            });
                        }}>
                        {row.original.name}
                    </Button>
                    <TextField
                        className="text-neutral-70"
                        text={row.original.id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                </div>
            )
        },
        {
            accessorKey: "type",
            header: translate("resources.cascadeSettings.cascades.fields.type"),
            cell: ({ row }) => (
                <TextField
                    text={
                        row.original.type
                            ? translate(`resources.cascadeSettings.cascades.types.${row.original.type}`)
                            : ""
                    }
                    minWidth="50px"
                />
            )
        },
        {
            accessorKey: "src_currency_code",
            header: translate("resources.cascadeSettings.cascades.fields.src_currency_code"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.src_currency.code}</Badge>
                </div>
            )
        },
        {
            id: "dst_country_code",
            accessorKey: "dst_country_code",
            header: translate("resources.direction.destinationCountry"),
            cell: ({ row }) => {
                return <TextField text={row.original.dst_country_code ?? ""} wrap />;
            }
        },
        {
            accessorKey: "cascade_kind",
            header: translate("resources.cascadeSettings.cascades.fields.cascade_kind"),
            cell: ({ row }) => (
                <TextField
                    text={
                        row.original.cascade_kind
                            ? translate(`resources.cascadeSettings.cascades.kinds.${row.original.cascade_kind}`)
                            : ""
                    }
                    minWidth="50px"
                />
            )
        },
        {
            accessorKey: "priority_policy.rank",
            header: translate("resources.cascadeSettings.cascades.fields.rank"),
            cell: ({ row }) => <TextField text={row.original.priority_policy.rank.toString()} minWidth="50px" />
        },
        {
            id: "payment_types",
            header: translate("resources.cascadeSettings.cascades.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex min-w-32 flex-wrap gap-2">
                        {row.original.payment_types && row.original.payment_types.length > 0
                            ? row.original.payment_types?.map(pt => {
                                  return (
                                      <PaymentTypeIcon
                                          className="h-7 w-7"
                                          key={pt.code}
                                          type={pt.code}
                                          metaIcon={pt.meta?.["icon"]}
                                      />
                                  );
                              })
                            : "-"}
                    </div>
                );
            }
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascades.fields.state"),
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-white">
                    {row.original.state === "active" && (
                        <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.active")}
                        </span>
                    )}
                    {row.original.state === "inactive" && (
                        <span className="whitespace-nowrap rounded-20 bg-red-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.inactive")}
                        </span>
                    )}
                </div>
            )
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <>
                        <TrashButton onClick={() => setDeleteCascadeDialogOpen(true)} />

                        <DeleteCascadeDialog
                            open={deleteCascadeDialogOpen}
                            onOpenChange={state => {
                                refresh();
                                setDeleteCascadeDialogOpen(state);
                            }}
                            onQuickShowOpenChange={() => {}}
                            id={row.original.id}
                        />
                    </>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("cascade", { id: row.original.id });
                        }}
                    />
                );
            }
        }
    ];
    return { directionColumns, cascadeMerchantsColumns };
};
