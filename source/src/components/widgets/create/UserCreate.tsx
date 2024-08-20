import { useNavigate } from "react-router-dom";
import { UserCreateForm } from "../forms/UserCreate";
import { toast } from "sonner";
import { CreateContextProvider, useCreateController, useTranslate } from "react-admin";

const UserCreate = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const contrProps = useCreateController();

    const onSuccess = (data: any) => {
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

    const createUserRecord = (data: any) => {
        if (contrProps.save !== undefined) {
            contrProps.save(data, { onSuccess, onError });
        }
    };

    return (
        <CreateContextProvider value={contrProps}>
            {contrProps.save !== undefined ? (
                <UserCreateForm
                    onSubmit={createUserRecord}
                    isDisabled={contrProps.saving !== undefined ? contrProps.saving : false}
                />
            ) : (
                <>{navigate(`/${contrProps.resource}`)}</>
            )}
        </CreateContextProvider>
    );
};

export default UserCreate;
