import { EditButton, TrashButton } from "@/components/ui/Button";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { PaymentTypesProvider, PaymentTypeWithId } from "@/data/payment_types";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { TextField } from "@/components/ui/text-field";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export const useGetPaymentTypesColumns = () => {
    const translate = useTranslate();
    const paymentTypeDataProvider = new PaymentTypesProvider();

    const [chosenId, setChosenId] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: requiredFields, isLoading: isLoadRequiredFields } = useQuery({
        queryKey: ["paymentTypeRequiredFields"],
        staleTime: 1000 * 60 * 5,
        queryFn: () => {
            return paymentTypeDataProvider.getRequiredFields();
        }
    });

    const modifiedOptions =
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(requiredFields ?? [])?.map(([_, value]) => ({ label: value.label, value: value.value })) || [];
    console.log(modifiedOptions);

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const columns: ColumnDef<PaymentTypeWithId>[] = [
        {
            id: "icon",
            header: () => (
                <div className="text-center">{translate("resources.paymentSettings.paymentType.fields.icon")}</div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <PaymentTypeIcon type={row.original.code} metaIcon={row.original.meta?.["icon"]} />
                    </div>
                );
            }
        },
        {
            id: "code",
            accessorKey: "code",
            header: translate("resources.paymentSettings.paymentType.fields.code")
        },
        {
            id: "title",
            accessorKey: "title",
            header: translate("resources.paymentSettings.paymentType.fields.title"),
            cell: ({ row }) => {
                return <TextField text={row.original.title || ""} wrap className="min-w-[180px]" />;
            }
        },
        {
            id: "category",
            accessorKey: "category",
            header: translate("resources.paymentSettings.paymentType.fields.category")
        },
        {
            id: "required_fields_for_payment_deposit",
            accessorKey: "required_fields_for_payment_deposit",
            header: translate("resources.paymentSettings.paymentType.fields.required_fields_for_payment_deposit"),
            cell: ({ row }) => {
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        {requiredFields &&
                        !isLoadRequiredFields &&
                        row.original.required_fields_for_payment?.deposit &&
                        row.original.required_fields_for_payment?.deposit.length > 0
                            ? row.original.required_fields_for_payment?.deposit.map(value => {
                                  console.log(value);

                                  const option = modifiedOptions.find(o => o.value === value);
                                  const isCustomOption = !modifiedOptions?.some(option => option.value === value);

                                  return (
                                      <Badge
                                          key={value}
                                          className={cn(
                                              "m-1 border-foreground/10 bg-card text-foreground transition duration-150 ease-out hover:bg-card/80",
                                              "my-0 overflow-x-hidden bg-muted font-normal text-neutral-90 dark:text-neutral-0",
                                              isCustomOption ? "border-dashed border-green-40" : ""
                                          )}>
                                          <span className="flex max-w-48 flex-col overflow-hidden text-ellipsis break-words">
                                              <p>{isCustomOption ? value : option?.label.split("[")[0].trim()}</p>
                                              <p className="text-left text-xs text-neutral-70">
                                                  {isCustomOption ? value : option?.value}
                                              </p>
                                          </span>
                                      </Badge>
                                  );
                              })
                            : "-"}
                    </div>
                );
            }
        },
        {
            id: "required_fields_for_payment_withdrawal",
            accessorKey: "required_fields_for_payment_withdrawal",
            header: translate("resources.paymentSettings.paymentType.fields.required_fields_for_payment_withdrawal"),
            cell: ({ row }) => {
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        {requiredFields &&
                        !isLoadRequiredFields &&
                        row.original.required_fields_for_payment?.withdrawal &&
                        row.original.required_fields_for_payment?.withdrawal.length > 0
                            ? row.original.required_fields_for_payment?.withdrawal.map(value => {
                                  console.log(value);

                                  const option = modifiedOptions.find(o => o.value === value);
                                  const isCustomOption = !modifiedOptions?.some(option => option.value === value);

                                  return (
                                      <Badge
                                          key={value}
                                          className={cn(
                                              "m-1 border-foreground/10 bg-card text-foreground transition duration-150 ease-out hover:bg-card/80",
                                              "my-0 overflow-x-hidden bg-muted font-normal text-neutral-90 dark:text-neutral-0",
                                              isCustomOption ? "border-dashed border-green-40" : ""
                                          )}>
                                          <span className="flex max-w-48 flex-col overflow-hidden text-ellipsis break-words">
                                              <p>{isCustomOption ? value : option?.label.split("[")[0].trim()}</p>
                                              <p className="text-left text-xs text-neutral-70">
                                                  {isCustomOption ? value : option?.value}
                                              </p>
                                          </span>
                                      </Badge>
                                  );
                              })
                            : "-"}
                    </div>
                );
            }
        },
        {
            id: "currencies",
            accessorKey: "currencies",
            header: translate("resources.paymentSettings.paymentType.fields.currencies"),
            cell: ({ row }) => {
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        {row.original.currencies && row.original.currencies.length > 0
                            ? row.original.currencies.map(value => (
                                  <Badge key={value.code} variant="currency">
                                      {value.code}
                                  </Badge>
                              ))
                            : "-"}
                    </div>
                );
            }
        },
        {
            id: "update_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.edit")}</div>;
            },
            cell: ({ row }) => {
                return <EditButton onClick={() => handleEditClicked(row.original.id)} />;
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
            }
        }
    ];
    return {
        chosenId,
        editDialogOpen,
        deleteDialogOpen,
        createDialogOpen,
        columns,
        setDeleteDialogOpen,
        setEditDialogOpen,
        setCreateDialogOpen
    };
};
