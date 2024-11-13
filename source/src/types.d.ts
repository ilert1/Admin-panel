/* eslint-disable @typescript-eslint/no-unused-vars */
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
        amount: Omit<Amount, "type", "id">;
    };

    type RateInfo = {
        d_currency: string;
        s_currency: string;
        value: Value;
    };

    type Meta = {
        external_status: string;
        external_status_details: string;
        fail_url: string;
        success_url: string;
        customer_data: CustomerData;
    };

    type State = {
        final: boolean;
        state_description: string;
        state_int: number;
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
        callbcak_url: string;
        currency: string;
        customer_data: {
            account_name: string;
            customer_id: string;
        };
        payment_instrument: {
            payment_type: string;
        };
    };

    type Transaction = {
        id: string;
        committed: boolean;
        created_at: string;
        destination: Account;
        dispute: boolean;
        fees: Fee[];
        meta: Meta;
        payload?: Payload;
        rate_info: RateInfo;
        result: Result;
        source: Account;
        state: State;
        type: number;
    };

    type Fee = {
        recipient: string;
        type: number;
        currency: string;
        direction: number;
        value: Value;
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
        state: number;
        name: string;
        created_at: string;
        deleted_at: string;
        login: string;
        email: string;
        public_key: string;
        shop_currency: string;
        shop_api_key: string;
        shop_sign_key: string;
        shop_balance_key: string;
        password: string;
        state?: number;
    }
}

declare namespace Currencies {
    enum PositionEnum {
        BEFORE = "before",
        AFTER = "after"
    }

    interface Currency {
        symbol: string | null;
        position: PositionEnum;
        is_coin: boolean;
        code: string;
        id: string;
    }
}

interface Merchant {
    id: string;
    name: string;
    description: string | null;
    keycloak_id: string | null;
    fees: Fees | Record<string, never> | null;
}

interface Provider {
    fields_json_schema: string;
    public_key: string | null;
    methods: { [key: string]: string };
    name: string;
    id: string;
}

interface IGetKeys {
    keypair: { private_key: string; public_key: string };
    provider: Omit<Provider, "id">;
}
namespace Directions {
    interface FeeValue {
        accuracy: number;
        quantity: number;
    }

    interface Fee {
        id: string;
        type: number;
        value: FeeValue;
        currency: string;
        recipient: string;
        description: string;
    }

    interface FeeCreate {
        type: number | string;
        value: number;
        currency: string;
        description: string;
        recipient: string;
        direction: string | number;
        innerId?: string;
    }

    interface Fees {
        [key: string]: Fee;
    }

    interface Direction {
        id: string;
        name: string;
        merchant: Merchant;
        account_id: string;
        active: boolean;
        description: string | null;
        weight: number;
        src_currency: Omit<Currencies.Currency, "id">;
        dst_currency: Omit<Currencies.Currency, "id">;
        provider: Omit<Provider, "id">;
        auth_data: object;
        fees: Fees | Record<string, never> | null;
    }

    interface DirectionCreate {
        name: string;
        description: string | null;
        src_currency: string;
        dst_currency: string;
        merchant: string;
        provider: string;
        weight: number;
        // fees: Fees | Record<string, never> | null;
    }
}

declare namespace Dictionaries {
    interface State {
        state_int: number;
        state_description: string;
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

    interface TransactionTypes {
        [key: string]: TypeDescriptor;
    }

    interface DataObject {
        accountStates: AccountStates;
        accountTypes: AccountTypes;
        feeTypes: FeeTypes;
        participantType: ParticipantTypes;
        states: States;
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
enum WalletTypes {
    INTERNAL = "internal",
    LINKED = "linked",
    EXTERNAL = "external"
}

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

interface WalletStorage {
    recieved_shares: number;
    sealed: boolean;
    split_max: number;
    split_min: number;
    state: "sealed" | "unsealed" | "waiting";
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
}
