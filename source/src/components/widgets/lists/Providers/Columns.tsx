import { Button, ShowButton } from "@/components/ui/Button";

import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";
import ReloadRoundSvg from "@/lib/icons/reload_round.svg?react";
import { ProviderWithId } from "@/data/providers";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { useSheets } from "@/components/providers/SheetProvider";

export const useGetProvidersColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [chosenId, setChosenId] = useState("");
    const [chosenProviderName, setChosenProviderName] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmKeysCreatingOpen, setConfirmKeysCreatingOpen] = useState(false);

    const handleClickGenerate = async (id: string, providerName: string) => {
        setChosenId(id);
        setChosenProviderName(providerName);
        setConfirmKeysCreatingOpen(true);
    };

    const columns: ColumnDef<ProviderWithId>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.provider.fields.name"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("provider", {
                                id: row.original.id
                            });
                        }}>
                        {row.original.name}
                    </Button>
                );
            }
        },
        {
            id: "public_key",
            accessorKey: "public_key",
            header: translate("resources.provider.fields.pk"),
            cell: ({ row }) => {
                if (!row.getValue("public_key")) {
                    return (
                        <Button onClick={() => handleClickGenerate(row.original.id, row.getValue("name"))}>
                            {translate("resources.provider.fields.genKey")}
                        </Button>
                    );
                } else {
                    const text = String(row.getValue("public_key"));

                    return <TextField text={text} copyValue lineClamp linesCount={1} maxWidth="150px" />;
                }
            }
        },
        {
            id: "fields_json_schema",
            accessorKey: "fields_json_schema",
            header: translate("resources.provider.fields.json_schema"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("fields_json_schema")
                                ? String(row.getValue("fields_json_schema")).length > 30
                                    ? String(row.getValue("fields_json_schema")).substring(0, 30) + "..."
                                    : row.getValue("fields_json_schema")
                                : ""
                        }
                    />
                );
            }
        },
        {
            id: "recreate_field",
            header: () => {
                return <div className="text-center">{translate("resources.provider.fields.regenKey")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => handleClickGenerate(row.original.id, row.original.name)}
                            variant={"text_btn"}>
                            <ReloadRoundSvg className="stroke-green-50 hover:stroke-green-40" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "payment_types",
            header: translate("resources.paymentSettings.paymentType.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex flex-wrap gap-2">
                        {row.original.payment_types && row.original.payment_types.length > 0
                            ? row.original.payment_types?.map(pt => {
                                  return (
                                      <PaymentTypeIcon
                                          className="h-7 w-7"
                                          key={pt.code}
                                          type={pt.code}
                                          metaIcon={pt.meta?.["icon"] as string}
                                      />
                                  );
                              })
                            : "-"}
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => openSheet("provider", { id: row.original.id })} />;
            }
        }
    ];
    return {
        chosenId,
        dialogOpen,
        columns,
        confirmKeysCreatingOpen,
        chosenProviderName,
        setDialogOpen,
        setConfirmKeysCreatingOpen
    };
};
