import { MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Badge } from "@/components/ui/badge";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantData } from "@/hooks/useGetMerchantData";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, useTranslate } from "react-admin";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { countryCodes } from "../../components/Selects/CountrySelect";

export const useGetCascadeMerchantColumns = () => {
    const [locale] = useLocaleState();
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const { getMerchantId, isMerchantsLoading } = useGetMerchantData();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const columns: ColumnDef<MerchantCascadeSchema>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <TextField
                    text={row.original.id}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                    onClick={() => openSheet("cascadeMerchant", { id: row.original.id })}
                />
            )
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.merchant"),
            cell: ({ row }) => {
                const merchId = getMerchantId(row.original.merchant.id);

                return (
                    <div>
                        <TextField
                            text={row.original.merchant.name}
                            onClick={
                                merchId
                                    ? () =>
                                          openSheet("merchant", {
                                              id: row.original.merchant.id,
                                              merchantName: row.original.merchant.name
                                          })
                                    : undefined
                            }
                        />
                        <TextField
                            className="text-neutral-70"
                            text={row.original.merchant.id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>
                );
            }
        },
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
                                id: row.original.cascade.id
                            });
                        }}>
                        {row.original.cascade.name}
                    </Button>
                    <TextField
                        className="text-neutral-70"
                        text={row.original.cascade.id}
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
            id: "cascade_type",
            accessorKey: "cascade_type",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.type"),
            cell: ({ row }) => (
                <TextField text={translate("resources.cascadeSettings.cascades.types." + row.original.cascade.type)} />
            )
        },
        {
            id: "source_currency",
            accessorKey: "source_currency",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.src_currency"),
            cell: ({ row }) => {
                const currency_code = row.original.cascade.src_currency.code;
                return currency_code ? <Badge variant="currency">{currency_code}</Badge> : <TextField text="" />;
            }
        },
        {
            id: "dst_country_code",
            accessorKey: "dst_country_code",
            header: translate("resources.direction.destinationCountry"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            countryCodes.find(item => item.alpha2 === row.original.cascade.dst_country_code)?.name || ""
                        }
                        wrap
                    />
                );
            }
        },
        {
            id: "cascade_kind",
            accessorKey: "cascade_kind",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.kind"),
            cell: ({ row }) => (
                <TextField
                    text={translate("resources.cascadeSettings.cascades.kinds." + row.original.cascade.cascade_kind)}
                />
            )
        },
        {
            id: "rank",
            accessorKey: "rank",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.rank"),
            cell: ({ row }) => <TextField text={String(row.original.cascade.priority_policy.rank)} />
        },
        {
            id: "payment_types",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.payment_types"),
            cell: ({ row }) => {
                const pt = row.original.cascade.payment_types;
                return (
                    <div className="max-w-auto flex min-w-[100px] flex-wrap gap-2">
                        {pt && pt.length > 0
                            ? pt?.map(pt => {
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
            id: "cascade_state",
            accessorKey: "cascade_state",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.cascade_state"),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.cascade.state === "active" && (
                        <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.active")}
                        </span>
                    )}
                    {row.original.cascade.state === "inactive" && (
                        <span className="whitespace-nowrap rounded-20 bg-red-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.inactive")}
                        </span>
                    )}
                </div>
            )
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.state"),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
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
                    {/* {row.original.state === "archived" && (
                        <span className="whitespace-nowrap rounded-20 bg-yellow-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.archived")}
                        </span>
                    )} */}
                </div>
            )
        },
        {
            accessorKey: "created_at",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap text-neutral-70">
                        {new Date(row.original.created_at).toLocaleTimeString(locale)}
                    </p>
                </>
            )
        },
        {
            id: "updated_at",
            accessorKey: "updated_at",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.updated_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.updated_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap text-neutral-70">
                        {new Date(row.original.updated_at).toLocaleTimeString(locale)}
                    </p>
                </>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("cascadeMerchant", { id: row.original.id });
                        }}
                    />
                );
            }
        }
    ];

    return {
        createDialogOpen,
        isMerchantsLoading,
        setCreateDialogOpen,
        columns
    };
};
