import { ListContextProvider, useGetList, useListContext, useListController, useTranslate } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { TextField } from "@/components/ui/text-field";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { CirclePlus, EyeIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { UserShow } from "@/components/widgets/show/UserShow";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCreate } from "../create";
import { UserEdit } from "../edit/UserEdit";

const UserFilterSidebar = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { data: users } = useGetList("users", { pagination: { perPage: 100, page: 1 } });

    const [userInputId, setUserInputId] = useState(filterValues?.id || "");
    const [username, setUsername] = useState(users?.find(user => filterValues?.user === user.id) || "");
    const [checkedActivity, setCheckedActivity] = useState(filterValues?.isActive || false);

    const onPropertySelected = debounce((value: Users.User | string | boolean, type: "id" | "user" | "isActive") => {
        if (value) {
            if (type === "user") {
                value = (value as Users.User).id;
            }
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

    const onUsernameChanged = (user: Users.User | string) => {
        setUsername(user);
        onPropertySelected(user, "user");
    };

    const onUserActivityChanged = (activity: boolean) => {
        setCheckedActivity(activity);
        onPropertySelected(activity, "isActive");
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
                        <Select
                            onValueChange={val => (val !== "null" ? onUsernameChanged(val) : onUsernameChanged(""))}
                            value={username}>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={translate("resources.users.filter.filterByUsernamePlaceholder")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">{translate("resources.users.filter.showAll")}</SelectItem>
                                {users &&
                                    users.map(user => (
                                        <SelectItem key={user.id} value={user}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
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

                <Dialog>
                    <DialogTrigger>
                        <div className="text-white dark:text-neutral-100 whitespace-nowrap rounded-4 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-200 h-9 px-4 py-2 bg-green-50 hover:bg-green-40 active:bg-green-20 disabled:bg-neutral-20 disabled:text-neutral-80 flex items-center justify-center gap-1 font-normal select-none">
                            <CirclePlus width={16} height={16} />
                            <span>{translate("resources.users.createButton")}</span>
                        </div>
                    </DialogTrigger>

                    <DialogContent aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>{translate("app.widgets.forms.userCreate.title")}</DialogTitle>
                        </DialogHeader>

                        <UserCreate />
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

export const UserList = () => {
    const [showOpen, setShowOpen] = useState(false);
    const [userId, setUserId] = useState<string>("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

    const listContext = useListController<Users.User>();
    const translate = useTranslate();
    const navigate = useNavigate();

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
                    <p>{new Date(row.original.created_at).toLocaleDateString()}</p>
                    <p>{new Date(row.original.created_at).toLocaleTimeString()}</p>
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
            header: translate("resources.users.fields.active"),
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-white">
                    {row.original.deleted_at ? (
                        <span className="px-3 py-0.5 bg-red-50 rounded-20 font-normal text-base text-center">
                            {translate("resources.users.fields.activeStateFalse")}
                        </span>
                    ) : (
                        <span className="px-3 py-0.5 bg-green-50 rounded-20 font-normal text-base text-center">
                            {translate("resources.users.fields.activeStateTrue")}
                        </span>
                    )}
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="clearBtn" className="w-full p-0">
                                <span className="sr-only">Open menu</span>
                                <EyeIcon className="text-green-50 size-7" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(row.original.id)} className="border-none">
                                {translate("app.ui.actions.quick_show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate(`/users/${row.original.id}/show`)}
                                className="border-none">
                                {translate("app.ui.actions.show")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                    <DataTable columns={columns} />
                </ListContextProvider>
                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        className="sm:max-w-[1015px] !max-h-[502px] w-full p-0 m-0 top-[84px] flex flex-col gap-0"
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

                            <div className="flex justify-end gap-4 px-[42px]">
                                <Button onClick={() => setShowEditUser(true)} className="text-title-1">
                                    {translate("resources.users.edit")}
                                </Button>

                                <Button
                                    variant={"outline"}
                                    className="border-[1px] border-neutral-50 text-neutral-50 bg-transparent"
                                    onClick={() => setDialogOpen(true)}>
                                    {translate("resources.users.delete")}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
                    <DialogContent aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>{translate("app.widgets.forms.userCreate.title")}</DialogTitle>
                        </DialogHeader>

                        <UserEdit id={userId} />
                    </DialogContent>
                </Dialog>

                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogContent className="w-[253px] px-[24px] bg-muted">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">
                                {translate("resources.users.deleteThisUser")}
                            </AlertDialogTitle>
                            <AlertDialogDescription></AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex justify-around gap-[35px] w-full">
                                <AlertDialogAction onClick={() => setDialogOpen(false)}>
                                    {translate("app.ui.actions.delete")}
                                </AlertDialogAction>
                                <AlertDialogCancel className="!ml-0 px-3">
                                    {translate("app.ui.actions.cancel")}
                                </AlertDialogCancel>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }
};
