import { useSheets } from "@/components/providers/SheetProvider";
import { EditButton, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { formatNumber } from "@/helpers/formatNumber";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { RecordContextProvider, usePermissions, useTranslate } from "react-admin";

export const useGetAccountsColumns = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();

    const data = fetchDictionaries();
    const { openSheet } = useSheets();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAccountId, setShowAccountId] = useState<string>("");
    const { currencies, isLoadingCurrencies } = useGetCurrencies();

    const handleOpenSheet = (id: string) => {
        openSheet("account", { id });
    };

    const columns: ColumnDef<Account>[] = [
        {
            id: "owner",
            header: translate("resources.accounts.fields.owner"),
            cell: ({ row }) => {
                const id = row.original.owner_id;

                return (
                    <div>
                        <TextField
                            text={row.original.meta?.caption ?? ""}
                            onClick={
                                permissions === "admin"
                                    ? () => {
                                          openSheet("merchant", {
                                              id: row.original.owner_id,
                                              merchantName: row.original.meta?.caption
                                          });
                                      }
                                    : undefined
                            }
                        />
                        <TextField
                            className="text-neutral-70"
                            text={id}
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
            id: "type",
            accessorKey: "type",
            header: translate("resources.accounts.fields.type"),
            cell: ({ row }) => data?.accountTypes?.[row.getValue("type") as string]?.type_descr || ""
        },
        {
            id: "balance",
            accessorKey: "amounts",
            header: translate("resources.accounts.fields.balance"),
            cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                    <div className="flex flex-col justify-center">
                        {row.original.amounts.map(item => {
                            const number = formatNumber(currencies, item);
                            return <div key={item.id}>{number}</div>;
                        })}
                    </div>
                </RecordContextProvider>
            )
        },
        ...(permissions === "admin"
            ? [
                  {
                      id: "actionEdit",
                      header: () => (
                          <div className="flex justify-center">{translate("resources.accounts.fields.edit")}</div>
                      ),
                      cell: ({ row }: { row: Row<Account> }) => {
                          return (
                              <EditButton
                                  onClick={() => {
                                      setShowAccountId(row.original.id);
                                      setShowEditDialog(true);
                                  }}
                              />
                          );
                      }
                  }
              ]
            : []),
        {
            id: "history",
            cell: ({ row }) => {
                return <ShowButton onClick={() => handleOpenSheet(row.original.id)} />;
            }
        }
    ];

    return {
        columns,
        isLoadingCurrencies,
        showEditDialog,
        setShowEditDialog,
        showAccountId
    };
};
