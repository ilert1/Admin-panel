import { Direction, MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { CurrencyWithId } from "@/data/currencies";
import { IProvider } from "@/data/providers";
import { ColumnDef } from "@tanstack/react-table";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { DirectionActivityBtn } from "../../lists/Directions/DirectionActivityBtn";
import makeSafeSpacesInBrackets from "@/helpers/makeSafeSpacesInBrackets";
import { Badge } from "@/components/ui/badge";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { useState } from "react";
import { StatesTableEditableCell } from "../../shared/StatesTableEditableCell";
import { CASCADE_STATE } from "@/data/cascades";
import { CurrentCell } from "../../shared";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { DeleteCascadeMerchantDialog } from "../CascadeMerchant/DeleteCascadeMerchantDialog";
import { CountryTextField } from "../../components/CountryTextField";
import { useCountryCodes } from "@/hooks";

export const useGetMerchantShowColumns = ({
    isFetchingMerchantData = false,
    isFetchingCascadeMerchantData
}: {
    isFetchingMerchantData: boolean;
    isFetchingCascadeMerchantData: boolean;
}) => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();
    const { countryCodesWithFlag } = useCountryCodes();

    const [deleteCascadeMerchantDialogOpen, setDeleteCascadeMerchantDialogOpen] = useState(false);
    const [isDataUpdating, setIsDataUpdating] = useState(false);
    const [currentCellEdit, setCurrentCellEdit] = useState<CurrentCell>({
        row: undefined,
        column: undefined
    });

    const onSubmit = async (id: string, data: Pick<MerchantCascadeSchema, "state">) => {
        try {
            setIsDataUpdating(true);

            await dataProvider.update("cascadeMerchants", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            refresh();

            setCurrentCellEdit({
                row: undefined,
                column: undefined
            });
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setIsDataUpdating(false);
        }
    };

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
                        isFetching={isFetchingMerchantData}
                    />
                );
            }
        }
    ];

    const cascadeMerchantsColumns: ColumnDef<MerchantCascadeSchema>[] = [
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
                                id: row.original.cascade_id
                            });
                        }}>
                        {row.original.cascade.name}
                    </Button>
                    <TextField
                        className="text-neutral-70"
                        text={row.original.cascade_id}
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
                        row.original.cascade.type
                            ? translate(`resources.cascadeSettings.cascades.types.${row.original.cascade.type}`)
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
                    <Badge variant="currency">{row.original.cascade.src_currency.code}</Badge>
                </div>
            )
        },
        {
            id: "dst_country_code",
            accessorKey: "dst_country_code",
            header: translate("resources.direction.destinationCountry"),
            cell: ({ row }) => {
                const dst_country = countryCodesWithFlag.find(
                    item => item.alpha2 === row.original.cascade.dst_country_code
                );

                return <CountryTextField text={dst_country?.name || ""} wrapText />;
            }
        },
        {
            accessorKey: "cascade_kind",
            header: translate("resources.cascadeSettings.cascades.fields.cascade_kind"),
            cell: ({ row }) => (
                <TextField
                    text={
                        row.original.cascade.cascade_kind
                            ? translate(`resources.cascadeSettings.cascades.kinds.${row.original.cascade.cascade_kind}`)
                            : ""
                    }
                    minWidth="50px"
                />
            )
        },
        {
            accessorKey: "priority_policy.rank",
            header: translate("resources.cascadeSettings.cascades.fields.rank"),
            cell: ({ row }) => <TextField text={row.original.cascade.priority_policy.rank.toString()} minWidth="50px" />
        },
        {
            id: "payment_types",
            header: translate("resources.cascadeSettings.cascades.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex min-w-32 flex-wrap gap-2">
                        {row.original.cascade.payment_types && row.original.cascade.payment_types.length > 0
                            ? row.original.cascade.payment_types?.map(pt => {
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
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <StatesTableEditableCell
                        cell={cell}
                        initValue={row.original.state}
                        selectVariants={CASCADE_STATE}
                        showEdit={currentCellBoolean}
                        setShowEdit={setCurrentCellEdit}
                        onSubmit={value => onSubmit(row.original.id, { state: value })}
                        isFetching={
                            (currentCellBoolean && isFetchingCascadeMerchantData) ||
                            (currentCellBoolean && isDataUpdating)
                        }
                        editDisabled={isFetchingCascadeMerchantData || isDataUpdating}
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
                    <>
                        <TrashButton onClick={() => setDeleteCascadeMerchantDialogOpen(true)} />

                        <DeleteCascadeMerchantDialog
                            open={deleteCascadeMerchantDialogOpen}
                            onOpenChange={setDeleteCascadeMerchantDialogOpen}
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
                            openSheet("cascadeMerchant", { id: row.original.id });
                        }}
                    />
                );
            }
        }
    ];
    return { directionColumns, cascadeMerchantsColumns };
};
