import { useListContext, useTranslate } from "react-admin";
import { CirclePlus, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { CreateUserDialog } from "./CreateUserDialog";

export const UserListFilter = () => {
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

                <CreateUserDialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog} />
            </div>

            <label
                onClick={() => onUserActivityChanged(!checkedActivity)}
                className="flex gap-2 items-center self-start cursor-pointer [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                <div className="relative w-4 h-4 rounded-full border transition-all bg-white dark:bg-black border-neutral-60 flex justify-center items-center">
                    {checkedActivity && <div id="checked" className="w-2.5 h-2.5 rounded-full bg-green-50"></div>}
                </div>
                <span className="font-normal text-sm text-netural-60 dark:text-neutral-40 transition-all">
                    {translate("resources.users.filter.filterByActivity")}
                </span>
            </label>
        </div>
    );
};
