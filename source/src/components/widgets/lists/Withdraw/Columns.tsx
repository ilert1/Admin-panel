/* eslint-disable react-hooks/rules-of-hooks */
import { useSheets } from "@/components/providers/SheetProvider";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useFetchMerchants, useGetTransactionState } from "@/hooks";
import { useAbortableInfiniteGetList } from "@/hooks/useAbortableInfiniteGetList";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useLocaleState, usePermissions, useTranslate } from "react-admin";

export const useGetWithdrawColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { openSheet } = useSheets();
    const { permissions } = usePermissions();

    const [cryptoTransferState, setCryptoTransferState] = useState<"process" | "success" | "error">("process");
    const [repeatData, setRepeatData] = useState<{ address: string; amount: number } | undefined>(undefined);

    const { merchantData, isMerchantsLoading } = useFetchMerchants();

    const merchantOnly = useMemo(() => permissions === "merchant", [permissions]);

    const { data: walletsData } = merchantOnly
        ? useAbortableInfiniteGetList("merchant/wallet", {
              pagination: { perPage: 25, page: 1 },
              filter: { sort: "name", asc: "ASC" }
          })
        : { data: undefined };

    const checkAddress = !merchantOnly
        ? () => {}
        : useCallback(
              (address: string) => {
                  const res = walletsData?.pages.map(page => {
                      return page.data.find(wallet => {
                          return wallet.address === address;
                      });
                  });
                  return res;
              },
              [walletsData?.pages]
          );

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.withdraw.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap text-neutral-70">
                        {new Date(row.original.created_at).toLocaleTimeString(locale)}
                    </p>
                </>
            )
        },
        {
            accessorKey: "id",
            header: translate("resources.withdraw.fields.id"),
            cell: ({ row }) => (
                <TextField
                    text={row.original.id}
                    wrap={"break-all"}
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        {
            accessorKey: "destination.id",
            header: translate("resources.withdraw.fields.destination.id"),
            cell: ({ row }) => {
                const text = Object.hasOwn(row.original.destination, "requisites")
                    ? row.original.destination.requisites[0]?.blockchain_address
                    : "";

                return <TextField text={text} wrap copyValue lineClamp linesCount={1} minWidth="50px" />;
            }
        },
        ...(permissions === "admin"
            ? [
                  {
                      header: translate("resources.withdraw.fields.merchant"),
                      cell: ({ row }: { row: Row<Transaction.Transaction> }) => {
                          const merch = merchantData?.find(el => el.id === row.original.source.id);

                          return (
                              <div>
                                  <Button
                                      variant={"resourceLink"}
                                      onClick={() => {
                                          openSheet("merchant", { id: merch?.id, merchantName: merch?.name });
                                      }}>
                                      {merch?.name ?? ""}
                                  </Button>
                                  <TextField
                                      className="text-neutral-70"
                                      text={row.original.source.id}
                                      wrap
                                      copyValue
                                      lineClamp
                                      linesCount={1}
                                      minWidth="50px"
                                  />
                              </div>
                          );
                      }
                  }
              ]
            : []),
        {
            header: translate("resources.withdraw.fields.idInBlockChain"),
            cell: ({ row }) => {
                const hasRequsites =
                    row.original.destination.requisites && Object.hasOwn(row.original.destination, "requisites");

                const text = hasRequsites ? row.original.destination.requisites[0].hash : "";

                return (
                    <TextField
                        text={text}
                        wrap
                        copyValue={text !== "-" ? true : false}
                        link={hasRequsites ? `${row.original.destination.requisites[0].hash_link}` : "-"}
                        type={text ? "link" : "text"}
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
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
        ...(merchantOnly
            ? [
                  {
                      id: "resend",
                      header: translate("resources.withdraw.fields.resend"),
                      cell: ({ row }: { row: Row<Transaction.Transaction> }) => {
                          if (
                              row.original.destination.requisites &&
                              Object.hasOwn(row.original.destination, "requisites")
                          ) {
                              const isFound = checkAddress(row.original.destination.requisites[0]?.blockchain_address);
                              return isFound && isFound[0] ? (
                                  <Button
                                      onClick={() => {
                                          if (cryptoTransferState !== "process") {
                                              setCryptoTransferState("process");
                                          }
                                          setRepeatData({
                                              address: row.original.destination.requisites[0].blockchain_address,
                                              amount:
                                                  row.original.destination.amount.value.quantity /
                                                  row.original.destination.amount.value.accuracy
                                          });
                                      }}>
                                      {translate("resources.withdraw.fields.resend")}
                                  </Button>
                              ) : (
                                  <p className="text-center">-</p>
                              );
                          } else {
                              return <p className="text-center">-</p>;
                          }
                      }
                  }
              ]
            : []),

        {
            header: translate("resources.withdraw.fields.state"),
            cell: ({ row }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const { text, color } = useGetTransactionState({ state: row.original.state.state_int });
                return (
                    <div className="flex items-center justify-center">
                        <span
                            className={`truncate rounded-20 px-3 py-0.5 text-center text-base font-normal text-white ${color}`}>
                            {text}
                        </span>
                    </div>
                );
            }
        }
    ];

    return {
        columns,
        repeatData,
        cryptoTransferState,
        isMerchantsLoading,
        merchantOnly,
        setCryptoTransferState
    };
};
