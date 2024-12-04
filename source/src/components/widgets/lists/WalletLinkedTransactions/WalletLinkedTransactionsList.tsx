import {
    fetchUtils,
    ListContextProvider,
    useListController,
    useLocaleState,
    usePermissions,
    useRefresh,
    useTranslate
} from "react-admin";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TextField } from "@/components/ui/text-field";
import { WalletLinkedTransactionShow } from "../../show/WalletLinkedTransactions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_WALLET_URL;

const WalletManualReconciliationBar = () => {
    const [manualClicked, setManualClicked] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const translate = useTranslate();
    const refresh = useRefresh();

    const handleCheckCLicked = async () => {
        try {
            const { json } = await fetchUtils.fetchJson(`${BASE_URL}/reconciliation/${inputVal}`, {
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });
            console.log(json);
            if (!json.success) {
                toast.error("Error", {
                    description: json.error.error_message ?? translate("resources.wallet.linkedTransactions.notFound"),
                    dismissible: true,
                    duration: 3000
                });
            } else {
                toast.error("Success", {
                    description: translate("resources.wallet.linkedTransactions.successFound"),
                    dismissible: true,
                    duration: 3000
                });
                refresh();
                setManualClicked(false);
            }
        } catch (error) {
            toast.error("Error", {
                description: translate("resources.wallet.linkedTransactions.notFound"),
                dismissible: true,
                duration: 3000
            });
        }
    };
    return (
        <div className="flex justify-end items-end mb-6">
            <Button
                onClick={() => setManualClicked(!manualClicked)}
                className="flex items-center justify-center gap-1 font-normal self-end">
                <span>{translate("resources.wallet.linkedTransactions.manual_reconciliation")}</span>
            </Button>

            <Dialog open={manualClicked} onOpenChange={setManualClicked}>
                <DialogContent
                    disableOutsideClick
                    className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[300px] mx-2 !overflow-y-auto rounded-[0] md:rounded-[16px]">
                    <DialogHeader>
                        <DialogTitle>
                            {translate("resources.wallet.linkedTransactions.manual_reconciliation")}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription />
                    <div className="mb-4 flex flex-col gap-4">
                        <div>
                            <Label htmlFor="inputManual">
                                {translate("resources.wallet.linkedTransactions.fields.transactionId")}
                            </Label>
                            <Input id="inputManual" value={inputVal} onChange={e => setInputVal(e.target.value)} />
                        </div>
                        <div className="flex flex-col sm:self-end sm:flex-row items-center gap-4">
                            <Button
                                onClick={handleCheckCLicked}
                                variant="default"
                                className="w-full sm:w-auto"
                                disabled={!inputVal.length}>
                                {translate("resources.wallet.linkedTransactions.check")}
                            </Button>
                            <Button
                                onClick={() => setManualClicked(false)}
                                variant="clearBtn"
                                type="button"
                                className="border border-neutral-50 rounded-4 hover:border-neutral-100 w-full sm:w-auto">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const WalletLinkedTransactionsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController(
        permissions === "admin" ? { resource: "reconciliation" } : { resource: "merchant/reconciliation" }
    );

    const translate = useTranslate();

    const [locale] = useLocaleState();
    const [chosenId, setChosenId] = useState("");
    const [quickShowOpen, setQuickShowOpen] = useState(false);

    const columns: ColumnDef<WalletLinkedTransactions>[] = [
        {
            id: "scanned_at",
            accessorKey: "scanned_at",
            header: translate("resources.wallet.linkedTransactions.fields.scannedAt"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original?.scanned_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap">{new Date(row.original?.scanned_at).toLocaleTimeString(locale)}</p>
                    </>
                );
            }
        },
        {
            id: "block_timestamp",
            accessorKey: "block_timestamp",
            header: translate("resources.wallet.linkedTransactions.fields.blockTimestamp"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">
                            {new Date(row.original?.block_timestamp).toLocaleDateString(locale)}
                        </p>
                        <p className="text-nowrap">
                            {new Date(row.original?.block_timestamp).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "transaction_id",
            accessorKey: "transaction_id",
            header: translate("resources.wallet.linkedTransactions.fields.transactionId"),
            cell: ({ row }) => (
                <TextField
                    text={row.original?.transaction_id}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        {
            id: "source_address",
            accessorKey: "source_address",
            header: translate("resources.wallet.linkedTransactions.fields.sourceAddress"),
            cell: ({ row }) => (
                <TextField
                    text={row.original?.source_address}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        {
            id: "destnation_address",
            accessorKey: "destnation_address",
            header: translate("resources.wallet.linkedTransactions.fields.destinationAddress"),
            cell: ({ row }) => (
                <TextField
                    text={row.original?.destnation_address}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.wallet.linkedTransactions.fields.type")
        },
        {
            id: "amount",
            accessorKey: "amount",
            header: translate("resources.wallet.linkedTransactions.fields.amount")
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.wallet.linkedTransactions.fields.currency")
        },
        {
            id: "actions",
            header: () => {
                return (
                    <div className="text-center">{translate("resources.wallet.linkedTransactions.fields.more")}</div>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => {
                                setChosenId(row.original?.transaction_id);
                                setQuickShowOpen(true);
                            }}
                            variant="secondary"
                            className="h-7 w-7 p-0 bg-transparent flex items-center">
                            <EyeIcon className="text-green-50 size-7" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <WalletManualReconciliationBar />
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <WalletLinkedTransactionShow id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
