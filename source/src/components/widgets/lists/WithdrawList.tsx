/* eslint-disable react-hooks/rules-of-hooks */
import { useTranslate, useListController, ListContextProvider, usePermissions, useLocaleState } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useMemo } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Loading } from "@/components/ui/loading";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import useWithdrawFilter from "@/hooks/useWithdrawFilter";
import { CryptoTransfer } from "../components/CryptoTransfer";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useFetchMerchants, useGetTransactionState } from "@/hooks";

const WithdrawFilterSidebar = () => {
    const {
        translate,
        operationId,
        onOperationIdChanged,
        startDate,
        endDate,
        changeDate,
        handleDownloadReport,
        clearFilters
    } = useWithdrawFilter();

    return (
        <div className="w-full mb-6 flex flex-col justify-start sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
            <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start md:max-w-96">
                <span className="md:text-nowrap">{translate("resources.withdraw.filter.filterById")}</span>
                <Input
                    className="flex-1 text-sm placeholder:text-neutral-70"
                    placeholder={translate("resources.withdraw.filter.filterByIdPlaceholder")}
                    value={operationId}
                    onChange={onOperationIdChanged}
                />
            </label>

            <DateRangePicker
                title={translate("resources.withdraw.filter.filterByDate")}
                placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                dateRange={{ from: startDate, to: endDate }}
                onChange={changeDate}
            />

            <Button
                className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                onClick={clearFilters}
                variant="clearBtn"
                size="default"
                disabled={!operationId && !startDate}>
                <span>{translate("resources.withdraw.filter.clearFilters")}</span>
                <XIcon className="size-4" />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button disabled={!startDate} className="md:ml-auto" variant="default" size="sm">
                        {translate("resources.withdraw.download.downloadReportButtonText")}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0 border-green-50" align="end">
                    <DropdownMenuItem
                        className="px-4 py-1.5 text-sm text-neutral-80 dark:text-neutral-80 focus:bg-green-50 focus:text-white focus:dark:text-white rounded-none cursor-pointer"
                        onClick={() => handleDownloadReport("csv")}>
                        CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="px-4 py-1.5 text-sm text-neutral-80 dark:text-neutral-80 focus:bg-green-50 focus:text-white focus:dark:text-white rounded-none cursor-pointer"
                        onClick={() => handleDownloadReport("pdf")}>
                        PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export const WithdrawList = () => {
    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const [locale] = useLocaleState();
    const data = fetchDictionaries();

    let isLoading,
        merchantsList: any[] = [];
    if (permissions === "admin") {
        ({ isLoading, merchantsList } = useFetchMerchants());
    }
    const merchantOnly = useMemo(() => permissions === "merchant", [permissions]);

    console.log(
        merchantsList.find(el => {
            return el.id === "552041c7-5404-466d-8c23-1553a8860140";
        })
    );

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.withdraw.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                </>
            )
        },
        {
            accessorKey: "id",
            header: translate("resources.withdraw.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} wrap={"break-all"} copyValue />
        },
        {
            accessorKey: "destination.id",
            header: translate("resources.withdraw.fields.destination.id"),
            cell: ({ row }) => (
                <TextField
                    text={
                        String(
                            row.original.destination.amount.value.quantity /
                                row.original.destination.amount.value.accuracy
                        ) + row.original.destination.amount.currency
                    }
                    wrap
                    copyValue
                />
            )
        },
        ...(permissions === "admin"
            ? [
                  {
                      header: translate("resources.withdraw.fields.merchant"),
                      cell: ({ row }: any) => {
                          const merch = merchantsList.find(el => el.id === row.original.source.id);
                          return (
                              <div>
                                  <TextField text={merch?.name ?? ""} wrap />
                                  <TextField text={row.original.source.id} wrap copyValue />
                              </div>
                          );
                      }
                  }
              ]
            : []),
        {
            header: translate("resources.withdraw.fields.idInBlockChain"),
            cell: ({ row }) => {
                const text = Object.hasOwn(row.original, "requisites") ? row.original.requisites[0].hash : "-";
                return (
                    <TextField
                        text={text}
                        wrap
                        copyValue={text !== "-" ? true : false}
                        link={
                            Object.hasOwn(row.original, "requisites") ? `${row.original.requisites[0].hash_link}` : "-"
                        }
                        type={text !== "-" ? "link" : "text"}
                    />
                );
            }
        },
        {
            accessorKey: "destination.amount.value",
            header: translate("resources.withdraw.fields.destination.amount.value"),
            cell: ({ row }) => {
                const value =
                    (row.original.destination.amount.value.quantity || 0) /
                    row.original.destination.amount.value.accuracy;
                if (isNaN(value)) return "-";
                return `${value.toFixed(Math.log10(row.original.destination.amount.value.accuracy))} ${
                    row.original.destination.amount.currency || ""
                }`;
            }
        },
        {
            header: translate("resources.withdraw.fields.state"),
            cell: ({ row }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const { text, color } = useGetTransactionState({ state: row.original.state.state_int });
                return (
                    <div className={`px-3 py-0.5 rounded-20 font-normal text-base text-center text-white ${color}`}>
                        <TextField text={text} />
                    </div>
                );
            }
        }
    ];

    if (listContext.isLoading || !listContext.data || isLoading) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div
                        className={
                            merchantOnly
                                ? "grid gap-x-6 lg:grid-cols-1 [grid-template-rows: auto 1fr 1fr;] grid-cols-1 lg:grid-rows-1 lg:grid-flow-col"
                                : "flex flex-col"
                        }>
                        <div>
                            <WithdrawFilterSidebar />
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl text-neutral-100">
                                {translate("resources.withdraw.tableTitle")}
                            </h3>
                            <DataTable columns={columns} data={[]} />
                        </div>

                        {merchantOnly && (
                            <div className="max-w-80 mb-6 row-start-1 lg:col-start-2 lg:row-start-2">
                                <CryptoTransfer />
                            </div>
                        )}
                    </div>
                </ListContextProvider>
            </>
        );
    }
};
