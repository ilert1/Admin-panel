import { ListContextProvider, useListContext, useListController, useLocaleState, useTranslate } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { TextField } from "@/components/ui/text-field";
import { CirclePlus, EyeIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { UserShow } from "@/components/widgets/show/UserShow";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Loading } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserCreate } from "../create";

const UserFilterSidebar = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [userInputId, setUserInputId] = useState(filterValues?.id || "");
    const [username, setUsername] = useState(filterValues?.name || "");
    const [checkedActivity, setCheckedActivity] = useState(filterValues?.active || false);

    const [showAddUserDialog, setShowAddUserDialog] = useState(false);

    const onPropertySelected = debounce((value: string | number, type: "id" | "name" | "state") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters);
        }
        setPage(1);
    }, 300);

    const onUserInputIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInputId(e.target.value);
        onPropertySelected(e.target.value, "id");
    };

    const onUsernameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        onPropertySelected(e.target.value, "name");
    };

    const onUserActivityChanged = (activity: boolean) => {
        setCheckedActivity(activity);
        if (activity) {
            onPropertySelected(1, "state");
        } else {
            onPropertySelected("", "state");
        }
    };

    const clearFilters = () => {
        setUserInputId("");
        setUsername("");
        setCheckedActivity(false);
        setFilters({}, displayedFilters);
        setPage(1);
    };

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-end">
                <div className="flex items-end gap-4">
                    <label className="flex flex-col gap-2 lg:min-w-52">
                        <span className="font-normal text-base">
                            {translate("resources.users.filter.filterByUsername")}
                        </span>
                        <Input
                            className="flex-1 text-sm placeholder:text-neutral-70"
                            placeholder={translate("resources.users.filter.filterByUsernamePlaceholder")}
                            value={username}
                            onChange={onUsernameChanged}
                        />
                    </label>

                    <label className="flex flex-col gap-2 lg:min-w-52">
                        <span className="font-normal text-base">
                            {translate("resources.users.filter.filterByUserId")}
                        </span>
                        <Input
                            className="flex-1 text-sm placeholder:text-neutral-70"
                            placeholder={translate("resources.users.fields.id")}
                            value={userInputId}
                            onChange={onUserInputIdChanged}
                        />
                    </label>

                    <Button
                        className="ml-0 sm:ml-auto flex items-center gap-1 w-auto h-auto px"
                        onClick={clearFilters}
                        variant="clearBtn"
                        size="default"
                        disabled={!userInputId && !username && !checkedActivity}>
                        <span>{translate("resources.transactions.filter.clearFilters")}</span>
                        <XIcon className="size-4" />
                    </Button>
                </div>

                <Button
                    onClick={() => setShowAddUserDialog(true)}
                    className="flex items-center justify-center gap-1 font-normal">
                    <CirclePlus width={16} height={16} />
                    <span>{translate("resources.users.createButton")}</span>
                </Button>

                <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                    <DialogContent aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>{translate("app.widgets.forms.userCreate.title")}</DialogTitle>
                        </DialogHeader>

                        <UserCreate onOpenChange={setShowAddUserDialog} />
                    </DialogContent>
                </Dialog>
            </div>

            <label
                onClick={() => onUserActivityChanged(!checkedActivity)}
                className="flex gap-2 items-center self-start cursor-pointer [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                <div className="relative w-4 h-4 rounded-full border transition-all bg-black border-neutral-60 flex justify-center items-center">
                    {checkedActivity && <div id="checked" className="w-2.5 h-2.5 rounded-full bg-green-50"></div>}
                </div>
                <span className="font-normal text-sm text-neutral-40 transition-all">
                    {translate("resources.users.filter.filterByActivity")}
                </span>
            </label>
        </div>
    );
};

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const UserList = () => {
    const [userId, setUserId] = useState<string>("");
    const [showOpen, setShowOpen] = useState(false);
    const [locale] = useLocaleState();
    const listContext = useListController<Users.User>();
    const translate = useTranslate();

    const openSheet = (id: string) => {
        setUserId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Users.User>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.users.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                </>
            )
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.users.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue />
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.users.fields.name"),
            cell: ({ row }) => <TextField text={row.original.name} copyValue />
        },
        {
            accessorKey: "active",
            header: () => {
                return <div className="text-center">{translate("resources.users.fields.active")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <span
                            className={`px-3 py-0.5 rounded-20 font-normal text-base text-center ${
                                row.original.state > translations.length ? "" : styles[row.original.state - 1]
                            }`}>
                            {row.original.state > translations.length
                                ? "-"
                                : translate(`resources.accounts.fields.states.${translations[row.original.state - 1]}`)}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Button onClick={() => openSheet(row.original.id)} variant="clearBtn" className="w-full p-0">
                        <span className="sr-only">Open menu</span>
                        <EyeIcon className="text-green-50 size-7" />
                    </Button>
                );
            }
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <UserFilterSidebar />
                    <DataTable columns={columns} data={[]} />
                </ListContextProvider>

                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        aria-describedby={undefined}
                        // className="sm:max-w-[1015px] h-[502px] max-h-full w-full p-0 m-0 top-[84px] flex flex-col gap-0 outline-none overflow-y-auto"
                        className="sm:max-w-[1015px] h-full sm:h-[502px] max-h-[calc(100dvh-84px)] overflow-hidden w-full p-0 m-0 top-[84px] flex flex-col"
                        tabIndex={-1}
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                        close={false}>
                        <div className="p-[42px] pb-[0px] flex-shrink-0">
                            <div className="flex justify-between items-center pb-2">
                                <SheetTitle className="!text-display-1">{translate("resources.users.user")}</SheetTitle>
                                <button
                                    onClick={() => setShowOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                    <XIcon className="h-[28px] w-[28px]" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto" tabIndex={-1}>
                            <UserShow id={userId} isBrief />
                        </div>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
