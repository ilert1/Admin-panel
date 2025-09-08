import { useListContext, useTranslate } from "react-admin";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/Input/input";
import { debounce } from "lodash";
// import { CreateUserDialog } from "./CreateUserDialog";
import { CreateUserDialog } from "./CreateUserDialog";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { AnimatedContainer } from "../../components/AnimatedContainer";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const UserListFilter = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [userInputId, setUserInputId] = useState(filterValues?.id || "");
    const [username, setUsername] = useState(filterValues?.name || "");
    const [checkedActivity, setCheckedActivity] = useState(filterValues?.active || false);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);

    const onPropertySelected = debounce((value: string | number, type: "id" | "name" | "state") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
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
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !userInputId && !username && !checkedActivity;

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <div className="flex flex-col justify-end gap-6 sm:flex-row">
                        <div className="mb-4 flex w-full flex-wrap justify-between gap-x-56 gap-y-3 sm:gap-3 md:mb-6">
                            <ResourceHeaderTitle />

                            <div className="flex flex-1 flex-row gap-3 sm:flex-none">
                                <Button
                                    onClick={() => setShowAddUserDialog(true)}
                                    className="flex flex-1 items-center justify-center gap-1 font-normal sm:flex-none">
                                    <CirclePlus width={16} height={16} />
                                    <span>{translate("resources.users.createButton")}</span>
                                </Button>
                                <CreateUserDialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog} />
                                <FilterButtonGroup
                                    open={openFiltersClicked}
                                    onOpenChange={setOpenFiltersClicked}
                                    clearButtonDisabled={clearDisabled}
                                    filterList={[userInputId, username, checkedActivity]}
                                    onClearFilters={clearFilters}
                                />
                            </div>
                        </div>
                    </div>

                    <AnimatedContainer open={openFiltersClicked}>
                        <div className="mb-4 flex flex-col gap-2 sm:mb-6">
                            <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-end sm:gap-4">
                                <div className="flex min-w-36 flex-1 flex-col gap-2 lg:min-w-52">
                                    <Input
                                        label={translate("resources.users.filter.filterByUsername")}
                                        labelSize="title-2"
                                        placeholder={translate("resources.users.filter.filterByUsernamePlaceholder")}
                                        value={username}
                                        onChange={onUsernameChanged}
                                    />
                                </div>

                                <div className="flex flex-1 flex-col gap-2 lg:min-w-52">
                                    <Input
                                        label={translate("resources.users.filter.filterByUserId")}
                                        labelSize="title-2"
                                        placeholder={translate("resources.users.fields.id")}
                                        value={userInputId}
                                        onChange={onUserInputIdChanged}
                                    />
                                </div>
                            </div>
                            <label
                                onClick={() => onUserActivityChanged(!checkedActivity)}
                                className="flex cursor-pointer items-center gap-2 self-start [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                                <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-neutral-60 bg-white transition-all dark:bg-black">
                                    {checkedActivity && (
                                        <div id="checked" className="h-2.5 w-2.5 rounded-full bg-green-50"></div>
                                    )}
                                </div>
                                <span className="text-sm font-normal text-neutral-70 transition-all dark:text-neutral-40">
                                    {translate("resources.users.filter.filterByActivity")}
                                </span>
                            </label>
                        </div>
                    </AnimatedContainer>
                </div>
            </div>
        </>
    );
};
