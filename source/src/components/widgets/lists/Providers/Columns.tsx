import { Button, ShowButton } from "@/components/ui/Button";

import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ListControllerResult, useTranslate } from "react-admin";
import ReloadRoundSvg from "@/lib/icons/reload_round.svg?react";
import { IProvider } from "@/data/providers";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { useSheets } from "@/components/providers/SheetProvider";
import { ColumnSortingButton, SortingState } from "../../shared";
import { Badge } from "@/components/ui/badge";
import { ProviderPaymentMethods } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const useGetProvidersColumns = ({ listContext }: { listContext: ListControllerResult }) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [chosenId, setChosenId] = useState("");
    const [chosenProviderName, setChosenProviderName] = useState("");
    const [sort, setSort] = useState<SortingState>({
        field: listContext.sort.field || "",
        order: listContext.sort.order || "ASC"
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmKeysCreatingOpen, setConfirmKeysCreatingOpen] = useState(false);

    const handleClickGenerate = async (id: string, providerName: string) => {
        setChosenId(id);
        setChosenProviderName(providerName);
        setConfirmKeysCreatingOpen(true);
    };

    const columns: ColumnDef<IProvider>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.provider.fields.name")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("provider", {
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
                );
            }
        },
        {
            id: "payment_types",
            header: translate("resources.paymentSettings.paymentType.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex flex-wrap gap-2">
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
            id: "payment_methods",
            accessorKey: "payment_methods",
            header: translate("resources.provider.fields.paymentMethods"),
            cell: ({ row }) => {
                const paymentMethods = Object.keys(
                    row.original.payment_methods || {}
                ) as (keyof ProviderPaymentMethods)[];
                const enabledPaymentMethods = paymentMethods.filter(
                    item => row.original.payment_methods?.[item]?.enabled === true
                );

                return (
                    <div className="flex max-h-32 min-w-32 flex-wrap items-center gap-1 overflow-y-auto">
                        {enabledPaymentMethods.length > 0
                            ? enabledPaymentMethods.map(value => (
                                  <Badge
                                      key={value}
                                      className="cursor-default overflow-x-hidden border-foreground/10 bg-muted font-normal text-neutral-90 transition duration-150 ease-out hover:bg-muted dark:text-neutral-0">
                                      <span className="flex max-w-48 flex-col overflow-hidden text-ellipsis break-words">
                                          <p>{value}</p>
                                      </span>
                                  </Badge>
                              ))
                            : "-"}
                    </div>
                );
            }
        },
        {
            id: "public_key",
            accessorKey: "public_key",
            header: translate("resources.provider.fields.pk"),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {!row.getValue("public_key") ? (
                        <Button onClick={() => handleClickGenerate(row.original.id, row.getValue("name"))}>
                            {translate("resources.provider.fields.genKey")}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleClickGenerate(row.original.id, row.original.name)}
                            variant={"text_btn"}>
                            <ReloadRoundSvg className="stroke-green-50 hover:stroke-green-40" />
                        </Button>
                    )}
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => openSheet("provider", { id: row.original.id })} />;
            }
        }
    ];
    return {
        chosenId,
        dialogOpen,
        columns,
        confirmKeysCreatingOpen,
        chosenProviderName,
        setDialogOpen,
        setConfirmKeysCreatingOpen
    };
};
