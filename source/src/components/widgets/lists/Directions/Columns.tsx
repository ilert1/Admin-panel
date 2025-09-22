import { Direction, MerchantSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantData } from "@/hooks/useGetMerchantData";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useTranslate } from "react-admin";
import { DirectionActivityBtn } from "./DirectionActivityBtn";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { Badge } from "@/components/ui/badge";
import makeSafeSpacesInBrackets from "@/helpers/makeSafeSpacesInBrackets";
import { CountryTextField } from "../../components/CountryTextField";
import { useCountryCodes } from "@/hooks";

export const useGetDirectionsColumns = ({ isFetching = false }: { isFetching?: boolean }) => {
    const translate = useTranslate();
    const { openSheet, closeSheet } = useSheets();
    const { getMerchantId, isMerchantsLoading } = useGetMerchantData();
    const { countryCodesWithFlag } = useCountryCodes();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");

    const onCloseSheet = () => {
        closeSheet("direction");
    };

    const handleDeleteClicked = useCallback((id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(prev => !prev);
    }, []);

    const handleDirectionShowOpen = (id: string) => {
        openSheet("direction", { id });
    };

    const handleTerminalShowOpen = (id: string) => {
        openSheet("terminal", {
            id
        });
    };

    const columns: ColumnDef<Direction>[] = [
        {
            id: "name",
            header: translate("resources.direction.fields.name"),
            cell: ({ row }) => {
                const isPrioritized = row.original.condition?.extra ?? false;

                return (
                    <div className="flex flex-col items-start justify-start">
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                handleDirectionShowOpen(row.original.id);
                            }}
                            className="whitespace-break-spaces text-left">
                            {row.original.name ? makeSafeSpacesInBrackets(row.original.name) : ""}
                        </Button>
                        {isPrioritized && (
                            <Badge variant={"prioritized"}>
                                {translate("resources.direction.fields.condition.prioritized")}
                            </Badge>
                        )}
                    </div>
                );
            }
        },
        {
            id: "src_currency",
            accessorKey: "src_currency",
            header: translate("resources.direction.fields.srcCurr"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.src_currency.code}</Badge>
                </div>
            )
        },
        {
            id: "dst_currency",
            accessorKey: "dst_currency",
            header: translate("resources.direction.fields.destCurr"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.dst_currency.code}</Badge>
                </div>
            )
        },
        {
            id: "dst_country_code",
            accessorKey: "dst_country_code",
            header: translate("resources.direction.destinationCountry"),
            cell: ({ row }) => {
                const dst_country = countryCodesWithFlag.find(item => item.alpha2 === row.original.dst_country_code);

                return <CountryTextField text={dst_country?.name || ""} />;
            }
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.direction.fields.merchant"),
            cell: ({ row }) => {
                const merchant: MerchantSchema = row.getValue("merchant");

                const merchId = getMerchantId(merchant.id);

                return (
                    <div>
                        <TextField
                            text={merchant.name ?? ""}
                            onClick={
                                merchId
                                    ? () =>
                                          openSheet("merchant", {
                                              id: merchant.id ?? "",
                                              merchantName: merchant.name
                                          })
                                    : undefined
                            }
                        />
                        <TextField
                            className="text-neutral-70"
                            text={merchant.id}
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
            accessorKey: "cascade_id",
            header: translate("resources.direction.fields.cascade"),
            cell: ({ row }) => {
                const cascadeId = row.original.cascade_id;

                return (
                    <div>
                        {/* <TextField
                            text={merchant.name ?? ""}
                            onClick={
                                merchId
                                    ? () =>
                                          openSheet("merchant", {
                                              id: merchant.id ?? "",
                                              merchantName: merchant.name
                                          })
                                    : undefined
                            }
                        /> */}
                        <TextField
                            className="text-neutral-70"
                            text={cascadeId ?? ""}
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
            id: "cascade kind",
            header: translate("resources.direction.fields.kinds.cascadeKind"),
            cell: ({ row }) => {
                const cascadeKind = row.original.cascade_kind;
                return <TextField text={cascadeKind ?? ""} />;
            }
        },
        {
            id: "weight",
            header: translate("resources.direction.fields.condition.rank"),
            cell: ({ row }) => {
                const weight = row.original.condition?.rank;
                return <TextField text={weight?.toString() ?? ""} />;
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.direction.provider"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("provider", {
                                id: row.original.provider.id as string
                            });
                        }}>
                        {row.original.provider.name}
                    </Button>
                );
            }
        },
        {
            id: "terminal",
            header: translate("resources.direction.fields.terminal"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            const id = row.original.terminal?.terminal_id ?? "";
                            handleTerminalShowOpen(id);
                        }}>
                        {row.original.terminal?.verbose_name ?? ""}
                    </Button>
                );
            }
        },
        {
            id: "weight",
            accessorKey: "weight",
            header: translate("resources.direction.weight")
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
            id: "payment_types",
            header: translate("resources.paymentSettings.paymentType.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex min-w-[100px] flex-wrap gap-2">
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
                        disabled={!!row.original.cascade_id}
                    />
                );
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <TrashButton
                        disabled={!!row.original.cascade_id}
                        onClick={() => handleDeleteClicked(row.original.id)}
                    />
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            handleDirectionShowOpen(row.original.id);
                        }}
                    />
                );
            }
        }
    ];
    return {
        columns,
        deleteDialogOpen,
        isMerchantsLoading,
        chosenId,
        setDeleteDialogOpen,
        onCloseSheet
    };
};
