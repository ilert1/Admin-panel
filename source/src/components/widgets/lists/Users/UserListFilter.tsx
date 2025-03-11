import { useListContext, useTranslate } from "react-admin";
import { CirclePlus, XIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/Input/input";
import { debounce } from "lodash";
// import { CreateUserDialog } from "./CreateUserDialog";
import { CreateUserDialogNewFlow } from "./CreateUserDialogNewFlow";
import { FilterButtonGroup } from "../../components/FilterButtonGroup";
import { motion } from "framer-motion";

export const UserListFilter = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [userInputId, setUserInputId] = useState(filterValues?.id || "");
    const [username, setUsername] = useState(filterValues?.name || "");
    const [checkedActivity, setCheckedActivity] = useState(filterValues?.active || false);

    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showAddUserNewFlowDialog, setShowAddUserNewFlowDialog] = useState(false);

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

    const [openFiltersClicked, setOpenFiltersClicked] = useState(false);
    const clearDisabled = !userInputId && !username && !checkedActivity;

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-2">
                <div className="flex gap-6 justify-end">
                    <div className="flex gap-3 justify-end">
                        {/* <Button
                            onClick={() => setShowAddUserDialog(true)}
                            className="flex items-center justify-center gap-1 font-normal">
                            <CirclePlus width={16} height={16} />
                            <span>{translate("resources.users.createButton")}</span>
                        </Button>
                        <CreateUserDialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog} /> */}

                        <Button
                            onClick={() => setShowAddUserNewFlowDialog(true)}
                            className="flex items-center justify-center gap-1 font-normal">
                            <CirclePlus width={16} height={16} />
                            <span>{translate("resources.users.createButton")}</span>
                        </Button>
                        <CreateUserDialogNewFlow
                            open={showAddUserNewFlowDialog}
                            onOpenChange={setShowAddUserNewFlowDialog}
                        />
                    </div>
                    <FilterButtonGroup
                        open={openFiltersClicked}
                        onOpenChange={setOpenFiltersClicked}
                        clearButtonDisabled={clearDisabled}
                        filterList={[userInputId, username, checkedActivity]}
                        onClearFilters={clearFilters}
                    />
                </div>

                <motion.div
                    layout
                    initial={{ opacity: 0, height: 0, maxHeight: 0, display: "none" }}
                    animate={{
                        opacity: openFiltersClicked ? 1 : 0,
                        height: openFiltersClicked ? "auto" : "",
                        display: openFiltersClicked ? "" : "none",
                        maxHeight: openFiltersClicked ? "100%" : 0,
                        pointerEvents: openFiltersClicked ? "auto" : "none"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex justify-between items-end flex-wrap gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-end gap-4 flex-wrap">
                            <div className="flex flex-col gap-2 lg:min-w-52">
                                <Input
                                    className="flex-1 text-sm placeholder:text-neutral-70"
                                    label={translate("resources.users.filter.filterByUsername")}
                                    labelSize="title-2"
                                    placeholder={translate("resources.users.filter.filterByUsernamePlaceholder")}
                                    value={username}
                                    onChange={onUsernameChanged}
                                />
                            </div>

                            <div className="flex flex-col gap-2 lg:min-w-52">
                                <Input
                                    label={translate("resources.users.filter.filterByUserId")}
                                    labelSize="title-2"
                                    className="flex-1 text-sm placeholder:text-neutral-70"
                                    placeholder={translate("resources.users.fields.id")}
                                    value={userInputId}
                                    onChange={onUserInputIdChanged}
                                />
                            </div>
                        </div>
                        <label
                            onClick={() => onUserActivityChanged(!checkedActivity)}
                            className="flex gap-2 items-center self-start cursor-pointer [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                            <div className="relative w-4 h-4 rounded-full border transition-all bg-white dark:bg-black border-neutral-60 flex justify-center items-center">
                                {checkedActivity && (
                                    <div id="checked" className="w-2.5 h-2.5 rounded-full bg-green-50"></div>
                                )}
                            </div>
                            <span className="font-normal text-sm text-neutral-70 dark:text-neutral-40 transition-all">
                                {translate("resources.users.filter.filterByActivity")}
                            </span>
                        </label>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
