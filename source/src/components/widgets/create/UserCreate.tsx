import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserCreateForm } from "../forms/UserCreate"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import { CreateContextProvider, useCreateController, useTranslate } from "react-admin"


const UserCreate = (props) => {
    const translate = useTranslate();
    const navigate = useNavigate()

    const success = () => {
        toast.success(translate("resources.transactions.show.success"), {
            dismissible: true,
            duration: 3000
        });
    };

    const error = () => {
        toast.error(translate("resources.transactions.show.error"), {
            dismissible: true,
            duration: 3000
        });
    };

    const contrProps = useCreateController(props);

    const createUserRecord = (data: any) => {
        if (contrProps.save !== undefined) {
            contrProps.save(data, {onSuccess: success, onError: error})
        }
    }

    return (
      <CreateContextProvider value={contrProps}>
          {
                contrProps.save !== undefined
                ?
                <UserCreateForm 
                    onSubmit={createUserRecord} 
                    isDisabled={contrProps.saving !== undefined ? contrProps.saving : false}
                />
                :
                <>
                {navigate(`/${contrProps.resource}`)}
                </>
          }
      </CreateContextProvider>
    )
}



export default UserCreate;