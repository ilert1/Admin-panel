/// <reference types="vite-plugin-svgr/client" />

interface Window {
    addSupportMessage?: (text: string) => void;
}

type Value = {
    quantity: number;
    accuracy: number;
};

type Amount = {
    currency: string;
    shop_currency: string;
    id: string;
    type: string;
    value: Value;
    holds: Value;
};

type Meta = {
    caption: string;
};

type CustomerData = {
    customer_id: string;
    customer_payment_id: string;
};

type Account = {
    id: string;
    amounts: Amount[];
    meta: Meta;
    owner_id: string;
    state: number;
    type: number;
};

interface AccountHistory {
    id: string;
    account_balance: string;
    account_id: string;
    amount_currency: string;
    amount_value: string;
    created_at: string;
    transaction_id: string;
    updated_at: string;
}

interface AccountBalance {
    currency: string;
    value: {
        quantity: number;
        accuracy: number;
    };
    holds: {
        quantity: number;
        accuracy: number;
    };
}

declare namespace PayOut {
    type PaymentType = "sbp" | "card2card" | "account_number" | "account_number_iban" | "sberpay";

    interface Response {
        success: boolean;
        data: PayMethod[];
    }
    interface PayMethod {
        bank: string;
        bankName: string;
        compareAccountLast4DigitsEnabled: boolean;
        compareCardLast4DigitsEnabled: boolean;
        customerFields: PayField[];
        enabled: boolean;
        fiatCurrency: string;
        fiatCurrencySymbol: string;
        fiatCurrencySymbolPosition: string;
        fields: PayField[];
        parallelGroupOrdersEnabled: boolean;
        paymentType: PaymentType;
        paymentTypeName: string;
    }

    interface PayField {
        hidden: boolean | null;
        maxLength: boolean | null;
        name: string;
        pattern: boolean | null;
        patternExample: boolean | null;
        readonly: boolean | null;
        required: boolean | null;
        type: string;
        unique: boolean | null;
    }
}

declare namespace Transaction {
    type Account = {
        id: string;
        amount: Omit<Amount, "type", "id", "shop_currency">;
    };

    type RateInfo = {
        d_currency: string;
        s_currency: string;
        value: Value;
    };

    type Meta = {
        payment_type: string;
        provider: string;
        external_status: string;
        external_status_details: string;
        fail_url: string;
        success_url: string;
        customer_data: CustomerData;
    };

    type State = {
        final: boolean;
        state_description?: string;
        state_int?: number;
        state_ingress_description?: string;
        state_int_ingress: number;
    };

    type Result = {
        data: {
            callback_url: string;
            external_id: string;
            token: string;
        };
        error: number;
        error_details: {
            error_message: string;
            external_error_code: string;
            external_error_message: string | null;
            extra_data: string | null;
        };
        paymentUrl: string;
        provider: string;
    };

    type Payload = {
        amount: number;
        callback_url?: string;
        currency: string;
        customer_data: {
            account_name: string;
            customer_id: string;
            card_holder_name?: string;
            card_no?: string;
        };
        payment_instrument?: {
            payment_type: string;
        };
        fail_url?: string;
        success_url?: string;
    };

    type TransactionAccountRequisites = {
        requisites: [
            {
                financial_institution_code: string | null;
                financial_institution_type: string | null;
                financial_institution_reference: string | null;
                financial_institution_bic: string | null;
                financial_institution_bin: string | null;
                financial_institution_country: string | null;
                financial_institution_name: string | null;
                otp_code: string | null;
                bank_name: string | null;
                card_number: string | null;
                card_first_digits?: string | null;
                card_last_digits?: string | null;
                card_cvc?: string | null;
                card_holder?: string | null;
                card_lifetime?: string | null;
                card_lifetime_month?: string | null;
                card_lifetime_year?: string | null;
                iban_number?: string | null;
                iban_name?: string | null;
                phone_number?: string | null;
                phone_last_digits?: string | null;
                account_number?: string | null;
                account_name?: string | null;
                blockchain_network?: string | null;
                blockchain_address?: string | null;
                hash?: string | null;
                hash_link?: string | null;
            }
        ];
    };

    type Transaction = {
        id: string;
        committed: boolean;
        created_at: string;
        destination: {
            id: string;
            amount: Omit<Amount, "type", "shop_currency">;
        } & TransactionAccountRequisites;
        dispute: boolean;
        fees: import("./api/enigma/blowFishEnigmaAPIService.schemas").Fee[];
        meta: Meta;
        payload?: Payload;
        rate_info: RateInfo;
        result: Result;
        source: Account & TransactionAccountRequisites;
        state: State;
        type: number;
    };

    type TransactionView = {
        id: string;
        created_at: string;
        updated_at: string;
        type_id: number;
        type_text: string;
        state_id?: number;
        state_id_merchant: number;
        state_text: string;
        state_final: boolean;
        participant_id: string;
        participant_name: string;
        customer_id: string;
        customer_payment_id: string;
        source_amount_currency: string;
        source_amount_value: string;
        destination_amount_currency: string;
        destination_amount_value: string;
        rate: string;
        rate_source_currency: string;
        rate_destination_currency: string;
        provider_name: string;
    };

