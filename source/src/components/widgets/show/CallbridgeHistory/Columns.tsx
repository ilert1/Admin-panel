import { formatDateTime } from "@/helpers/formatDateTime";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";

interface ICallbridgeHistoryColunms {
    changed_at: string;
    status: {
        from?: string;
        to?: string;
    };
    delivered_at?: {
        from?: string;
        to?: string;
    };
    trigger_type?: {
        from?: string;
        to?: string;
    };
}

export const useGetCallbridgeHistoryColumns = () => {
    const translate = useTranslate();

    const columns: ColumnDef<ICallbridgeHistoryColunms>[] = [
        {
            id: "changed_at",
            header: translate("resources.callbridge.history.show.fields.updated_at"),
            cell: ({ row }) => {
                return <p className="text-nowrap">{formatDateTime(new Date(row.original.changed_at))}</p>;
            }
        },
        {
            id: "status",
            header: `${translate("resources.callbridge.history.fields.status")} ${translate("resources.callbridge.history.show.fromTo")}`,
            cell: ({ row }) => {
                const from = row.original.status?.from ?? "-";
                const to = row.original.status?.to ?? "-";
                return (
                    <div>
                        {from && from !== "-"
                            ? translate(`resources.callbridge.history.callbacksStatus.${from}`) + " / "
                            : "- / "}
                        {to && from !== "-" ? translate(`resources.callbridge.history.callbacksStatus.${to}`) : "-"}
                    </div>
                );
            }
        },
        {
            id: "delivered_at",
            header: `${translate("resources.callbridge.history.fields.deliveredAt")} ${translate("resources.callbridge.history.show.fromToDate")}`,
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">
                            {row.original.delivered_at?.from
                                ? formatDateTime(new Date(row.original.delivered_at?.from))
                                : "-"}
                        </p>
                        <p className="text-nowrap">
                            {row.original.delivered_at?.to
                                ? formatDateTime(new Date(row.original.delivered_at?.to))
                                : "-"}
                        </p>
                    </>
                );
            }
        },
        {
            id: "trigger_type",
            header: `${translate("resources.callbridge.history.fields.trigger_type")} ${translate("resources.callbridge.history.show.fromTo")}`,
            cell: ({ row }) => {
                const from = row.original.trigger_type?.from || "-";
                const to = row.original.trigger_type?.to || "-";
                return (
                    <div>
                        {from + " / "}
                        {to}
                    </div>
                );
            }
        }
    ];

    return { columns };
};
