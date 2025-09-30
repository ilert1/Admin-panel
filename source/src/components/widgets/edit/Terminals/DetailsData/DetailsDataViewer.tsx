import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { SimpleTable } from "../../../shared";
import { ColumnDef } from "@tanstack/react-table";
import { TableTypes } from "../../../shared/SimpleTable";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { JsonToggle } from "../JsonToggle";
import { TerminalReadDetails } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

interface IDetailsDataViewer {
    detailsData: TerminalReadDetails | undefined;
    showDetailsDataEditSheet: () => void;
}

export const DetailsDataViewer = ({ detailsData, showDetailsDataEditSheet }: IDetailsDataViewer) => {
    const translate = useTranslate();

    const [showJson, setShowJson] = useState(false);

    const authDataColumns: ColumnDef<{ [key: string]: string }>[] = [
        {
            id: "key",
            accessorKey: "key",
            header: translate("resources.terminals.fields.key"),
            cell: ({ row }) => {
                return <TextField text={row.original.key} wrap lineClamp />;
            }
        },
        {
            id: "value",
            accessorKey: "value",
            header: translate("resources.terminals.fields.value"),
            cell: ({ row }) => {
                return <TextField text={row.original.value} wrap lineClamp copyValue />;
            }
        }
    ];

    const parseDetailsData = useMemo(
        () => (detailsData ? Object.keys(detailsData).map(key => ({ key, value: detailsData[key] as string })) : []),
        [detailsData]
    );

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-1">
                    <p className="text-xl !text-neutral-90 dark:!text-neutral-30 md:text-2xl">
                        {translate("resources.terminals.fields.details")}
                    </p>

                    <div className="flex gap-4">
                        <JsonToggle showJson={showJson} setShowJson={setShowJson} />

                        <Button
                            onClick={e => {
                                e.preventDefault();
                                showDetailsDataEditSheet();
                            }}>
                            {translate("app.ui.actions.edit")}
                        </Button>
                    </div>
                </div>

                {showJson ? (
                    <MonacoEditor disabled height="h-48" width="100%" code={JSON.stringify(detailsData, null, 2)} />
                ) : (
                    <SimpleTable
                        columns={authDataColumns}
                        data={parseDetailsData}
                        tableType={TableTypes.COLORED}
                        className="overflow-hidden rounded-16"
                    />
                )}
            </div>
        </>
    );
};
