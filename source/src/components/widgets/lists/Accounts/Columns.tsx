import { useSheets } from "@/components/providers/SheetProvider";
import { EditButton, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { RecordContextProvider, usePermissions, useTranslate } from "react-admin";
import SnowFlakeIcon from "@/lib/icons/snowflake.svg?react";
import { cn } from "@/lib/utils";

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
            cell: ({ row }) => {
                return (
                    <RecordContextProvider value={row.original}>
                        <div className="flex flex-col justify-center">
                            {row.original.amounts.map((el, index) => {
                                const foundCur = currencies?.find(cur => cur.code === el.currency);

                                return (
                                    <>
                                        <div key={index} className="flex flex-col">
                                            <span className="text-title-1">
                                                {(el.value.quantity / el.value.accuracy).toFixed(
                                                    foundCur?.accuracy ?? 2
                                                ) +
                                                    " " +
                                                    el.currency}
                                            </span>
                                            {el.holds.quantity > 0 && (
                                                <div className="flex items-center gap-1 pl-1 text-extra-7">
                                                    <SnowFlakeIcon className="h-4 w-4" />
                                                    <span className="text-note-1">
                                                        {(el.holds.quantity / el.holds.accuracy).toFixed(
                                                            foundCur?.accuracy ?? 2
                                                        ) +
                                                            " " +
                                                            el.currency}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {index !== row.original.amounts.length - 1 && (
                                            <div
                                                className={cn(
                                                    "my-2 h-px w-full bg-neutral-40",
                                                    row.index % 2 ? "dark:bg-neutral-bb" : "dark:bg-neutral-bb-2"
                                                )}
                                            />
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    </RecordContextProvider>
                );
            }
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
