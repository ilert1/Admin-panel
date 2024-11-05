import { FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { Button } from "@/components/ui/button";
import { CircleChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchUtils, useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { FeeCard } from "../../components/FeeCard";
import { AddFeeCard } from "../../components/AddFeeCard";
import { useGetMerchantShowColumns } from "./Columns";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";

interface MerchantShowProps {
    id: string;
    type: "fees" | "directions";
}

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const MerchantShow = (props: MerchantShowProps) => {
    const { id, type } = props;
    const translate = useTranslate();
    const data = fetchDictionaries();
    const context = useShowController({ resource: "merchant", id: props.id });
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
                // toast({});
            }
        };

        if (context.record) {
            fetchMerchantDirections();
        }
    }, [context.record]);

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }
    const fees = context.record.fees;
    return (
        <div className="p-[42px] pt-0">
            <span className="text-title-1">{context.record.name}</span>
            <TextField text={context.record.id} copyValue />
            {type === "fees" ? (
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
                    <div className="flex flex-col bg-neutral-0 px-[32px] rounded-[8px] w-full mx-[10px] mt-[10px] overflow-hidden">
                        <h3 className="text-display-3 mt-[16px] mb-[16px]">
                            {translate("resources.direction.fees.fees")}
                        </h3>
                        <div className="max-h-[42vh] overflow-auto pr-[10px]">
                            {fees && Object.keys(fees).length !== 0
                                ? Object.keys(fees).map(key => {
                                      const fee = fees[key];
                                      return (
                                          <FeeCard
                                              key={fee.id}
                                              account={fee.id}
                                              currency={fee.currency}
                                              feeAmount={fee.value.quantity / fee.value.accuracy}
                                              feeType={data.feeTypes[fee.type]?.type_descr || ""}
                                              id={id}
                                              resource={FeesResource.MERCHANT}
                                              description={fee.description}
                                          />
                                      );
                                  })
                                : ""}
                            {addNewFeeClicked && (
                                <AddFeeCard
                                    id={context.record.id}
                                    onOpenChange={setAddNewFeeClicked}
                                    resource={FeesResource.MERCHANT}
                                />
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => setAddNewFeeClicked(true)} className="my-6 w-1/4 flex gap-[4px]">
                            <CircleChevronRight className="w-[16px] h-[16px]" />
                            {translate("resources.direction.fees.addFee")}
                        </Button>
                    </div>
                </>
            ) : (
                <div className="mt-5 w-full flex flex-col gap-[8px]">
                    <span className="text-display-3 text-white">
                        {translate("resources.merchant.fields.directions")}
                    </span>
                    <SimpleTable columns={columns} tableType={TableTypes.COLORED} data={merchantDirections} />
                </div>
            )}
        </div>
    );
};

// directions
