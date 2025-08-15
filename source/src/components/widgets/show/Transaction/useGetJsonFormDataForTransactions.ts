import { useTranslate } from "react-admin";

export const useGetJsonFormDataForTransactions = () => {
    const translate = useTranslate();

    const adminSchema = {
        type: "object",
        properties: {
            attempts: {
                type: ["integer", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.attempts")
            },
            financial_institution_code: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.financial_institution_code")
            },
            financial_institution_type: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.financial_institution_type")
            },
            financial_institution_reference: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.financial_institution_reference")
            },
            financial_institution_bic: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.financial_institution_bic")
            },
            financial_institution_bin: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.financial_institution_bin")
            },
            financial_institution_country: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.financial_institution_country")
            },
            financial_institution_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.financial_institution_name")
            },
            otp_code: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.otp_code")
            },
            bank_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.bank_name")
            },
            card_number: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_number")
            },
            card_first_digits: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_first_digits")
            },
            card_last_digits: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_last_digits")
            },
            card_cvc: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_cvc")
            },
            card_holder: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_holder")
            },
            card_lifetime: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_lifetime")
            },
            card_lifetime_month: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_lifetime_month")
            },
            card_lifetime_year: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.card_lifetime_year")
            },
            iban_number: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.iban_number")
            },
            iban_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.iban_name")
            },
            phone_number: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.phone_number")
            },
            phone_last_digits: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.phone_last_digits")
            },
            account_number: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.account_number")
            },
            account_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.account_name")
            },
            blockchain_network: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.blockchain_network")
            },
            blockchain_address: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.blockchain_address")
            },
            hash: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.hash")
            },
            hash_link: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.callbridge.history.show.fields.hash_link")
            },
            customer_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.customer_id")
            },
            customer_payment_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.customer_payment_id")
            },
            customer_phone_number: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.phone_number")
            },
            email: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.email")
            },
            first_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.first_name")
            },
            last_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.last_name")
            },
            country: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.country")
            },
            user_agent: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.user_agent")
            },
            ip: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.ip")
            },
            fingerprint: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.fingerprint")
            }
        }
    };

    const adminUISchema = {
        type: "GridLayout",
        options: {
            variant: "grid",
            columns: 3,
            gap: "1rem"
        },
        elements: [
            {
                type: "Control",
                scope: "#/properties/attempts"
            },
            {
                type: "Control",
                scope: "#/properties/financial_institution_code"
            },
            {
                type: "Control",
                scope: "#/properties/financial_institution_type"
            },
            {
                type: "Control",
                scope: "#/properties/financial_institution_reference"
            },
            {
                type: "Control",
                scope: "#/properties/financial_institution_bic"
            },
            {
                type: "Control",
                scope: "#/properties/financial_institution_bin"
            },
            {
                type: "Control",
                scope: "#/properties/financial_institution_country"
            },
            {
                type: "Control",
                scope: "#/properties/financial_institution_name"
            },
            {
                type: "Control",
                scope: "#/properties/otp_code"
            },
            {
                type: "Control",
                scope: "#/properties/bank_name"
            },
            {
                type: "Control",
                scope: "#/properties/card_number"
            },
            {
                type: "Control",
                scope: "#/properties/card_first_digits"
            },
            {
                type: "Control",
                scope: "#/properties/card_last_digits"
            },
            {
                type: "Control",
                scope: "#/properties/card_cvc"
            },
            {
                type: "Control",
                scope: "#/properties/card_holder"
            },
            {
                type: "Control",
                scope: "#/properties/card_lifetime"
            },
            {
                type: "Control",
                scope: "#/properties/card_lifetime_month"
            },
            {
                type: "Control",
                scope: "#/properties/card_lifetime_year"
            },
            {
                type: "Control",
                scope: "#/properties/iban_number"
            },
            {
                type: "Control",
                scope: "#/properties/iban_name"
            },
            {
                type: "Control",
                scope: "#/properties/phone_number"
            },
            {
                type: "Control",
                scope: "#/properties/phone_last_digits"
            },
            {
                type: "Control",
                scope: "#/properties/account_number"
            },
            {
                type: "Control",
                scope: "#/properties/account_name"
            },
            {
                type: "Control",
                scope: "#/properties/blockchain_network"
            },
            {
                type: "Control",
                scope: "#/properties/blockchain_address"
            },
            {
                type: "Control",
                scope: "#/properties/hash"
            },
            {
                type: "Control",
                scope: "#/properties/hash_link"
            },
            {
                type: "Control",
                scope: "#/properties/customer_id"
            },
            {
                type: "Control",
                scope: "#/properties/customer_payment_id"
            },
            {
                type: "Control",
                scope: "#/properties/customer_phone_number"
            },
            {
                type: "Control",
                scope: "#/properties/email"
            },
            {
                type: "Control",
                scope: "#/properties/first_name"
            },
            {
                type: "Control",
                scope: "#/properties/last_name"
            },
            {
                type: "Control",
                scope: "#/properties/country"
            },
            {
                type: "Control",
                scope: "#/properties/user_agent"
            },
            {
                type: "Control",
                scope: "#/properties/ip"
            },
            {
                type: "Control",
                scope: "#/properties/fingerprint"
            }
        ]
    };

    const merchantSchema = {
        type: "object",
        properties: {
            customer_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.customer_id")
            },
            customer_payment_id: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.customer_payment_id")
            },
            phone_number: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.phone_number")
            },
            email: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.email")
            },
            first_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.first_name")
            },
            last_name: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.last_name")
            },
            country: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.country")
            },
            user_agent: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.user_agent")
            },
            ip: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.ip")
            },
            fingerprint: {
                type: ["string", "null"],
                readOnly: true,
                title: translate("resources.transactions.fields.meta.fingerprint")
            }
        }
    };

    const merchantUISchema = {
        type: "GridLayout",
        options: {
            variant: "grid",
            columns: 3,
            gap: "1rem"
        },
        elements: [
            {
                type: "Control",
                scope: "#/properties/customer_id"
            },
            {
                type: "Control",
                scope: "#/properties/customer_payment_id"
            },
            {
                type: "Control",
                scope: "#/properties/phone_number"
            },
            {
                type: "Control",
                scope: "#/properties/email"
            },
            {
                type: "Control",
                scope: "#/properties/first_name"
            },
            {
                type: "Control",
                scope: "#/properties/last_name"
            },
            {
                type: "Control",
                scope: "#/properties/country"
            },
            {
                type: "Control",
                scope: "#/properties/user_agent"
            },
            {
                type: "Control",
                scope: "#/properties/ip"
            },
            {
                type: "Control",
                scope: "#/properties/fingerprint"
            }
        ]
    };

    return { merchantSchema, merchantUISchema, adminSchema, adminUISchema };
};
