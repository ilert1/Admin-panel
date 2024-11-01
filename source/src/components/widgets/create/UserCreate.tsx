import { useNavigate } from "react-router-dom";
import { UserCreateForm } from "../forms";
import { toast } from "sonner";
import { CreateContextProvider, useCreateController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { API_URL } from "@/data/base";
import { useMemo, useState } from "react";

export const UserCreate = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
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

    const createUserRecord = (data: Omit<Users.User, "created_at" | "deleted_at" | "id">) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        if (contrProps.save !== undefined) {
            try {
                contrProps.save(data, { onSuccess, onError });
            } catch (error) {
                setSubmitButtonDisabled(false);
            }
        }
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
                />
            </CreateContextProvider>
        );
    }
};
