import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { TextField } from "@/components/ui/text-field";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { CascadeTerminalRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useSheets } from "@/components/providers/SheetProvider";
import { StatesTableEditableCell } from "../../shared/StatesTableEditableCell";
import { useState } from "react";
import { CurrentCell } from "../../shared";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CASCADE_STATE } from "@/data/cascades";
import { CountryTextField } from "../../components/CountryTextField";
import { useCountryCodes } from "@/hooks";

export const useGetCascadeShowColumns = ({
    isFetchingCascadeTerminalsData
}: {
    isFetchingCascadeTerminalsData: boolean;
}) => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();
    const { countryCodesWithFlag } = useCountryCodes();

    const [chosenId, setChosenId] = useState("");
    const [chosenTermName, setChosenTermName] = useState("");
    const [showCascadeTerminalDeleteDialog, setShowCascadeTerminalDeleteDialog] = useState(false);

    const [isDataUpdating, setIsDataUpdating] = useState(false);
    const [currentCellEdit, setCurrentCellEdit] = useState<CurrentCell>({
        row: undefined,
        column: undefined
    });

    const handleDeleteClicked = (id: string, termName: string) => {
        setChosenId(id);
        setShowCascadeTerminalDeleteDialog(true);
        setChosenTermName(termName);
    };

    const onSubmit = async (id: string, data: Pick<CascadeTerminalRead, "state">) => {
        try {
            setIsDataUpdating(true);

            await dataProvider.update("cascade_terminals", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            refresh();

            setCurrentCellEdit({
                row: undefined,
                column: undefined
            });
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setIsDataUpdating(false);
        }
    };

    const cascadeTerminalColumns: ColumnDef<CascadeTerminalRead>[] = [
        {
            id: "show",
            header: "",
            cell: ({ row }) => (
                <>
                    <ShowButton
                        onClick={() => {
                            openSheet("cascadeTerminal", { id: row.original.id });
                        }}
                    />
                    {row.original.condition?.extra && (
                        <span className="text-red-40 dark:text-red-40">
                            {translate("resources.cascadeSettings.cascadeTerminals.fields.extra")}
                        </span>
                    )}
                </>
            )
        },
        {
            accessorKey: "provider",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.provider"),
            cell: ({ row }) => (
                <Button
                    variant={"resourceLink"}
                    onClick={() => {
                        if (row.original.terminal.provider.id) {
                            openSheet("provider", {
                                id: row.original.terminal.provider.id
                            });
                        }
                    }}>
                    {row.original.terminal.provider.name}
                </Button>
            )
        },
        {
            accessorKey: "terminal",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.terminal"),
            cell: ({ row }) => (
                <div>
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("terminal", {
                                id: row.original.terminal.terminal_id
                            });
                        }}>
                        {row.original.terminal.verbose_name}
                    </Button>
                    <TextField
                        className="text-neutral-70"
                        text={row.original.terminal.terminal_id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                </div>
            )
        },
        {
            accessorKey: "currencies",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.currencies"),
            cell: ({ row }) => (
                <div className="flex max-h-32 items-center gap-2">
                    <Badge variant="currency">{row.original.terminal.src_currency?.code}</Badge>
                    {">"}
                    <Badge variant="currency">{row.original.terminal.dst_currency?.code}</Badge>
                </div>
            )
        },
        {
            id: "dst_country_code",
            accessorKey: "dst_country_code",
            header: translate("resources.direction.destinationCountry"),
            cell: ({ row }) => {
                const dst_country = countryCodesWithFlag.find(
                    item => item.alpha2 === row.original.terminal.dst_country_code
                );

                return <CountryTextField text={dst_country?.name || ""} wrapText />;
            }
        },
        {
            accessorKey: "weight",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.weight"),
            cell: ({ row }) => <TextField text={row.original.condition?.weight?.toString() || ""} />
        },
        {
            accessorKey: "rank",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.rank"),
            cell: ({ row }) => <TextField text={row.original.condition?.rank?.toString() || ""} />
        },
        {
            accessorKey: "ttl_min",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.ttl_minmax"),
            cell: ({ row }) => (
                <TextField
                    text={`${row.original.condition?.ttl?.min?.toString() || "-"} / ${row.original.condition?.ttl?.max?.toString() || "-"}`}
                />
            )
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.state"),
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <StatesTableEditableCell
                        cell={cell}
                        initValue={row.original.state}
                        selectVariants={CASCADE_STATE}
                        showEdit={currentCellBoolean}
                        setShowEdit={setCurrentCellEdit}
                        onSubmit={value => onSubmit(row.original.id, { state: value })}
                        isFetching={
                            (currentCellBoolean && isFetchingCascadeTerminalsData) ||
                            (currentCellBoolean && isDataUpdating)
                        }
                        editDisabled={isFetchingCascadeTerminalsData || isDataUpdating}
                    />
                );
            }
        },
        {
            id: "actionDelete",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.delete")}</div>,
            cell: ({ row }) => {
                return (
                    <TrashButton
                        onClick={() => handleDeleteClicked(row.original.id, row.original.terminal.verbose_name)}
                    />
                );
            }
        }
    ];

    return {
        cascadeTerminalColumns,
        chosenId,
        chosenTermName,
        showCascadeTerminalDeleteDialog,
        setShowCascadeTerminalDeleteDialog
    };
};
