import { Button } from "@/components/ui/button";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Copy, EyeIcon, Pen } from "lucide-react";
import { useState } from "react";
import { RecordContextProvider, usePermissions, useTranslate } from "react-admin";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const useGetAccountsColumns = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();

    const data = fetchDictionaries();

    const [showOpen, setShowOpen] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAccountId, setShowAccountId] = useState<string>("");
    const [showAccountCaption, setShowAccountCaption] = useState<string>("");

    const openSheet = (id: string, caption: string) => {
        setShowAccountId(id);
        setShowAccountCaption(caption);
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
                        <div className="flex flex-start text-neutral-60 dark:text-neutral-70 items-center gap-2">
                            <Copy
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText((row.getValue("owner") as Array<string>)[1]);
                                    toast.success(translate("app.ui.textField.copied"), {
                                        dismissible: true,
                                        duration: 1000
                                    });
                                }}
                            />

                            <span className="text-nowrap overflow-hidden text-ellipsis max-w-[160px] min-w-[100px]">
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
            header: translate("resources.accounts.fields.state"),
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
                              <div className="flex justify-center">
                                  <Button
                                      onClick={() => {
                                          setShowAccountId(row.original.id);
                                          setShowEditDialog(true);
                                      }}
                                      variant="text_btn"
                                      className="h-8 w-8 p-0">
                                      <Pen className="h-6 w-6" />
                                  </Button>
                              </div>
                          );
                      }
                  }
              ]
            : []),
        {
            id: "history",
            header: translate("resources.accounts.fields.history"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant="secondary"
                        onClick={() => openSheet(row.original.id, row.original.meta?.caption)}
                        className="flex items-center h-7 w-7 p-0 bg-transparent">
                        <EyeIcon className="text-green-50 size-7" />
                    </Button>
                );
            }
        }
    ];

    return {
        columns,
        showOpen,
        setShowOpen,
        showEditDialog,
        setShowEditDialog,
        showAccountId,
        showAccountCaption
    };
};
