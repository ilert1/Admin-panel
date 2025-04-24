import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { SimpleTable } from "../../../shared";
import { ColumnDef } from "@tanstack/react-table";
import { TableTypes } from "../../../shared/SimpleTable";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { AuthDataJsonToggle } from "./AuthDataJsonToggle";
import { TerminalAuth } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

interface IAuthDataViewer {
    authData: TerminalAuth | undefined;
    showAuthDataEditSheet: () => void;
}

export const AuthDataViewer = ({ authData, showAuthDataEditSheet }: IAuthDataViewer) => {
    const translate = useTranslate();

    const [showJson, setShowJson] = useState(false);

    const authDataColumns: ColumnDef<{ [key: string]: string }>[] = [
        {
            id: "key",
            accessorKey: "key",
            header: "Key",
            cell: ({ row }) => {
                return <TextField text={row.original.key} wrap lineClamp />;
            }
        },
        {
            id: "value",
            accessorKey: "value",
            header: "Value",
            cell: ({ row }) => {
                return <TextField text={row.original.value} type="secret" copyValue />;
            }
        }
    ];

    const parseAuthData = useMemo(
        () => (authData ? Object.keys(authData).map(key => ({ key, value: authData[key] as string })) : []),
        [authData]
    );

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-1">
                    <p className="text-xl !text-neutral-90 dark:!text-neutral-30 md:text-2xl">
                        {translate("resources.terminals.fields.auth")}
                    </p>

                    <div className="flex gap-4">
                        <AuthDataJsonToggle showJson={showJson} setShowJson={setShowJson} />

                        <Button
                            onClick={e => {
                                e.preventDefault();
                                showAuthDataEditSheet();
                            }}>
                            {translate("app.ui.actions.edit")}
                        </Button>
                    </div>
                </div>

                {showJson ? (
                    <MonacoEditor
                        disabled={true}
                        height="144px"
                        width="100%"
                        code={JSON.stringify(authData, null, 2)}
                    />
                ) : (
                    <SimpleTable
                        columns={authDataColumns}
                        data={parseAuthData}
                        tableType={TableTypes.COLORED}
                        className="overflow-hidden rounded-16"
                    />
                )}
            </div>
        </>
    );
};
