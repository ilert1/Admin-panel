import { FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useEffect, useRef, useState } from "react";
import { fetchUtils, useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantShowColumns } from "./Columns";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import { MerchantTypeToShow } from "../../lists/Merchants/Columns";
import { toast } from "sonner";
import { Fees } from "../../components/Fees";

interface MerchantShowProps {
    id: string;
    type: MerchantTypeToShow;
}

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const MerchantShow = ({ id, type }: MerchantShowProps) => {
    const translate = useTranslate();
    const data = fetchDictionaries();
    const context = useShowController({ resource: "merchant", id });
    const { columns } = useGetMerchantShowColumns();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [addNewFeeClicked, setAddNewFeeClicked] = useState(false);
    const [merchantDirections, setMerchantDirections] = useState([]);

    useEffect(() => {
        if (messagesEndRef.current) {
            if (addNewFeeClicked) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [addNewFeeClicked]);

    useEffect(() => {
        const fetchMerchantDirections = async () => {
            try {
                const { json } = await fetchUtils.fetchJson(`${API_URL}/direction/merchant/${context?.record.id}`, {
                    user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
                });

                if (!json.success) {
                    throw new Error(json.error);
                }

                setMerchantDirections(json.data);
            } catch (error) {
                toast.error("Error", {
                    description: "Something went wrong",
                    dismissible: true,
                    duration: 3000
                });
            }
        };

        if (context.record && (type === "directions" || type === "all")) {
            fetchMerchantDirections();
        }
    }, [context.record, type]);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }
    // console.log(merchantDirections);

    const fees = context.record.fees;
    return (
        <div className="p-[42px] pt-0 h-full min-h-[300px] flex flex-col overflow-auto">
            <div className="sticky top-0 bg-muted z-10 p-[16px]">
                <span className="text-title-1 text-neutral-90 dark:text-neutral-0">{context.record.name}</span>
                <TextField text={context.record.id} copyValue className="text-neutral-70 dark:text-neutral-30" />
            </div>

            <div className="sticky top-[60px] bg-muted z-10 p-[16px]">
                <div className="grid grid-cols-2">
                    <TextField label={translate("resources.merchant.fields.descr")} text={context.record.description} />
                    <TextField label="Keycloak ID" text={context.record.keycloak_id} />
                </div>
            </div>
            {type === "all" ? (
                <>
                    <Fees
                        id={id}
                        fees={fees}
                        feeTypes={data.feeTypes}
                        feesResource={FeesResource.MERCHANT}
                        addNewOpen={addNewFeeClicked}
                        setAddNewOpen={setAddNewFeeClicked}
                        className="max-h-[20dvh]"
                        padding={false}
                    />
                    <div className="mt-5 w-full flex flex-col gap-[8px]">
                        <span className="text-display-3 text-neutral-90 dark:text-neutral-30">
                            {translate("resources.merchant.fields.directions")}
                        </span>
                        <SimpleTable
                            columns={columns}
                            tableType={TableTypes.COLORED}
                            data={merchantDirections}
                            className="max-h-[24dvh]"
                        />
                    </div>
                </>
            ) : type === "fees" ? (
                <>
                    <div className="flex flex-col gap-[24px] pt-[24px] pl-[24px] pb-[24px]">
                        <div className="grid grid-cols-2">
                            <TextField
                                label={translate("resources.merchant.fields.descr")}
                                text={context.record.description}
                            />
                            <TextField label={"Keycloak ID"} text={context.record.keycloak_id} />
                        </div>
                    </div>
                    <Fees
                        id={id}
                        fees={fees}
                        feeTypes={data.feeTypes}
                        feesResource={FeesResource.MERCHANT}
                        addNewOpen={addNewFeeClicked}
                        setAddNewOpen={setAddNewFeeClicked}
                        className="max-h-[40dvh]"
                    />
                </>
            ) : (
                <div className="mt-5 w-full flex flex-col gap-[8px]">
                    <span className="text-display-3 text-neutral-90 dark:text-neutral-30">
                        {translate("resources.merchant.fields.directions")}
                    </span>
                    <SimpleTable columns={columns} tableType={TableTypes.COLORED} data={merchantDirections} />
                </div>
            )}
        </div>
    );
};
