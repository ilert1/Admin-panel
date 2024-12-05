import { useNavigate } from "react-router-dom";
import { UserCreateForm } from "../forms";
import { toast } from "sonner";
import { CreateContextProvider, useCreateController, useRefresh, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { API_URL } from "@/data/base";
import { useMemo, useState } from "react";

interface UserCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const UserCreate = ({ onOpenChange }: UserCreateProps) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const refresh = useRefresh();
    const contrProps = useCreateController();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const onSuccess = (data: Users.User) => {
        toast.success(translate("resources.users.create.success"), {
            dismissible: true,
            duration: 3000,
            description: translate("resources.users.create.successMessage")
        });
        navigate(`/${contrProps.resource}/${data.id}/show`);
    };

    const onError = () => {
        toast.error(translate("resources.users.create.error"), {
            dismissible: true,
            duration: 3000,
            description: translate("resources.users.create.errorMessage")
        });
    };

    const { isLoading: currenciesLoading, data: currencies } = useQuery<{ data: Dictionaries.Currency[] }>(
        "currencies",
        () =>
            fetch(`${API_URL}/dictionaries/curr`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }).then(response => response.json())
    );

    const createUserRecord = (data: Users.UserCreate) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        if (contrProps.save !== undefined) {
            try {
                contrProps.save(data, { onSuccess, onError });
            } catch (error) {
                setSubmitButtonDisabled(false);
            }
        }
        refresh();
        onOpenChange(false);
    };

    const isDisabled = useMemo(() => currenciesLoading || contrProps.saving, [contrProps.saving, currenciesLoading]);

    if (contrProps.save !== undefined) {
        return (
            <CreateContextProvider value={contrProps}>
                <UserCreateForm
                    buttonDisabled={submitButtonDisabled}
                    onSubmit={createUserRecord}
                    currencies={currencies?.data || []}
                    isDisabled={isDisabled !== undefined ? isDisabled : false}
                    onOpenChange={onOpenChange}
                />
            </CreateContextProvider>
        );
    }
};
