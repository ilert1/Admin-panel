import { ColumnDef } from "@tanstack/react-table";
import { ListControllerResult, useTranslate } from "react-admin";
import { FinancialInstitution } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { EyeIcon } from "lucide-react";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";
import { CurrentCell, TableEditableCell } from "../../shared";
import { FinancialInstitutionProvider, FinancialInstitutionWithId } from "@/data/financialInstitution";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Badge } from "@/components/ui/badge";
import { BankIcon } from "@/components/ui/BankIcon";

export const useGetFinancialInstitutionColumns = ({
    listContext
}: {
    listContext: ListControllerResult<FinancialInstitutionWithId>;
}) => {
    const financialInstitutionProvider = new FinancialInstitutionProvider();

    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isDataUpdating, setIsDataUpdating] = useState(false);
    const [currentCellEdit, setCurrentCellEdit] = useState<CurrentCell>({
        row: undefined,
        column: undefined
    });

    const { data: financialInstitutionTypes } = useFetchFinancialInstitutionTypes();

    useEffect(() => {
        if (currentCellEdit.row || currentCellEdit.column) {
            setCurrentCellEdit({
                row: undefined,
                column: undefined
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listContext.filterValues]);

    const onSubmit = async (id: string, data: Pick<FinancialInstitutionWithId, "nspk_member_id">) => {
        try {
            setIsDataUpdating(true);

            if (data.nspk_member_id && data.nspk_member_id.length > 20) {
                appToast(
                    "error",
                    translate("resources.paymentSettings.financialInstitution.errors.nspk_member_id_max")
                );
                return;
            }

            await financialInstitutionProvider.update("financialInstitution", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            listContext.refetch();

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

    const columns: ColumnDef<FinancialInstitution>[] = [
        {
            id: "institution_type",
            accessorKey: "institution_type",
            header: translate("resources.paymentSettings.financialInstitution.fields.institution_type"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.original.institution_type
                                ? financialInstitutionTypes?.find(type => type.value === row.original.institution_type)
                                      ?.label || ""
                                : ""
                        }
                    />
                );
            }
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.paymentSettings.financialInstitution.fields.name"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("financialInstitution", {
                                    id: row.original.code
                                });
                            }}>
                            {row.original.name}
                        </Button>
                        {typeof row.original.meta?.logoURL === "string" && (
                            <BankIcon logoURL={row.original.meta?.logoURL} />
                        )}
                    </div>
                );
            }
        },
        {
            id: "code",
            accessorKey: "code",
            header: translate("resources.paymentSettings.financialInstitution.fields.code"),
            cell: ({ row }) => {
                return <TextField text={row.original.code || ""} />;
            }
        },
        {
            id: "currencies",
            accessorKey: "currencies",
            header: translate("resources.paymentSettings.financialInstitution.fields.currencies"),
            cell: ({ row }) => {
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        {row.original.currencies && row.original.currencies.length > 0
                            ? row.original.currencies.map(value => (
                                  <Badge
                                      key={value.code}
                                      className="cursor-default border border-neutral-50 bg-transparent font-normal hover:bg-transparent">
                                      <span className="max-w-28 overflow-hidden text-ellipsis break-words">
                                          {value.code}
                                      </span>
                                  </Badge>
                              ))
                            : "-"}
                    </div>
                );
            }
        },
        {
            id: "payment_types",
            accessorKey: "payment_types",
            header: translate("resources.paymentSettings.financialInstitution.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex min-w-28 flex-wrap gap-2">
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
            id: "nspk_code",
            header: translate("resources.paymentSettings.financialInstitution.fields.nspk_member_id"),
            accessorKey: "nspk_member_id",
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <TableEditableCell
                        initValue={row.original.nspk_member_id || ""}
                        cell={cell}
                        showEdit={currentCellBoolean && !listContext.isFetching}
                        isFetching={
                            (currentCellBoolean && listContext.isFetching) || (currentCellBoolean && isDataUpdating)
                        }
                        onSubmit={value => onSubmit(row.original.code, { nspk_member_id: value })}
                        setShowEdit={setCurrentCellEdit}
                    />
                );
            }
        },
        {
            id: "country_code",
            accessorKey: "country_code",
            header: translate("resources.paymentSettings.financialInstitution.fields.country_code")
        },
        {
            id: "show",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => openSheet("financialInstitution", { id: row.original.code })}
                            variant={"text_btn"}>
                            <EyeIcon className="text-green-50 hover:text-green-40" />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return {
        translate,
        createDialogOpen,
        columns,
        setCreateDialogOpen
    };
};