    type TransactionStateUpdate = {
        id: string;
        state: {
            state_int?: number;
            state_int_ingress: number;
            state_description?: string;
            state_ingress_description?: string;
            final: boolean;
        };
        amount: {
            currency: string;
            value: {
                quantity: number;
                accuracy: number;
            };
        };
        provider: string;
        external_id: string;
        external_status: string;
        external_status_details: string;
        callback_id: string;
    };
}

declare namespace JWT {
    interface Payload {
        exp: number;
        iat: number;
        auth_time: number;
        jti: string;
        iss: string;
        aud: string;
        sub: string;
        typ: string;
        azp: string;
        nonce: string;
        session_state: string;
        acr: string;
        "allowed-origins": string[];
        realm_access: {
            roles: string[];
        };
        resource_access: {
            account: {
                roles: string[];
            };
        };
        scope: string;
        sid: string;
        email_verified: true;
        name: string;
        merchant_id: string;
        preferred_username: string;
        given_name: string;
        family_name: string;
        email: string;
    }
}

declare namespace Users {
    interface User {
        id: string;
        created_at: string;
        login: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        merchant_id: string;
        merchant_name?: string;
        roles: {
            name: string;
            description: string;
        }[];
        password: string;
        activity: boolean;
    }
    interface UserCreate {
        state: number;
        name: string;
        login: string;
        email: string;
        public_key: string;
        shop_currency: string;
        password: string;
        state?: number;
    }
    interface PasswordChange {
        currentPassword: string;
        newPassword: string;
        newPasswordRepeat: string;
    }
}

declare namespace Dictionaries {
    interface State {
        state_int?: number;
        state_description?: string;
        state_ingress_description?: string;
        state_int_ingress: number;
        final: boolean;
    }

    interface TypeDescriptor {
        type: number;
        type_descr: string;
    }

    interface AccountStates {
        [key: string]: TypeDescriptor;
    }

    interface AccountTypes {
        [key: string]: TypeDescriptor;
    }

    interface FeeTypes {
        [key: string]: TypeDescriptor;
    }

    interface ParticipantTypes {
        [key: string]: TypeDescriptor;
    }

    interface States {
        [key: string]: State;
    }

    interface IngressStates {
        [key: string]: State;
    }

    interface TransactionTypes {
        [key: string]: TypeDescriptor;
    }

    interface DataObject {
        accountStates: AccountStates;
        accountTypes: AccountTypes;
        feeTypes: FeeTypes;
        participantType: ParticipantTypes;
        states: States;
        ingressStates: States;
        transactionTypes: TransactionTypes;
    }

    interface Currency {
        [key: string]: string;
        "alpha-3": string;
        code: number;
        "minor-unit": number;
        "name-en": string;
        "name-ru": string;
        prior_gr: number;
    }
}

declare namespace Wallets {
    interface Wallet {
        id: string;
        description: string | null;
        type: WalletTypes;
        blockchain: string;
        network: string;
        address: string | null;
        currency: string;
        account_id: string;
        minimal_ballance_limit: number;
    }

    interface WalletCreate {
        description: string | null;
        type: WalletTypes;
        blockchain: string;
        network: string;
        address?: string | null;
        currency: string;
        account_id?: string;
        minimal_ballance_limit: number;
        accountNumber?: string;
        merchantId?: string;
    }

    interface WalletStorage {
        initiated: boolean;
        recieved_shares: number;
        sealed: boolean;
        split_max: number;
        split_min: number;
        state: "sealed" | "unsealed" | "waiting";
    }

    interface WalletBalance {
        trx_amount: number;
        usdt_amount: number;
        wallet?: {
            address: string;
        };
    }

    interface Cryptotransactions {
        blowfish_id: string;
        id: string;
        src_wallet: string;
        dst_wallet: string;
        amount_quantity: number;
        amount_accuracy: number;
        currency: string;
        state: number | string;
        type: number | string;
        merchant_id: string;
        tx_id: string;
        tx_link: string;
        total_fee: number;
        bandwidth_fee: number;
        created_at: string;
        updated_at: string;
        deleted_at: string;
        pre_calculated_fee: number;
        total_fee: number;
    }

    interface WalletLinkedTransactions {
        id: string;
        scanned_at: string;
        block_timestamp: string;
        type: string;
        transaction_id: string;
        source_address: string;
        destnation_address: string;
        amount: string;
        currency: string;
        token_address: string;
    }
}

interface ICombinedBalances {
    value: { quantity: number; accuracy: number };
    currency: string;
    type: "balance" | "hold";
}

interface KecloakRoles {
    clientRole: boolean;
    composite: boolean;
    containerId: string;
    description: string;
    id: string;
    name: string;
}

declare namespace Merchant {
    interface Uniqueness {
        deposit: {
            max: number;
            min: number;
            mode: string;
            chance: number;
            enable: boolean;
        };
    }

    interface SettingsResponse {
        id: string;
        name: string;

        antifraoud_attempts: number;
        antifraud: boolean;
        meta: object;

        public_key: string;
        created_at: string;
        updated_at: string;

        uniqueness: Uniqueness;
    }

    interface SettingsUpdate {
        antifraoud_attempts?: number;
        antifraud?: boolean;
        public_key: string;
        uniqueness: {
            deposit: {
                max: string;
                min: string;
                mode: string;
                chance: number;
                enable: boolean;
            };
        };
    }
}
