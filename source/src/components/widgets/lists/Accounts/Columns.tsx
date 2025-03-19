import { useSheets } from "@/components/providers/SheetProvider";
import { Button, EditButton, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { RecordContextProvider, usePermissions, useTranslate } from "react-admin";
import { NumericFormat } from "react-number-format";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const useGetAccountsColumns = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();

    const data = fetchDictionaries();
    const { openSheet } = useSheets();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAccountId, setShowAccountId] = useState<string>("");

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
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("merchant", {
                                    id: row.original.owner_id,
                                    merchantName: row.original.meta.caption
                                });
                            }}>
                            {row.original.meta.caption ?? ""}
                        </Button>
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
            id: "state",
            accessorKey: "state",
            header: () => <div className="flex justify-center">{translate("resources.accounts.fields.state")}</div>,
            cell: ({ row }) => {
                const index = row.original.state - 1;

                return (
                    <div className="flex items-center justify-center">
                        <span
                            className={`px-3 py-0.5 rounded-20 text-white font-normal text-base text-center ${styles[index]}`}>
                            {translate(`resources.accounts.fields.states.${translations[index]}`)}
                        </span>
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
                            return (
                                <div key={item.id}>
                                    <NumericFormat
                                        value={item.value.quantity / item.value.accuracy}
                                        displayType={"text"}
                                        thousandSeparator=" "
                                        decimalSeparator=","
                                    />
                                    {` ${item.currency}`}
                                </div>
                            );
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
        showEditDialog,
        setShowEditDialog,
        showAccountId
    };
};
