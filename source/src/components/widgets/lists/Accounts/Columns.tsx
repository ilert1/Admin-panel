import { EditButton, ShowButton } from "@/components/ui/Button";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { formatNumber } from "@/helpers/formatNumber";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { useState } from "react";
import { RecordContextProvider, usePermissions, useTranslate } from "react-admin";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const useGetAccountsColumns = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();

    const data = fetchDictionaries();

    const [showOpen, setShowOpen] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAccountId, setShowAccountId] = useState<string>("");
    const { currencies, isLoadingCurrencies } = useGetCurrencies();

    const appToast = useAppToast();

    const openSheet = (id: string) => {
        setShowAccountId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Account>[] = [
        {
            id: "owner",
            accessorFn: row => [row.meta?.caption, row.owner_id],
            header: translate("resources.accounts.fields.owner"),
            cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                    <div className="flex flex-col justify-center gap-1">
                        <span className="text-title-1">{(row.getValue("owner") as Array<string>)[0]}</span>
                        <div className="flex flex-start items-center gap-2 text-neutral-60 dark:text-neutral-70">
                            <Copy
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText((row.getValue("owner") as Array<string>)[1]);
                                    appToast("success", "", translate("app.ui.textField.copied"));
                                }}
                            />

                            <span className="min-w-[100px] max-w-[160px] overflow-hidden text-neutral-70 text-ellipsis text-nowrap">
                                {(row.getValue("owner") as Array<string>)[1]}
                            </span>
                        </div>
                    </div>
                </RecordContextProvider>
            )
        },
        {
            id: "state",
            accessorKey: "state",
            header: () => <div className="flex justify-center">{translate("resources.accounts.fields.state")}</div>,
            cell: ({ row }) => {
                const index = row.original.state - 1;

                return (
                    <div className="flex justify-center items-center">
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
            header: () => <div className="flex justify-center">{translate("resources.accounts.fields.history")}</div>,
            cell: ({ row }) => {
                return <ShowButton onClick={() => openSheet(row.original.id)} />;
            }
        }
    ];

    return {
        columns,
        showOpen,
        isLoadingCurrencies,
        setShowOpen,
        showEditDialog,
        setShowEditDialog,
        showAccountId
    };
};
