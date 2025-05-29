import { PaymentTypeModel } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { PaymentTypeIcon } from "./PaymentTypeIcon";
import { Label } from "@/components/ui/label";
import { useTranslate } from "react-admin";

interface PaymentsTypesShowProps {
    payment_types: PaymentTypeModel[] | undefined;
}

export const PaymentsTypesShowComponent = (props: PaymentsTypesShowProps) => {
    const { payment_types } = props;
    const translate = useTranslate();

    return (
        <div>
            <Label>{translate("resources.paymentTools.paymentType.name")}</Label>
            <div className="flex flex-wrap gap-2">
                {payment_types && payment_types.length > 0
                    ? payment_types.map(type => {
                          return <PaymentTypeIcon type={type.code} key={type.code} tooltip />;
                      })
                    : "-"}
            </div>
        </div>
    );
};
