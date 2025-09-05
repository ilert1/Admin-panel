import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Badge } from "@/components/ui/badge";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ListControllerResult, useDataProvider, useTranslate } from "react-admin";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { CurrentCell } from "../../shared";
import { StatesTableEditableCell } from "../../shared/StatesTableEditableCell";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CASCADE_STATE } from "@/data/cascades";

export const useGetCascadeColumns = ({ listContext }: { listContext: ListControllerResult<CascadeSchema> }) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();

    const handleCascadeShowOpen = (id: string) => {
        openSheet("cascade", { id });
    };

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isDataUpdating, setIsDataUpdating] = useState(false);
    const [currentCellEdit, setCurrentCellEdit] = useState<CurrentCell>({
        row: undefined,
        column: undefined
    });

    const onSubmit = async (id: string, data: Pick<CascadeSchema, "state">) => {
        try {
            setIsDataUpdating(true);

            await dataProvider.update("cascades", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            await listContext.refetch();

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

    const columns: ColumnDef<CascadeSchema>[] = [
        {
            accessorKey: "name",
            header: translate("resources.cascadeSettings.cascades.fields.cascade"),
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
                            (currentCellBoolean && listContext.isFetching) || (currentCellBoolean && isDataUpdating)
                        }
                        editDisabled={listContext.isFetching || isDataUpdating}
                    />
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => handleCascadeShowOpen(row.original.id)} />;
            }
        }
    ];
    return {
        createDialogOpen,
        setCreateDialogOpen,
        columns
    };
};
