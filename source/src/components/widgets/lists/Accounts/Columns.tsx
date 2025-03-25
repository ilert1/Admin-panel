import { useSheets } from "@/components/providers/SheetProvider";
import { Button, EditButton, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
// import { EditButton, ShowButton } from "@/components/ui/Button";
import { formatNumber } from "@/helpers/formatNumber";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { RecordContextProvider, usePermissions, useTranslate } from "react-admin";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const useGetAccountsColumns = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();

    const data = fetchDictionaries();
    const { openSheet } = useSheets();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAccountId, setShowAccountId] = useState<string>("");
    const { currencies, isLoadingCurrencies } = useGetCurrencies();

    // const appToast = useAppToast();

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
                                    merchantName: row.original.meta?.caption
                                });
                            }}>
                            {row.original.meta?.caption ?? ""}
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
                            className={`rounded-20 px-3 py-0.5 text-center text-base font-normal text-white ${styles[index]}`}>
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
