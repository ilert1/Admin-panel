import { useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { TextField } from "@/components/ui/text-field";
import { FinancialInstitution } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { ToggleActiveUser } from "@/components/ui/toggle-active-user";

export interface DirectionsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const FinancialInstitutionShow = ({ id, onOpenChange }: DirectionsShowProps) => {
    const context = useAbortableShowController<FinancialInstitution>({ resource: "financialInstitution", id });
    const data = fetchDictionaries();
    const translate = useTranslate();

    if (context.isLoading || !context.record || !data) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-[42px] md:pb-[42px]">
            <div className="flex flex-row flex-wrap items-center justify-between md:flex-nowrap">
                <TextField text={context.record.id} copyValue className="text-neutral-70 dark:text-neutral-30" />

                <div className="mt-2 flex items-center justify-center self-start text-white sm:mt-0 sm:self-center">
                    <div className="flex items-center justify-center">
                        <ToggleActiveUser active={context.record.status === "ACTIVE" ? true : false} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 md:gap-[24px] md:pt-[24px]">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-[24px]">
                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.created_at")}
                        text={context.record.created_at}
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.updated_at")}
                        text={context.record.updated_at}
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.name")}
                        text={context.record.name}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.short_name")}
                        text={context.record.short_name || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.legal_name")}
                        text={context.record.legal_name || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.tax_id_number")}
                        text={context.record.tax_id_number || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.registration_number")}
                        text={context.record.registration_number || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.nspk_member_id")}
                        text={context.record.nspk_member_id || ""}
                        wrap
                        copyValue
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.institution_type")}
                        text={context.record.institution_type || ""}
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.payment_types")}
                        text={context.record.payment_types?.join(", ") || ""}
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.country_code")}
                        text={context.record.country_code}
                    />

                    <TextField
                        label={translate("resources.paymentTools.financialInstitution.fields.bic")}
                        text={context.record.bic || ""}
                    />
                </div>
            </div>
        </div>
    );
};
